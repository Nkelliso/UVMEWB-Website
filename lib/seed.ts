import type {
  OfficerBoard,
  Project,
  Sponsor,
  SiteSettings,
  PuckData,
} from "./types";

/**
 * Seed content — ported from the original Lovable scaffold
 * (github.com/Nkelliso/uvm-ewb-scroll-page). This is the default content the
 * site ships with and the fallback used when Supabase is not configured.
 *
 * NOTE: no real photos were ever uploaded to Lovable, so every image field is
 * intentionally empty and renders as a clearly-labeled placeholder until an
 * officer uploads the real asset via /admin.
 */

export const SEED_SETTINGS: SiteSettings = {
  chapterName: "Engineers Without Borders",
  tagline:
    "The University of Vermont student chapter — designing sustainable infrastructure alongside the communities we serve.",
  contactEmail: "universityofvermontburlington@chapters-ewb-usa.org",
  instagram: "https://www.instagram.com/uvmewb_usa/",
  facebook: "",
  linkedin:
    "https://www.linkedin.com/company/engineers-without-borders-uvm/posts/?feedView=all",
  sponsorshipPackageUrl: "/sponsorship-package.pdf",
  logoUrl: "/logo.png",
  heroHeading: "Engineering that listens first.",
  heroSubline:
    "Student engineers, designers, and organizers at the University of Vermont, building lasting infrastructure with communities around the world.",
  heroImages: ["/photos/hero.jpg"],
  sectionImages: {
    projects: "/photos/projects.jpg",
    giving: "/photos/giving.jpg",
    join: "/photos/join.jpg",
    about: "/photos/about.jpg",
    sponsors: "/photos/sponsors.jpg",
    contact: "/photos/contact.jpg",
  },
};

export const SEED_OFFICERS: OfficerBoard = {
  asOf: "Fall 2025",
  facultyAdvisor: { title: "Faculty Advisor", name: "Matthew Scarborough" },
  executiveBoard: [
    { title: "President", name: "Luke Briggeman" },
    { title: "Vice-President", name: "Sophie Seewald" },
    { title: "Treasurer", name: "Dylan Dalsimer" },
    { title: "Historian", name: "Peter Ozonoff" },
    { title: "Fundraising Director", name: "Lindsey Mcbride" },
    { title: "Fundraising Director", name: "Meadow Novicki" },
    { title: "Outreach Coordinator", name: "Leah Dennis" },
    { title: "Outreach Coordinator", name: "Luke O'Brien" },
  ],
  projectDirectors: [
    {
      heading: "International Project",
      officers: [
        { title: "International Director", name: "Kita Guerra" },
        {
          title: "International Deputy Director",
          name: "Nathan Kellison-Miller",
        },
      ],
    },
    {
      heading: "Domestic Project",
      officers: [{ title: "Domestic Director", name: "Maisie Datson" }],
    },
    {
      heading: "Local Volunteering",
      officers: [{ title: "Local Director", name: "Henry Myatt" }],
    },
  ],
};

export const SEED_PROJECTS: Project[] = [
  {
    slug: "rwanda-water",
    title: "Kajinge, Rwanda — Clean Water Pipeline",
    eyebrow: "Projects · Rwanda",
    location: "Kajinge, Western Rwanda",
    status: "In design",
    summary:
      "A gravity-fed replacement pipeline and chlorination system bringing safe drinking water to ~1,100 students and ~6,300 residents.",
    heroImage: "/photos/projects/rwanda-water.jpg",
    sections: [
      {
        heading: "The problem",
        body: "Kajinge is a rural village in Western Rwanda where the community relies on a spring and an aging PVC pipeline that frequently breaks during the rainy season. When it fails, travel time to clean water increases from 10–20 minutes to over an hour. Waterborne illness is widespread — in 2021 alone, 220 students dropped out of school and 630 arrived late due to health center visits for illness related to unsafe water.",
      },
      {
        heading: "Our solution",
        body: "UVM EWB is designing a ~700-meter gravity-fed replacement pipeline and a chlorination system at the water source. The project prioritizes community ownership: local labor will be employed, a community water committee will be trained to oversee maintenance, and a maintenance fund will be established for ongoing repairs and chlorination supplies.",
      },
    ],
    statusItems: [
      "Assessment trip completed — topographical surveys, water quality testing, community meetings",
      "Currently in engineering and design phase",
      "Target: return implementation trip in 2026",
    ],
    stats: [
      { value: "~6,300", label: "Residents served" },
      { value: "~1,100", label: "Students at the local school" },
      { value: "~$30k", label: "Estimated project cost" },
      { value: "~700m", label: "New pipeline" },
      { value: "~79%", label: "Community affected by illness" },
    ],
    published: true,
    order: 0,
  },
  {
    slug: "catskills-stormwater",
    title: "Catskills Stormwater Runoff",
    eyebrow: "Projects · Domestic",
    location: "Catskills, New York",
    status: "Active",
    summary:
      "A domestic project tackling stormwater runoff and erosion in partnership with a Catskills community.",
    heroImage: "/photos/projects/catskills-stormwater.jpg",
    sections: [
      {
        heading: "Overview",
        body: "Our domestic team is scoping a stormwater management project in the Catskills region of New York. Details and design documentation will be added here as the project develops.",
      },
    ],
    statusItems: ["Scoping and community partnership in progress"],
    stats: [],
    published: true,
    order: 1,
  },
  {
    slug: "local-volunteering",
    title: "Local Volunteering",
    eyebrow: "Projects · Local",
    location: "Chittenden County, Vermont",
    status: "Ongoing",
    summary:
      "Hands-on service around Burlington and the Green Mountains — keeping engineering skills grounded in our own community.",
    heroImage: "/photos/projects/local-volunteering.jpg",
    sections: [
      {
        heading: "Overview",
        body: "Between travel projects, our local team volunteers with community partners across Vermont. Add events, partners, and photos here as the chapter runs them.",
      },
    ],
    statusItems: [],
    stats: [],
    published: true,
    order: 2,
  },
  {
    slug: "past-projects",
    title: "Past Projects",
    eyebrow: "Projects · Archive",
    location: "Various",
    status: "Archive",
    summary:
      "A record of the chapter's completed work and the communities we've partnered with over the years.",
    heroImage: "/photos/projects/past-projects.jpg",
    sections: [
      {
        heading: "Our history",
        body: "This archive collects the chapter's past projects. Add each completed project here with a short recap, the community partner, and outcomes.",
      },
    ],
    statusItems: [],
    stats: [],
    published: true,
    order: 3,
  },
];

export const SEED_SPONSORS: Sponsor[] = [
  { name: "Your organization here", tier: "Founding Partners", logoUrl: "", url: "" },
  { name: "Become a sponsor", tier: "Founding Partners", logoUrl: "", url: "" },
];

/** Home page — assembled from Puck blocks so officers can rearrange it. */
export const SEED_PAGE_HOME: PuckData = {
  root: {},
  content: [
    {
      type: "SectionIntro",
      props: {
        id: "home-intro",
        eyebrow: "Who we are",
        heading:
          "A student chapter of engineers, designers, and organizers building alongside the communities we serve.",
        body: "Based at the University of Vermont, our chapter has partnered with communities across East Africa, the Northeast, and the Green Mountains to deliver projects that outlive our travel itineraries.",
        primaryLabel: "Learn more",
        primaryHref: "/about",
        secondaryLabel: "Join us",
        secondaryHref: "/contact",
      },
    },
    { type: "WorldMapBlock", props: { id: "home-map" } },
    {
      type: "SectionIntro",
      props: {
        id: "home-giving",
        eyebrow: "Giving",
        heading: "Hands-on engineering. Lasting impact.",
        body: "Every dollar given to our chapter helps train the next generation of engineers while changing lives in communities around the world. When you support EWB-UVM, you're investing in clean water, reliable infrastructure, and a generation of engineers who lead with listening.",
        primaryLabel: "Support our work",
        primaryHref: "/sponsors",
        secondaryLabel: "",
        secondaryHref: "",
      },
    },
    {
      type: "CTABand",
      props: {
        id: "home-cta",
        heading: "Build something that lasts.",
        body: "Whether you want to join the chapter, partner with us, or support a project — we'd love to hear from you.",
        buttonLabel: "Get in touch",
        buttonHref: "/contact",
      },
    },
  ],
};

export const SEED_PAGE_ABOUT: PuckData = {
  root: {},
  content: [
    {
      type: "RichText",
      props: {
        id: "about-1",
        heading: "About our chapter",
        body: "Engineers Without Borders at the University of Vermont is a student-led chapter of EWB-USA. We partner with communities — locally and internationally — to design and build sustainable infrastructure, and to train engineers who lead with listening.",
      },
    },
    {
      type: "RichText",
      props: {
        id: "about-2",
        heading: "What we do",
        body: "Our members run international projects (currently a clean-water pipeline in Kajinge, Rwanda), domestic projects, and local volunteering across Vermont. Every project is designed for community ownership and long-term maintenance, not just a one-time build.",
      },
    },
  ],
};

export const SEED_PAGE_MISSION: PuckData = {
  root: {},
  content: [
    {
      type: "RichText",
      props: {
        id: "mission-1",
        heading: "Mission statement",
        body: "Engineers Without Borders — UVM builds a better world through engineering projects that empower communities to meet their basic human needs, while developing engineers who lead with humility, listen first, and design for lasting local ownership.",
      },
    },
  ],
};

export const SEED_PAGES: Record<string, PuckData> = {
  home: SEED_PAGE_HOME,
  about: SEED_PAGE_ABOUT,
  "mission-statement": SEED_PAGE_MISSION,
};
