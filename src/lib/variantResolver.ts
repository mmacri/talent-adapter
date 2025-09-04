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
        // Ensure consistent date parsing by adding day if missing
        const normalizeDate = (dateStr: string) => {
          if (!dateStr) return null;
          // If in YYYY-MM format, add day to prevent timezone issues
          if (/^\d{4}-\d{2}$/.test(dateStr)) {
            return `${dateStr}-01`;
          }
          return dateStr;
        };

        const expStart = new Date(normalizeDate(exp.date_start) + 'T00:00:00'); // Force local timezone
        const rangeStart = new Date(normalizeDate(dateRange.start) + 'T00:00:00'); // Force local timezone  
        const rangeEnd = new Date(normalizeDate(dateRange.end) + 'T23:59:59'); // Force local timezone

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

  static generateDiff(master: ResumeMaster, resolved: ResumeMaster, variant?: any): any {
    const diff = {
      sections: {
        added: [] as string[],
        removed: [] as string[],
        modified: [] as string[],
        reordered: [] as string[]
      },
      experiences: {
        added: [] as string[],
        removed: [] as { title: string; company: string; reason: string }[],
        reordered: false,
        modified: [] as { title: string; company: string; changes: string[] }[],
        originalOrder: [] as string[],
        newOrder: [] as string[]
      },
      content: {
        headline: {
          changed: master.headline !== resolved.headline,
          original: master.headline,
          modified: resolved.headline
        },
        summary: {
          changed: (master.summary?.length || 0) !== (resolved.summary?.length || 0),
          originalCount: master.summary?.length || 0,
          modifiedCount: resolved.summary?.length || 0,
          difference: (resolved.summary?.length || 0) - (master.summary?.length || 0)
        },
        keyAchievements: {
          changed: (master.key_achievements?.length || 0) !== (resolved.key_achievements?.length || 0),
          originalCount: master.key_achievements?.length || 0,
          modifiedCount: resolved.key_achievements?.length || 0,
          difference: (resolved.key_achievements?.length || 0) - (master.key_achievements?.length || 0)
        }
      },
      rules: {
        applied: [] as { type: string; description: string; impact: string }[]
      },
      overrides: {
        applied: [] as { path: string; operation: string; description: string }[]
      },
      stats: {
        masterExperiences: master.experience?.length || 0,
        resolvedExperiences: resolved.experience?.length || 0,
        experienceReduction: (master.experience?.length || 0) - (resolved.experience?.length || 0),
        totalBulletsOriginal: master.experience?.reduce((sum, exp) => sum + exp.bullets.length, 0) || 0,
        totalBulletsResolved: resolved.experience?.reduce((sum, exp) => sum + exp.bullets.length, 0) || 0,
        bulletReduction: (master.experience?.reduce((sum, exp) => sum + exp.bullets.length, 0) || 0) - 
                         (resolved.experience?.reduce((sum, exp) => sum + exp.bullets.length, 0) || 0)
      }
    };

    // Analyze variant rules if provided
    if (variant?.rules) {
      variant.rules.forEach((rule: any) => {
        let description = '';
        let impact = '';
        
        switch (rule.type) {
          case 'include_tags':
            description = `Include only experiences with tags: ${rule.value.join(', ')}`;
            const includedCount = master.experience?.filter(exp => 
              exp.tags && exp.tags.some(tag => rule.value.includes(tag))
            ).length || 0;
            impact = `${includedCount} of ${master.experience?.length || 0} experiences included`;
            break;
          case 'exclude_tags':
            description = `Exclude experiences with tags: ${rule.value.join(', ')}`;
            const excludedCount = master.experience?.filter(exp => 
              exp.tags && exp.tags.some(tag => rule.value.includes(tag))
            ).length || 0;
            impact = `${excludedCount} experiences excluded`;
            break;
          case 'max_bullets':
            description = `Limit bullets to maximum ${rule.value} per experience`;
            const totalBulletReduction = master.experience?.reduce((sum, exp) => 
              sum + Math.max(0, exp.bullets.length - rule.value), 0) || 0;
            impact = `${totalBulletReduction} bullets removed total`;
            break;
          case 'section_order':
            description = `Reorder sections: ${rule.value.join(' → ')}`;
            impact = 'Section order customized';
            break;
          case 'date_range':
            description = `Filter by date range: ${rule.value.start} to ${rule.value.end}`;
            const inRangeCount = master.experience?.filter(exp => {
              if (!exp.date_start) return true;
              try {
                const expStart = new Date(exp.date_start);
                const rangeStart = new Date(rule.value.start);
                const rangeEnd = new Date(rule.value.end);
                return expStart >= rangeStart && expStart <= rangeEnd;
              } catch {
                return true;
              }
            }).length || 0;
            impact = `${inRangeCount} of ${master.experience?.length || 0} experiences in range`;
            break;
        }
        
        diff.rules.applied.push({
          type: rule.type,
          description,
          impact
        });
      });
    }

    // Analyze variant overrides if provided
    if (variant?.overrides) {
      variant.overrides.forEach((override: any) => {
        let description = '';
        
        switch (override.operation) {
          case 'set':
            if (override.path === 'experience_order') {
              description = `Reorder experiences: ${override.value.length} positions specified`;
            } else {
              description = `Set ${override.path} to new value`;
            }
            break;
          case 'add':
            description = `Add item to ${override.path}`;
            break;
          case 'remove':
            description = `Remove item from ${override.path}`;
            break;
        }
        
        diff.overrides.applied.push({
          path: override.path,
          operation: override.operation,
          description
        });
      });
    }

    // Compare sections with detailed analysis
    Object.entries(master.sections || {}).forEach(([key, masterSection]) => {
      const resolvedSection = resolved.sections?.[key];
      const sectionName = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (masterSection.enabled && (!resolvedSection || !resolvedSection.enabled)) {
        diff.sections.removed.push(sectionName);
      } else if (!masterSection.enabled && resolvedSection?.enabled) {
        diff.sections.added.push(sectionName);
      } else if (masterSection.order !== resolvedSection?.order) {
        diff.sections.reordered.push(`${sectionName} moved from position ${masterSection.order} to ${resolvedSection?.order}`);
      }
    });

    // Compare experience entries with detailed analysis
    const masterExpIds = master.experience?.map(exp => exp.id) || [];
    const resolvedExpIds = resolved.experience?.map(exp => exp.id) || [];

    // Track original and new order
    diff.experiences.originalOrder = master.experience?.map(exp => `${exp.company} - ${exp.title}`) || [];
    diff.experiences.newOrder = resolved.experience?.map(exp => `${exp.company} - ${exp.title}`) || [];

    // Check for filtering/removal with reasons
    masterExpIds.forEach(id => {
      if (!resolvedExpIds.includes(id)) {
        const exp = master.experience?.find(exp => exp.id === id);
        if (exp) {
          let reason = 'Unknown';
          
          // Determine why experience was filtered
          if (variant?.rules) {
            const includeTagRule = variant.rules.find((r: any) => r.type === 'include_tags');
            const excludeTagRule = variant.rules.find((r: any) => r.type === 'exclude_tags');
            const dateRangeRule = variant.rules.find((r: any) => r.type === 'date_range');
            
            if (includeTagRule && includeTagRule.value.length > 0 && 
                (!exp.tags || !exp.tags.some(tag => includeTagRule.value.includes(tag)))) {
              reason = `Missing required tags: ${includeTagRule.value.join(', ')}`;
            } else if (excludeTagRule && exp.tags && 
                       exp.tags.some(tag => excludeTagRule.value.includes(tag))) {
              reason = `Excluded by tags: ${exp.tags.filter(tag => excludeTagRule.value.includes(tag)).join(', ')}`;
            } else if (dateRangeRule && exp.date_start) {
              try {
                const expStart = new Date(exp.date_start);
                const rangeStart = new Date(dateRangeRule.value.start);
                const rangeEnd = new Date(dateRangeRule.value.end);
                if (expStart < rangeStart || expStart > rangeEnd) {
                  reason = `Outside date range (${dateRangeRule.value.start} to ${dateRangeRule.value.end})`;
                }
              } catch {
                reason = 'Date range filter applied';
              }
            }
          }
          
          diff.experiences.removed.push({
            title: exp.title,
            company: exp.company,
            reason
          });
        }
      }
    });

    // Check for reordering
    if (masterExpIds.length === resolvedExpIds.length && 
        masterExpIds.some((id, index) => id !== resolvedExpIds[index])) {
      diff.experiences.reordered = true;
    }

    // Check for detailed modifications
    resolved.experience?.forEach(resolvedExp => {
      const masterExp = master.experience?.find(exp => exp.id === resolvedExp.id);
      if (masterExp) {
        const changes = [];
        
        if (masterExp.bullets.length !== resolvedExp.bullets.length) {
          const reduction = masterExp.bullets.length - resolvedExp.bullets.length;
          changes.push(`${reduction > 0 ? 'Reduced' : 'Added'} ${Math.abs(reduction)} bullet points`);
        }
        
        if (masterExp.title !== resolvedExp.title) {
          changes.push(`Title changed from "${masterExp.title}" to "${resolvedExp.title}"`);
        }
        
        if (masterExp.company !== resolvedExp.company) {
          changes.push(`Company changed from "${masterExp.company}" to "${resolvedExp.company}"`);
        }
        
        if (changes.length > 0) {
          diff.experiences.modified.push({
            title: resolvedExp.title,
            company: resolvedExp.company,
            changes
          });
        }
      }
    });

    return diff;
  }
}