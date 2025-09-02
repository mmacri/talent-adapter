import { ResumeMaster, Variant, CoverLetter, Template, JobApplication } from '@/types/resume';
import { resumeStorage, coverLettersStorage, templatesStorage, jobsStorage } from './storage';

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

  const jobApplications: JobApplication[] = [
    {
      id: 'job-1',
      company: 'Microsoft',
      role: 'Senior Partner Manager - GRC Solutions',
      location: 'Seattle, WA',
      source: 'LinkedIn',
      url: 'https://careers.microsoft.com/us/en/job/1234567/Senior-Partner-Manager-GRC-Solutions',
      jdText: `We are seeking a Senior Partner Manager to lead our GRC (Governance, Risk, and Compliance) solutions partnership strategy. The ideal candidate will have experience in partner development, solution consulting, and deep knowledge of compliance frameworks.

Key Responsibilities:
• Develop and execute partner strategies for GRC solutions
• Build relationships with key system integrators and consulting partners
• Drive joint go-to-market initiatives and revenue growth
• Collaborate with product teams on partner requirements
• Lead partner enablement and training programs

Requirements:
• 8+ years of experience in partner management or solution consulting
• Strong background in GRC, compliance, or risk management
• Experience with enterprise software and SaaS platforms
• Proven track record of driving partner revenue
• MBA or equivalent business experience preferred`,
      status: 'interview',
      variantId: 'variant-grc-presales',
      coverLetterId: 'cover-letter-1',
      appliedOn: '2024-01-15',
      notes: 'Had initial screening call with Sarah Chen (Partner Recruiting). Second round interview scheduled for next week with the hiring manager. They are particularly interested in my ServiceNow GRC experience and AI governance work.',
      salary: '$160k - $190k + equity',
      createdAt: '2024-01-10T10:00:00.000Z',
      updatedAt: '2024-01-20T15:30:00.000Z'
    },
    {
      id: 'job-2',
      company: 'Salesforce',
      role: 'Director, Strategic Partnerships',
      location: 'San Francisco, CA',
      source: 'Referral',
      url: 'https://salesforce.wd1.myworkdayjobs.com/External_Career_Site/job/California---San-Francisco/Director--Strategic-Partnerships_JR12345',
      jdText: `Salesforce is looking for a Director of Strategic Partnerships to lead our partner ecosystem initiatives. This role will focus on building and scaling partnerships that drive customer success and revenue growth.

What you'll do:
• Lead strategic partnership initiatives across multiple business units
• Develop partner enablement programs and go-to-market strategies  
• Manage executive relationships with key strategic partners
• Drive joint business planning and revenue targets
• Collaborate with Sales, Marketing, and Product teams

What we're looking for:
• 10+ years of experience in strategic partnerships or business development
• Proven track record of building and scaling partner programs
• Experience in enterprise software, SaaS, or cloud technologies
• Strong analytical and strategic thinking skills
• Executive presence and ability to influence at all levels`,
      status: 'applied',
      variantId: 'variant-partner-director',
      coverLetterId: 'cover-letter-1',
      appliedOn: '2024-01-22',
      notes: 'Application submitted through referral from John Martinez (former VMware colleague). Waiting to hear back on next steps.',
      salary: '$180k - $220k + equity + bonus',
      createdAt: '2024-01-20T14:00:00.000Z',
      updatedAt: '2024-01-22T09:15:00.000Z'
    },
    {
      id: 'job-3',
      company: 'Amazon Web Services',
      role: 'Principal Partner Solutions Architect',
      location: 'Remote',
      source: 'AWS Careers',
      url: 'https://www.amazon.jobs/en/jobs/12345/principal-partner-solutions-architect',
      jdText: `AWS is seeking a Principal Partner Solutions Architect to work with our strategic consulting and system integrator partners. This technical leadership role will drive partner enablement and joint solution development.

Key responsibilities:
• Lead technical partnership initiatives with global system integrators
• Design and implement partner solution architectures
• Provide technical guidance and enablement to partner teams
• Support joint go-to-market activities and customer engagements
• Influence product roadmap based on partner and customer feedback

Qualifications:
• 12+ years of experience in solutions architecture or technical consulting
• Deep knowledge of cloud technologies and enterprise architecture
• Experience working with consulting partners and system integrators
• Strong presentation and communication skills
• Bachelor's degree in Engineering, Computer Science, or related field`,
      status: 'prospect',
      variantId: 'variant-partner-director',
      coverLetterId: '',
      appliedOn: '',
      notes: 'Identified through AWS partner network. Need to customize resume for technical focus and reach out to hiring team.',
      salary: '$200k - $250k + equity',
      createdAt: '2024-01-25T11:00:00.000Z',
      updatedAt: '2024-01-25T11:00:00.000Z'
    },
    {
      id: 'job-4',
      company: 'Okta',
      role: 'Senior Manager, Customer Success - Compliance',
      location: 'San Francisco, CA / Remote',
      source: 'Indeed',
      url: 'https://www.okta.com/company/careers/opportunity/senior-manager-customer-success-compliance-12345/',
      jdText: `Okta is seeking a Senior Manager for Customer Success focused on compliance and governance use cases. This role will lead a team of customer success professionals serving our enterprise compliance customers.

What you'll be doing:
• Manage and develop a team of customer success managers
• Drive adoption of Okta's governance and compliance solutions
• Develop customer success strategies for compliance use cases
• Partner with Product and Engineering on customer requirements
• Lead customer advocacy and reference programs

What you bring:
• 8+ years of experience in customer success or account management
• Deep understanding of compliance frameworks (SOX, GDPR, etc.)
• Experience managing and developing teams
• Strong analytical and problem-solving skills
• Bachelor's degree; MBA preferred`,
      status: 'rejected',
      variantId: 'variant-grc-presales',
      coverLetterId: 'cover-letter-1',
      appliedOn: '2024-01-05',
      notes: 'Received rejection email on 1/18. Feedback was that they went with someone with more direct identity governance experience. Good to keep in mind for future opportunities.',
      salary: '$140k - $170k + equity',
      createdAt: '2024-01-03T16:00:00.000Z',
      updatedAt: '2024-01-18T12:00:00.000Z'
    },
    {
      id: 'job-5',
      company: 'Snowflake',
      role: 'VP of Strategic Partnerships',
      location: 'San Mateo, CA',
      source: 'Executive Recruiter',
      url: '',
      jdText: `Snowflake is looking for a VP of Strategic Partnerships to lead our global partner ecosystem strategy. This executive role will define and execute our partnership vision across technology, consulting, and channel partners.

What You'll Do:
• Define and execute Snowflake's global partnership strategy
• Build and lead a world-class partnerships organization
• Establish executive relationships with strategic partners
• Drive significant revenue through partner channels
• Represent Snowflake at industry events and partner forums

What We Look For:
• 15+ years of progressive experience in partnerships or business development
• Proven track record of building and scaling partner programs
• Experience in enterprise software, data, or cloud technologies
• Strong leadership and team building capabilities
• MBA from top-tier institution preferred`,
      status: 'offer',
      variantId: 'variant-partner-director',
      coverLetterId: 'cover-letter-1',
      appliedOn: '2024-01-08',
      notes: 'Received verbal offer on 1/28! Compensation package includes base + equity + bonus. Need to review details and negotiate. Timeline for decision is 2/5.',
      salary: '$250k - $300k + significant equity + bonus',
      createdAt: '2024-01-05T09:00:00.000Z',
      updatedAt: '2024-01-28T17:45:00.000Z'
    }
  ];

  const additionalCoverLetters: CoverLetter[] = [
    {
      id: 'cover-letter-2',
      title: 'GRC & Compliance Leadership',
      body: `Dear {{hiring_manager}},

I am writing to express my strong interest in the {{role}} position at {{company}}. With over 12 years of experience in governance, risk, and compliance (GRC) solutions, I have developed deep expertise in helping enterprises navigate complex regulatory landscapes while driving business value.

In my recent role as Sr. Manager of Solution Advisory for Legal Ethics & Compliance at ServiceNow, I directed cross-functional initiatives that accelerated adoption and reduced enterprise risk by $900M. I was instrumental in integrating AI/ML governance into enterprise frameworks and served as a subject matter expert for ServiceNow's inaugural AI risk policies.

What sets me apart for this role:

**GRC Expertise**: Deep knowledge of compliance frameworks including SOX, GDPR, and industry-specific regulations. I've successfully implemented governance solutions that balance risk mitigation with operational efficiency.

**AI Governance Leadership**: Pioneered AI risk management strategies at ServiceNow, developing policies and frameworks that have become industry benchmarks.

**Cross-functional Collaboration**: Proven ability to work across Sales, Security, Legal, Product, and Engineering teams to deliver integrated solutions that meet complex compliance requirements.

**Customer Success Focus**: Track record of improving customer satisfaction scores by 30+ points while driving adoption and expansion.

I am particularly excited about {{company}}'s {{reason}} and believe my experience in {{relevant_experience}} would be immediately valuable to your team.

I would welcome the opportunity to discuss how my expertise in GRC solutions and AI governance can contribute to {{company}}'s continued success.

Best regards,
Mike Macri MBA`,
      variables: ['hiring_manager', 'company', 'role', 'reason', 'relevant_experience'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'cover-letter-3',
      title: 'Executive Partnership Leadership',
      body: `Dear {{hiring_manager}},

I am excited to submit my application for the {{role}} position at {{company}}. As a strategic partnership executive with a proven track record of building and scaling multi-billion dollar partner ecosystems, I am confident I can drive significant value for your organization.

Throughout my career at VMware and ServiceNow, I have consistently delivered exceptional results:

• **Revenue Impact**: Secured two $50M+ partner-led deals at VMware, achieving 450% of target goals
• **Ecosystem Growth**: Drove $440M in partner-generated revenue through multi-tiered channel strategies  
• **Pipeline Development**: Generated 250% pipeline growth through innovative enablement frameworks
• **Market Expansion**: Built partner programs that expanded market reach while mitigating enterprise risk

**Strategic Vision & Execution**
My approach to partnership development combines strategic vision with tactical execution. I excel at identifying high-value partnership opportunities, building compelling business cases, and executing joint go-to-market strategies that deliver measurable results.

**Leadership & Team Building** 
I have successfully built and led high-performing teams across multiple geographies. My leadership philosophy focuses on empowerment, accountability, and continuous development, resulting in teams that consistently exceed targets.

**Industry Expertise**
My experience spans {{industry_focus}}, giving me unique insights into market dynamics, customer needs, and competitive landscapes. This expertise enables me to quickly identify and capitalize on partnership opportunities.

{{company}}'s {{company_strength}} aligns perfectly with my experience in {{alignment_area}}. I am particularly excited about the opportunity to {{specific_opportunity}}.

I look forward to discussing how my proven track record in strategic partnerships can help {{company}} achieve its ambitious growth objectives.

Best regards,
Mike Macri MBA`,
      variables: ['hiring_manager', 'company', 'role', 'industry_focus', 'company_strength', 'alignment_area', 'specific_opportunity'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    masterResume,
    variants,
    coverLetters: [...coverLetters, ...additionalCoverLetters],
    templates,
    jobApplications
  };
};

export const initializeData = () => {
  // Only seed if no master resume exists
  if (!resumeStorage.getMaster()) {
    const { masterResume, variants, coverLetters, templates, jobApplications } = createSeedData();
    
    // Set master resume
    resumeStorage.setMaster(masterResume);
    
    // Set variants
    resumeStorage.setVariants(variants);
    
    // Set cover letters
    coverLettersStorage.setAll(coverLetters);
    
    // Set templates
    templatesStorage.setAll(templates);
    
    // Set job applications
    jobsStorage.setAll(jobApplications);
    
    console.log('Resume Variants Manager: Data initialized successfully');
  }
};