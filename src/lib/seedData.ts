import { ResumeMaster, Variant, CoverLetter, Template } from '@/types/resume';
import { resumeStorage, coverLettersStorage, templatesStorage } from './storage';

export const createSeedData = () => {
  const masterResume: ResumeMaster = {
    id: 'master-resume-1',
    owner: 'Mike Macri MBA',
    contacts: {
      email: 'MikeMacri@gmail.com',
      phone: '650-308-4071',
      website: 'https://mikemacri.com/',
      linkedin: 'https://linkedin.com/in/mikemacri'
    },
    headline: 'Strategic Partner Development & Solution Advisory Leader',
    summary: [
      'Experienced strategic partner development leader with a proven track record of building and scaling partner ecosystems across North America.',
      'Skilled in collaborating with GSIs, channel partners, and multiple tiers to design and execute joint go-to-market programs that align technical and business value, accelerate adoption, and create new revenue streams.',
      'Adept at cross-functional collaboration with Sales, Marketing, Services, and Product to ensure seamless partner onboarding, support, and empowerment that drives measurable customer value.'
    ],
    key_achievements: [
      'Directed cross-functional partner solutions at VMware, securing two $50M+ partner-led deals while achieving 450% of target goals.',
      'Designed enablement frameworks and onboarding that drove 21% new pipeline and 20% renewal growth across VMware\'s Americas ecosystem.',
      'Built onboarding playbooks and KPI frameworks generating 250% pipeline growth at VMware.',
      'Trusted advisor integrating cloud-native and compliance solutions that mitigated $900M in enterprise risk while expanding market reach.',
      'Represented VMware and ServiceNow at partner forums/QBRs/events; delivered enablement workshops and co-branded GTM programs.'
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Momentum Edge Consulting',
        title: 'Consultant',
        location: 'Remote',
        date_start: '2025-05',
        date_end: null,
        bullets: [
          'Advise consulting groups on development strategies, driving growth in existing technical compliance accounts.',
          'Provide expertise in partner ecosystem alignment, building new lines of revenue.'
        ],
        tags: ['GRC', 'Partner', 'Consulting']
      },
      {
        id: 'exp-2',
        company: 'ServiceNow',
        title: 'Sr. Manager, Solution Advisory – Legal Ethics & Compliance',
        location: 'Remote',
        date_start: '2021-12',
        date_end: '2025-05',
        bullets: [
          'Directed cross-functional solution advisory initiatives across Sales, Security, Legal, and Product to accelerate adoption and reduce enterprise risk.',
          'Streamlined processes and shaped roadmap integration; led Solution Advisors to resolve complex compliance challenges across Security, ESG, Legal, Product, and Sales.',
          'Integrated AI/ML governance into enterprise frameworks; SME for ServiceNow\'s inaugural AI risk policies and requirements.'
        ],
        tags: ['GRC', 'AI', 'Leadership', 'CustomerSuccess']
      },
      {
        id: 'exp-3',
        company: 'VMware',
        title: 'Partner Business & Technical Alliance Director – Americas',
        location: 'San Francisco, CA',
        date_start: '2019-11',
        date_end: '2021-12',
        bullets: [
          'Designed partner joint business plans and managed co-selling motions, resulting in two record-setting $50M+ deals.',
          'Developed embedded partner programs and re-platformed solutions aligned to partner goals.',
          'Executed GTM with consulting/implementation partners, exceeding sales targets by 450%.',
          'Aligned product and engineering on partner-led integrations (e.g., VMware on AWS with DXC).'
        ],
        tags: ['Partner', 'Leadership', 'GTM']
      },
      {
        id: 'exp-4',
        company: 'VMware',
        title: 'Partner Staff Solutions Engineer Leader',
        location: 'Chicago, IL',
        date_start: '2017-12',
        date_end: '2019-12',
        bullets: [
          'Partnered with CDW to drive $440M through multi-tiered routes-to-market; increased pipeline capture by 20%, certifications by 200%, and solution adoption by 20%.',
          'Delivered partner training, workshops, and roadmap sessions; coached architects to increase partner-driven pipeline by 21%.'
        ],
        tags: ['Partner', 'Enablement', 'Revenue']
      },
      {
        id: 'exp-5',
        company: 'VMware',
        title: 'Sr Manager, Customer Success, TAMs & Product Specialists – West Coast Regional Practice',
        location: 'Seattle, WA',
        date_start: '2014-11',
        date_end: '2017-12',
        bullets: [
          'Hired and mentored CS teams; improved NPS by 30 points (20 above company standard) and increased adoption by 20%.',
          'Built engagement frameworks aligning technical outcomes with business metrics; drove expansion and efficiency.'
        ],
        tags: ['CustomerSuccess', 'Leadership']
      },
      {
        id: 'exp-6',
        company: 'VMware',
        title: 'Staff Technical Account Manager',
        location: 'Seattle, WA',
        date_start: '2011-12',
        date_end: '2014-11',
        bullets: [
          'Created engagement deliverables aligning customer metrics and enhancing operational efficiency; led services attach on all deals.',
          'Delivered solutions driving adoption and roadmap expansions (e.g., 500 Costco storefronts deployed in 10 minutes).'
        ],
        tags: ['CustomerSuccess', 'Delivery', 'Scale']
      },
      {
        id: 'exp-7',
        company: 'VMware',
        title: 'Technical Partner Lead – Channel Partner Strategy (North America)',
        location: 'Seattle, WA',
        date_start: '2011-01',
        date_end: '2011-12',
        bullets: [
          'Technical SME for top NA partners; C-level alignment and self-service demo labs for adoption.'
        ],
        tags: ['Partner', 'SME']
      }
    ],
    awards: [
      { id: 'award-1', title: 'GSI Americas Regions Technical Alliance Manager of the Quarter – 02/2021' },
      { id: 'award-2', title: 'Partner Excellence – Rockstar MVP of the Half – 12/2020' },
      { id: 'award-3', title: 'GSI Americas Regions Technical Alliance Manager of the Quarter – 12/2020' },
      { id: 'award-4', title: 'Partner Solutions Engineer of the Quarter – 03/2019' },
      { id: 'award-5', title: 'Americas VP Award for Service Excellence – 10/2017' },
      { id: 'award-6', title: 'Technical Account Manager of the Half – 02/2013' }
    ],
    education: [
      { 
        id: 'edu-1', 
        degree: 'MBA', 
        school: 'Xavier University', 
        location: 'Cincinnati, OH' 
      },
      { 
        id: 'edu-2', 
        degree: 'B.S. Industrial Organizational Psychology / I.T.', 
        school: 'Xavier University', 
        location: 'Cincinnati, OH' 
      }
    ],
    skills: {
      primary: ['ServiceNow GRC/IRM', 'Partner Strategy', 'Solution Consulting', 'Customer Success', 'AI Governance']
    },
    sections: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const variants: Variant[] = [
    {
      id: 'variant-grc-presales',
      name: 'GRC-IRM Presales',
      description: 'Optimized for GRC and AI governance roles',
      rules: [
        { type: 'include_tags', value: ['GRC', 'AI', 'CustomerSuccess'] },
        { type: 'max_bullets', value: 4 },
        { type: 'section_order', value: ['summary', 'skills', 'experience', 'education', 'awards'] }
      ],
      overrides: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'variant-partner-director',
      name: 'Partner Development Director',
      description: 'Focused on partner leadership and GTM strategy',
      rules: [
        { type: 'include_tags', value: ['Partner', 'Leadership', 'GTM'] },
        { type: 'max_bullets', value: 5 },
        { type: 'section_order', value: ['summary', 'key_achievements', 'experience', 'education', 'awards'] }
      ],
      overrides: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const coverLetters: CoverLetter[] = [
    {
      id: 'cover-letter-1',
      title: 'Partner Development Template',
      body: `Dear Hiring Manager,

I am excited to apply for the {{role}} position at {{company}}. With over a decade of experience in strategic partner development and solution advisory, I have consistently driven measurable results through innovative partner ecosystem strategies.

At VMware, I directed cross-functional partner solutions that secured two $50M+ partner-led deals while achieving 450% of target goals. I designed enablement frameworks that drove 21% new pipeline growth and 20% renewal growth across VMware's Americas ecosystem.

My expertise in {{why}} makes me an ideal candidate for this role. I excel at:
• Building and scaling partner ecosystems across multiple tiers
• Designing joint go-to-market programs that accelerate adoption
• Creating enablement frameworks that drive measurable customer value

I would welcome the opportunity to discuss how my proven track record in partner development can contribute to {{company}}'s continued success.

Best regards,
Mike Macri`,
      variables: ['company', 'role', 'why'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const templates: Template[] = [
    {
      id: 'template-sleek-compact',
      name: 'Sleek Compact',
      description: 'Clean, modern design optimized for space',
      styles: {
        layout: 'single-column',
        fontSize: 'small',
        spacing: 'compact',
        colors: 'professional-blue'
      }
    },
    {
      id: 'template-modern-wide',
      name: 'Modern Wide',
      description: 'Contemporary two-column layout with emphasis on skills',
      styles: {
        layout: 'two-column',
        fontSize: 'medium',
        spacing: 'comfortable',
        colors: 'modern-gray'
      }
    },
    {
      id: 'template-classic',
      name: 'Classic',
      description: 'Traditional format preferred by conservative industries',
      styles: {
        layout: 'single-column',
        fontSize: 'medium',
        spacing: 'traditional',
        colors: 'classic-black'
      }
    }
  ];

  return {
    masterResume,
    variants,
    coverLetters,
    templates
  };
};

export const initializeData = () => {
  // Only seed if no master resume exists
  if (!resumeStorage.getMaster()) {
    const { masterResume, variants, coverLetters, templates } = createSeedData();
    
    // Set master resume
    resumeStorage.setMaster(masterResume);
    
    // Set variants
    resumeStorage.setVariants(variants);
    
    // Set cover letters
    coverLettersStorage.setAll(coverLetters);
    
    // Set templates
    templatesStorage.setAll(templates);
    
    console.log('Resume Variants Manager: Data initialized successfully');
  }
};