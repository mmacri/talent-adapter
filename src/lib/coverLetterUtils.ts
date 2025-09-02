export const extractVariables = (body: string): string[] => {
  const matches = body.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  
  return [...new Set(matches.map(match => match.slice(2, -2).trim()))];
};

export const getSampleValue = (variable: string): string => {
  const samples: Record<string, string> = {
    company: 'Acme Corporation',
    role: 'Senior Software Engineer',
    field: 'software development',
    your_name: 'Mike Macri',
    reason_for_interest: 'I am excited about the opportunity to work on innovative projects that will have a meaningful impact on the company\'s growth.',
    key_achievement_1: 'Led cross-functional teams to deliver high-impact solutions',
    key_achievement_2: 'Improved system performance by 40% through optimization',
    key_achievement_3: 'Mentored junior developers and established best practices',
    company_reason: 'of its commitment to innovation and excellence in the industry',
    relevant_skills: 'technical leadership, solution architecture, and team collaboration',
    specific_goal: 'continued innovation and market leadership'
  };
  
  return samples[variable] || `[${variable}]`;
};

export const getPreviewText = (body: string, maxLength: number = 150): string => {
  // Remove template variables for preview
  const cleaned = body.replace(/\{\{[^}]+\}\}/g, '[variable]');
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned;
};