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
    if (!sectionSettings.headline.enabled) {
      result.headline = '';
    }
    
    // Update section settings based on variant configuration
    const newSections = { ...resume.sections };
    
    Object.entries(sectionSettings).forEach(([sectionKey, settings]) => {
      // Skip headline since it's handled above
      if (sectionKey === 'headline') return;
      
      if (newSections[sectionKey as keyof typeof newSections]) {
        newSections[sectionKey as keyof typeof newSections].enabled = settings.enabled;
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

    // Filter experience entries by tags
    filtered.experience = resume.experience.filter(exp => 
      exp.tags.some(tag => tags.includes(tag))
    );

    return filtered;
  }

  private static filterByExcludeTags(resume: ResumeMaster, tags: string[]): ResumeMaster {
    const filtered = { ...resume };

    // Filter out experience entries with excluded tags
    filtered.experience = resume.experience.filter(exp => 
      !exp.tags.some(tag => tags.includes(tag))
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
    // This would be implemented based on how sections are structured
    // For now, return as-is since our current structure doesn't support dynamic ordering
    return resume;
  }

  private static filterByDateRange(resume: ResumeMaster, dateRange: { start: string; end: string }): ResumeMaster {
    const filtered = { ...resume };

    // Filter experience by date range
    filtered.experience = resume.experience.filter(exp => {
      const expStart = new Date(exp.date_start);
      const rangeStart = new Date(dateRange.start);
      const rangeEnd = new Date(dateRange.end);

      return expStart >= rangeStart && expStart <= rangeEnd;
    });

    return filtered;
  }

  private static applyOverride(resume: ResumeMaster, override: VariantOverride): ResumeMaster {
    const pathParts = override.path.split('.');
    const result = { ...resume };

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