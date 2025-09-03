import { ResumeMaster, Variant, VariantRule, VariantOverride } from '@/types/resume';

export class VariantResolver {
  static resolveVariant(master: ResumeMaster, variant: Variant): ResumeMaster {
    // Start with a deep copy of the master resume
    let resolved = JSON.parse(JSON.stringify(master)) as ResumeMaster;

    // Apply variant section settings first
    resolved = this.applySectionSettings(resolved, variant);

    // Apply custom content
    resolved = this.applyCustomContent(resolved, variant);

    // Apply rules
    resolved = this.applyRules(resolved, variant.rules);

    // Then apply overrides
    resolved = this.applyOverrides(resolved, variant.overrides);

    return resolved;
  }

  private static applySectionSettings(resume: ResumeMaster, variant: Variant): ResumeMaster {
    const result = { ...resume };
    
    // Ensure sectionSettings exists with defaults if missing
    const sectionSettings = variant.sectionSettings || {
      headline: { enabled: true },
      summary: { enabled: false },
      key_achievements: { enabled: false },
      experience: { enabled: true },
      education: { enabled: true },
      awards: { enabled: true },
      skills: { enabled: true }
    };

    
    
    // Handle headline specially since it's not in the sections object
    if (sectionSettings.headline && !sectionSettings.headline.enabled) {
      result.headline = '';
    }
    
    // Update section settings based on variant configuration
    const newSections = { ...resume.sections };
    
    Object.entries(sectionSettings).forEach(([sectionKey, settings]) => {
      // Skip headline since it's handled above
      if (sectionKey === 'headline') return;
      
      
      // Safety check - ensure settings exists and has enabled property
      if (!settings || typeof settings !== 'object') {
        console.warn(`Invalid section settings for ${sectionKey} - not an object:`, settings);
        return;
      }
      
      if (!('enabled' in settings)) {
        console.warn(`Invalid section settings for ${sectionKey} - missing enabled property:`, settings);
        return;
      }
      
      const section = newSections[sectionKey as keyof typeof newSections];
      if (section) {
        section.enabled = settings.enabled;
      }
    });
    
    result.sections = newSections;
    return result;
  }

  private static applyCustomContent(resume: ResumeMaster, variant: Variant): ResumeMaster {
    // Custom content is now handled entirely through overrides
    return resume;
  }

  private static applyRules(resume: ResumeMaster, rules: VariantRule[]): ResumeMaster {
    let result = { ...resume };

    // If no rules are provided, return the resume unchanged - show all content
    if (!rules || rules.length === 0) {
      return result;
    }

    for (const rule of rules) {
      switch (rule.type) {
        case 'include_tags':
          result = this.filterByIncludeTags(result, rule.value);
          break;
        case 'exclude_tags':
          result = this.filterByExcludeTags(result, rule.value);
          break;
        case 'max_bullets':
          result = this.limitBullets(result, rule.value);
          break;
        case 'section_order':
          result = this.reorderSections(result, rule.value);
          break;
        case 'date_range':
          result = this.filterByDateRange(result, rule.value);
          break;
      }
    }

    return result;
  }

  private static applyOverrides(resume: ResumeMaster, overrides: VariantOverride[]): ResumeMaster {
    let result = JSON.parse(JSON.stringify(resume)) as ResumeMaster;

    for (const override of overrides) {
      result = this.applyOverride(result, override);
    }

    return result;
  }

  private static filterByIncludeTags(resume: ResumeMaster, tags: string[]): ResumeMaster {
    const filtered = { ...resume };

    // Only filter if tags are specified and not empty
    if (!tags || tags.length === 0) {
      return filtered; // Return all experiences if no tags specified
    }

    // Filter experience entries by tags
    filtered.experience = resume.experience.filter(exp => 
      exp.tags && exp.tags.some(tag => tags.includes(tag))
    );

    return filtered;
  }

  private static filterByExcludeTags(resume: ResumeMaster, tags: string[]): ResumeMaster {
    const filtered = { ...resume };

    // Only filter if tags are specified and not empty
    if (!tags || tags.length === 0) {
      return filtered; // Return all experiences if no tags specified
    }

    // Filter out experience entries with excluded tags
    filtered.experience = resume.experience.filter(exp => 
      !exp.tags || !exp.tags.some(tag => tags.includes(tag))
    );

    return filtered;
  }

  private static limitBullets(resume: ResumeMaster, maxBullets: number): ResumeMaster {
    const limited = { ...resume };

    // Limit bullets in experience entries
    limited.experience = resume.experience.map(exp => ({
      ...exp,
      bullets: exp.bullets.slice(0, maxBullets)
    }));

    // Limit summary bullets
    if (resume.summary) {
      limited.summary = resume.summary.slice(0, maxBullets);
    }

    // Limit achievements bullets
    if (resume.key_achievements) {
      limited.key_achievements = resume.key_achievements.slice(0, maxBullets);
    }

    return limited;
  }

  private static reorderSections(resume: ResumeMaster, sectionOrder: string[]): ResumeMaster {
    const result = { ...resume };
    
    // Update section order in the sections object
    if (result.sections && sectionOrder && sectionOrder.length > 0) {
      const newSections = { ...result.sections };
      
      // Apply new order numbers based on the provided sectionOrder array
      sectionOrder.forEach((sectionId, index) => {
        if (newSections[sectionId as keyof typeof newSections]) {
          newSections[sectionId as keyof typeof newSections].order = index + 1;
        }
      });
      
      result.sections = newSections;
    }
    
    return result;
  }

  private static filterByDateRange(resume: ResumeMaster, dateRange: { start: string; end: string }): ResumeMaster {
    const filtered = { ...resume };

    // Only filter if valid date range is provided
    if (!dateRange || !dateRange.start || !dateRange.end) {
      return filtered; // Return all experiences if no valid date range
    }

    // Filter experience by date range
    filtered.experience = resume.experience.filter(exp => {
      if (!exp.date_start) return true; // Include experiences without start dates
      
      try {
        const expStart = new Date(exp.date_start);
        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);

        // Include if experience starts within or overlaps the range
        return expStart >= rangeStart && expStart <= rangeEnd;
      } catch (error) {
        console.warn('Invalid date in experience or range:', error);
        return true; // Include experiences with invalid dates rather than exclude
      }
    });

    return filtered;
  }

  private static applyOverride(resume: ResumeMaster, override: VariantOverride): ResumeMaster {
    const pathParts = override.path.split('.');
    const result = { ...resume };

    // Special handling for experience_order
    if (override.path === 'experience_order' && override.operation === 'set') {
      result.experience = this.reorderExperience(result.experience, override.value);
      return result;
    }

    switch (override.operation) {
      case 'set':
        this.setNestedProperty(result, pathParts, override.value);
        break;
      case 'add':
        this.addToNestedArray(result, pathParts, override.value);
        break;
      case 'remove':
        this.removeFromNested(result, pathParts, override.value);
        break;
    }

    return result;
  }

  private static reorderExperience(experiences: any[], order: string[]): any[] {
    if (!Array.isArray(order) || order.length === 0) {
      return experiences;
    }

    const experienceMap = new Map(experiences.map(exp => [exp.id, exp]));
    const reordered = [];

    // Add experiences in the specified order
    for (const id of order) {
      const experience = experienceMap.get(id);
      if (experience) {
        reordered.push(experience);
        experienceMap.delete(id);
      }
    }

    // Add any remaining experiences that weren't in the order list
    for (const experience of experienceMap.values()) {
      reordered.push(experience);
    }

    return reordered;
  }

  private static setNestedProperty(obj: any, path: string[], value: any): void {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  }

  private static addToNestedArray(obj: any, path: string[], value: any): void {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    const arrayKey = path[path.length - 1];
    if (!Array.isArray(current[arrayKey])) {
      current[arrayKey] = [];
    }
    current[arrayKey].push(value);
  }

  private static removeFromNested(obj: any, path: string[], value: any): void {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) {
        return; // Path doesn't exist
      }
      current = current[path[i]];
    }
    
    const key = path[path.length - 1];
    if (Array.isArray(current[key])) {
      current[key] = current[key].filter((item: any) => 
        JSON.stringify(item) !== JSON.stringify(value)
      );
    } else {
      delete current[key];
    }
  }

  static generateDiff(master: ResumeMaster, resolved: ResumeMaster): any {
    // Simple diff implementation - could be enhanced with jsondiffpatch
    const diff = {
      added: [] as string[],
      removed: [] as string[],
      modified: [] as string[]
    };

    // Compare experience entries
    const masterExpIds = new Set(master.experience.map(exp => exp.id));
    const resolvedExpIds = new Set(resolved.experience.map(exp => exp.id));

    // Find added/removed experiences
    for (const id of resolvedExpIds) {
      if (!masterExpIds.has(id)) {
        diff.added.push(`Experience: ${resolved.experience.find(exp => exp.id === id)?.title}`);
      }
    }

    for (const id of masterExpIds) {
      if (!resolvedExpIds.has(id)) {
        diff.removed.push(`Experience: ${master.experience.find(exp => exp.id === id)?.title}`);
      }
    }

    // Check for modified content
    if (master.summary?.length !== resolved.summary?.length) {
      diff.modified.push('Summary bullets modified');
    }

    if (master.key_achievements?.length !== resolved.key_achievements?.length) {
      diff.modified.push('Key achievements modified');
    }

    return diff;
  }
}