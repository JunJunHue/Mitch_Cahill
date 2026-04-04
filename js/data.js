/**
 * ═══════════════════════════════════════════════════════════════
 *  PORTFOLIO DATA — js/data.js
 *  ─────────────────────────────────────────────────────────────
 *  This file is the single source of truth for ALL content.
 *
 *  HOW TO UPDATE:
 *    Option A (Easy): Click the lock icon (bottom-right of the site),
 *                     enter the password, and edit everything in-browser.
 *    Option B (Code): Edit the values below, then reload the page.
 *
 *  EDIT PASSWORD: Stern#27Pitch
 * ═══════════════════════════════════════════════════════════════
 */

const PORTFOLIO_DATA = {

  /* ── PERSONAL ──────────────────────────────────────────────── */
  personal: {
    name:           "Mitch Cahill",
    title:          "Finance & Data Science",
    subtitle:       "NYU Stern School of Business",
    tagline:        "Equity research, venture capital, and product strategy: the intersection of finance and technology.",
    bio:            "Finance and Computing & Data Science student at NYU Stern with hands-on experience in equity research, VC due diligence, and product management. I thrive at the intersection of analytical rigor and creative thinking.",
    email:          "Mcc9930@stern.nyu.edu",
    phone:          "",
    location:       "New York, NY",
    linkedin:       "https://www.linkedin.com/in/mitch-cahill-b875702b3/",
    github:         "",
    twitter:        "",
    resumeUrl:      "Cahill-Mitch-Resume.pdf",
    contactHeading: "Let's Connect",
    contactSub:     "Open to opportunities in finance, venture capital, and product strategy.",
  },

  /* ── HERO STATS (shown in the card on the right) ───────────── */
  heroStats: [
    { value: "3.9",   label: "GPA at UNT"     },
    { value: "$165",  label: "MU Price Target" },
    { value: "150+",  label: "Club Members"    },
    { value: "1",     label: "Publication"     },
  ],

  /* ── EDUCATION ──────────────────────────────────────────────── */
  education: [
    {
      id:          "edu-1",
      institution: "New York University",
      school:      "Stern School of Business",
      location:    "New York, NY",
      degree:      "B.S. in Finance, Computing and Data Science",
      period:      "Expected Dec 2027",
      gpa:         null,
      highlights: [
        "Foundations of Finance",
        "Economics of Global Business",
        "Statistics",
        "Management & Organization",
        "Microeconomics",
      ],
    },
    {
      id:          "edu-2",
      institution: "University of North Texas",
      school:      "",
      location:    "Denton, TX",
      degree:      "Transfer Student",
      period:      "Aug 2023 – May 2025",
      gpa:         "3.9",
      highlights: [
        "Student Investment Group",
        "Financial Management Association",
        "American Marketing Association",
        "Real Estate Club",
      ],
    },
  ],

  /* ── PROFESSIONAL EXPERIENCE ────────────────────────────────── */
  experience: [
    {
      id:       "exp-1",
      company:  "KMF Investments",
      location: "Denton, TX",
      role:     "Equity Research Intern",
      period:   "Apr 2025 – Sep 2025",
      type:     "Finance",
      bullets: [
        "Developed segment-level forecasts (HBM, DRAM, NAND, Embedded) and free cash flow projections through 2026 on Micron Technology",
        "Researched and analyzed companies across industries comparing metrics (P/E ratio, enterprise value, etc.) against Micron",
        "Centered thesis on (MU) growth around DRAM and HBM3E chip development — pitched at $69; stock grew to $165 within months",
      ],
    },
    {
      id:       "exp-2",
      company:  "Bohm Technologies",
      location: "Flower Mound, TX",
      role:     "Team Lead",
      period:   "May 2021 – Sep 2022",
      type:     "Operations",
      bullets: [
        "Led teams through warehouse operations including Amazon FBA and Apple product testing (iPad, AirPods, iPhone, Apple Watch)",
        "Tested, repaired, and packaged electric products (drones, go-karts, scooters); used Excel to track output and consistently hit 30+ units/night",
        "Utilized warehouse equipment to improve efficiency, organization, and workspace quality",
      ],
    },
    {
      id:       "exp-3",
      company:  "Denton Natatorium",
      location: "Denton, TX",
      role:     "Lifeguard",
      period:   "May 2021 – Aug 2021",
      type:     "Operations",
      bullets: [
        "Managed all 3 Denton aquatic facilities: Denton Waterworks Water Park, The Denton Natatorium, and Civic Center Water Park",
        "Earned certifications in CPR, AED, Blood Pathogens, Oxygen, and First Aid; passed physical fitness assessment",
        "Enforced aquatic facility policies, maintaining safety for 100+ person crowds",
      ],
    },
  ],

  /* ── LEADERSHIP & EXTRACURRICULARS ──────────────────────────── */
  leadership: [
    {
      id:           "lead-1",
      organization: "Strategic Venture Society",
      location:     "New York, NY",
      role:         "The Venturist",
      period:       "Feb 2026 – Present",
      type:         "VC/Investing",
      bullets: [
        "Researched analytical pieces on venture capital trends, with a focus on cybersecurity, AI, and early-stage startups on club blog column",
        "Evaluated startup business models, market positioning, and competitive moats, particularly within the cybersecurity and enterprise SaaS sectors",
        "Participated in weekly meetings on emerging startups and investment theses, forming perspectives based on financial analysis and market research",
      ],
    },
    {
      id:           "lead-2",
      organization: "Business Analytics Club",
      location:     "New York, NY",
      role:         "Insight Team",
      period:       "Feb 2026 – Present",
      type:         "Technology",
      bullets: [
        "Collaborated on a semester-long data analytics project analyzing the impact of tennis serve performance on match outcomes using large datasets",
        "Applied Python for data cleaning, analysis, and visualization to identify correlations between serve speed, first-serve percentage, and win probability",
        "Presented quantitative findings during weekly meets, translating analysis into clear strategic insights supported by data-driven conclusions",
      ],
    },
    {
      id:           "lead-3",
      organization: "Product Management Club",
      location:     "New York, NY",
      role:         "Product Team",
      period:       "Feb 2026 – Present",
      type:         "Product",
      bullets: [
        "Developed and pitched new feature (\"Hinge Plus One\") for Hinge, conducting user research, defining KPIs, and identifying pain points",
        "Presented product strategy and feature recommendations to industry professionals, articulating user pain points and measurable impact",
        "Led end-to-end product development: ideation, MVP scoping, stakeholder analysis, value-effort matrix, and A/B testing design",
      ],
    },
    {
      id:           "lead-4",
      organization: "Entrepreneurial Exchange Group",
      location:     "New York, NY",
      role:         "Investing Team",
      period:       "Oct 2025 – Dec 2025",
      type:         "VC/Investing",
      bullets: [
        "Participated in bi-weekly meetings focused on Venture Capital, startups, and tech; attended weekly general meetings",
        "Conducted due diligence analyzing business models, market size, competitive positioning, and revenue scalability of early-stage startups",
        "Pitched multiple early-stage startups to the full club with Figma slides and a Substack-published white paper",
      ],
    },
    {
      id:           "lead-5",
      organization: "North Texas Pickleball",
      location:     "Denton, TX",
      role:         "Founder & President",
      period:       "Dec 2023 – May 2025",
      type:         "Entrepreneurship",
      bullets: [
        "Founded and led club with weekly meets, tournaments, managed $500 budget, and grew membership to 150+",
        "Brought club to collegiate championship; designed merchandise generating $600 profit; featured in Denton Chronicle",
        "Recruited team, secured university approval, scheduled facilities, and organized competitive events and travel logistics",
      ],
    },
    {
      id:           "lead-6",
      organization: "Student Investment Group",
      location:     "Denton, TX",
      role:         "Junior Analyst",
      period:       "Sep 2023 – Dec 2023",
      type:         "Finance",
      bullets: [
        "Completed weekly assignments analyzing company balance sheets and examining industry metrics",
        "Led a 3-person team that linked financial statements and built a DCF model for Walmart, presented to club leadership",
        "Conducted equity research on multiple public companies analyzing financial statements, industry dynamics, and KPIs",
      ],
    },
  ],

  /* ── SKILLS ─────────────────────────────────────────────────── */
  skills: {
    "Finance & Analysis":  ["Financial Modeling", "Equity Research", "Valuation", "Due Diligence", "PitchBook", "Crunchbase"],
    "Technology":          ["Python", "NumPy", "Pandas", "Microsoft Excel", "Figma"],
    "Business":            ["Product Management", "Research & Analysis", "Stakeholder Analysis", "Microsoft Word"],
  },

  /* ── INTERESTS ──────────────────────────────────────────────── */
  interests: [
    "Chess", "Poker", "Tennis", "Pickleball", "Acting & Theatre",
    "Weightlifting", "Football", "Hiking", "Cooking & Baking", "Geography & History",
  ],

  /* ── PUBLISHED WORKS ─────────────────────────────────────────*/
  publishedWorks: [],

};
