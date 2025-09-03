import { ResumeMaster } from '@/types/resume';

const mikeResumeData = {
  "name": "Mike Macri, MBA",
  "contact": {
    "email": "MikeMacri@gmail.com",
    "phone": "650-308-4071",
    "website": "https://MikeMacri.com",
    "linkedin": "https://linkedin.com/in/mikemacri"
  },
  "professional_summary": "Strategic Partner Development Leader experienced building and scaling partner ecosystems across North America. Proven success in enabling partners, executing joint go-to-market programs, and aligning technical and business value to accelerate adoption and drive measurable outcomes. Skilled at cross-functional collaboration with Sales, Marketing, Services, and Product teams, ensuring partners are onboarded, supported, and empowered to deliver customer value.",
  "key_achievements": [
    {
      "title": "Unified pod teams approach across ServiceNow",
      "details": "Aligned Sales, Security, Legal, Finance, and Product teams to standardize program functionality and reduce workflow redundancies."
    },
    {
      "title": "Partner Recruitment & GTM Growth",
      "details": "Directed cross-functional partner solutions at VMware, securing two $50M+ partner-led deals (among the largest in company history) while achieving 450% of target goals."
    },
    {
      "title": "Enablement & Adoption",
      "details": "Designed scalable partner enablement frameworks, certifications, and onboarding programs that drove 21% pipeline capture increase and 20% renewal growth across VMware's North American ecosystem."
    },
    {
      "title": "Operational Excellence",
      "details": "Developed onboarding playbooks, KPI alignment frameworks, and partner success metrics that accelerated 100% adoption and generated 250% pipeline growth at ServiceNow."
    },
    {
      "title": "Customer & Partner Advocacy",
      "details": "Served as trusted advisor for enterprise partners, integrating cloud-native and compliance solutions that mitigated $900M in enterprise risk while expanding market reach."
    },
    {
      "title": "Thought Leadership & Events",
      "details": "Represented VMware and ServiceNow at partner forums, QBRs, and industry events, delivering enablement workshops, executive strategy sessions, and co-branded GTM programs."
    }
  ],
  "experience": [
    {
      "title": "Sr. Manager, Solution Advisory - Legal Ethics & Compliance",
      "company": "ServiceNow",
      "location": "Remote",
      "dates": "12/2021 – 05/2025",
      "responsibilities": [
        "Directed cross-functional and solution advisory initiatives, aligning Sales, Security, Legal, and Product teams to accelerate adoption, strengthen value delivery, and reduce enterprise risk.",
        "Integrated AI/ML governance into enterprise frameworks, collaborating across all functions and serving as the subject matter expert for ServiceNow's inaugural AI risk policies and requirements.",
        "Drove organizational alignment, streamlined processes, and shaped product roadmap integration by leading a team of Solution Advisors to resolve complex compliance challenges across Security, ESG, Legal, Product, and Sales."
      ]
    },
    {
      "title": "Partner Business & Technical Alliance Director - Americas",
      "company": "VMware",
      "location": "San Francisco, CA",
      "dates": "11/2019 – 12/2021",
      "responsibilities": [
        "Designed partner joint business plans and managed co-selling motions, resulting in two record-setting $50M+ deals.",
        "Developed scalable embedded partner programs and re-platformed solutions, aligning go-to-market strategy with partner goals.",
        "Executed GTM programs with consulting and implementation partners, driving ecosystem growth and consistently exceeding sales targets by 450%.",
        "Collaborated with product and engineering on partner-led integrations (e.g., VMware Cloud on AWS with DXC)."
      ]
    },
    {
      "title": "Partner Staff Solutions Engineer Leader",
      "company": "VMware",
      "location": "Chicago, IL",
      "dates": "12/2017 – 12/2019",
      "responsibilities": [
        "Built partner enablement frameworks, demo labs and certification adoption for leading North American partners (CDW, HP, Zones, En Pointe), ensuring repeatable, scalable presales delivery.",
        "Delivered partner training, workshops, and roadmap sessions, coaching architects to drive SaaS and hybrid cloud campaigns, increasing partner-driven pipeline capture by 21%."
      ]
    },
    {
      "title": "Sr. Manager, Customer Success, TAMs & Product Specialists West Coast Regional Practice",
      "company": "VMware",
      "location": "Seattle, WA",
      "dates": "11/2014 – 12/2017",
      "responsibilities": [
        "Hired, mentored, and developed customer success teams to deliver a trusted brand, increasing product adoption by 20% and improved NPS by 30 points (20 points above company standard).",
        "Developed and delivered engagement frameworks that aligned technical outcomes with business value metrics, driving operational efficiency and consistent expansion."
      ]
    },
    {
      "title": "Staff Technical Account Manager",
      "company": "VMware",
      "location": "Seattle, WA",
      "dates": "12/2011 – 11/2014",
      "responsibilities": [
        "Created engagement deliverables aligning customer metrics and enhancing operational efficiency, leading to services attach on all deals.",
        "Developed creative solutions that drove product adoption and roadmap expansions (e.g., rolled out VMware solution to 500 Costco storefronts in 10 minutes, eliminating on-site visits to free budget for growth products)."
      ]
    },
    {
      "title": "Technical Partner Lead, Channel Partner Strategy (North America)",
      "company": "VMware",
      "location": "Seattle, WA",
      "dates": "01/2011 – 12/2011",
      "responsibilities": [
        "Served as the technical SME and lead for 3 of VMware's top 10 North American partners, enabling C-level alignment and driving partner adoption of VMware jointly created services.",
        "Designed and implemented scalable self-service demo labs with cloud for partners (Zones, CDW, En Pointe, HP, PCMall), enabling partner-SC enablement and solution delivery."
      ]
    }
  ],
  "awards": [
    "GSI Americas Regions Technical Alliance Manager of the Quarter, VMware – 02/2021",
    "Partner Excellence - Rockstar MVP of the Half Award, VMware – 12/2020",
    "GSI Americas Regions Technical Alliance Manager of the Quarter, VMware – 12/2020",
    "Partner Solutions Engineer of the Quarter, VMware – 03/2019",
    "Americas VP Award for Service Excellence, VMware – 10/2017",
    "Technical Account Manager of the Half Award, VMware – 02/2013"
  ],
  "education": [
    {
      "degree": "Masters of Business Administration",
      "institution": "Xavier University",
      "location": "Cincinnati, OH"
    },
    {
      "degree": "B.S. Industrial Organizational Psychology / I.T.",
      "institution": "Xavier University",
      "location": "Cincinnati, OH"
    }
  ]
};

// Transform to ResumeMaster format
export const transformToResumeMaster = (): ResumeMaster => {
  const now = new Date().toISOString();
  
  // Parse date ranges from experience
  const parseExperienceDates = (dateString: string) => {
    const parts = dateString.split(' – ');
    const startDate = parts[0];
    let endDate = parts[1];
    
    // Handle "Present" or current dates
    if (endDate && (endDate.includes('2025') || endDate === 'Present')) {
      endDate = null; // Current position
    }
    
    return { startDate, endDate };
  };
  
  return {
    id: 'mike-master-resume',
    owner: 'Mike Macri',
    contacts: {
      email: mikeResumeData.contact.email,
      phone: mikeResumeData.contact.phone,
      website: mikeResumeData.contact.website,
      linkedin: mikeResumeData.contact.linkedin
    },
    headline: mikeResumeData.name,
    summary: [mikeResumeData.professional_summary],
    key_achievements: mikeResumeData.key_achievements.map(achievement => 
      `${achievement.title}: ${achievement.details}`
    ),
    experience: mikeResumeData.experience.map((exp, index) => {
      const dates = parseExperienceDates(exp.dates);
      return {
        id: `exp-${index + 1}`,
        company: exp.company,
        title: exp.title,
        location: exp.location,
        date_start: dates.startDate,
        date_end: dates.endDate,
        bullets: exp.responsibilities,
        tags: [] // Will be populated later if needed
      };
    }),
    education: mikeResumeData.education.map((edu, index) => ({
      id: `edu-${index + 1}`,
      degree: edu.degree,
      school: edu.institution,
      location: edu.location,
      year: '' // Not provided in source data
    })),
    awards: mikeResumeData.awards.map((award, index) => {
      // Parse award string to extract title and date
      const parts = award.split(' – ');
      const title = parts[0];
      const date = parts[1] || '';
      
      return {
        id: `award-${index + 1}`,
        title: title,
        date: date,
        description: ''
      };
    }),
    skills: {
      primary: [
        'Partner Development',
        'Strategic Alliances',
        'Cross-functional Leadership',
        'Go-to-Market Strategy',
        'AI/ML Governance',
        'Enterprise Risk Management',
        'Solution Advisory',
        'Customer Success'
      ],
      secondary: [
        'VMware Technologies',
        'ServiceNow Platform',
        'Cloud Solutions',
        'Compliance Frameworks',
        'Partner Enablement',
        'Technical Training'
      ]
    },
    sections: {
      summary: { enabled: true, order: 1 },
      key_achievements: { enabled: true, order: 2 },
      experience: { enabled: true, order: 3 },
      education: { enabled: true, order: 4 },
      awards: { enabled: true, order: 5 },
      skills: { enabled: true, order: 6 }
    },
    createdAt: now,
    updatedAt: now
  };
};

export default mikeResumeData;