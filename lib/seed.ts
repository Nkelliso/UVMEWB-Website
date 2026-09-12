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
    "The University of Vermont student chapter, designing sustainable infrastructure alongside the communities we serve.",
  contactEmail: "universityofvermontburlington@chapters-ewb-usa.org",
  instagram: "https://www.instagram.com/uvmewb_usa/",
  facebook: "",
  linkedin:
    "https://www.linkedin.com/company/engineers-without-borders-uvm/posts/?feedView=all",
  sponsorshipPackageUrl: "/sponsorship-package.pdf",
  logoUrl: "/logo.png",
  heroHeading: "Engineers Without Borders",
  heroSubline:
    "We are passionate students working to support community-driven engineering projects and meaningful change in the communities we serve.",
  heroImages: ["/photos/site/home-hero-team.jpg"],
  sectionImages: {
    projects: "/photos/hero.jpg",
    giving: "/photos/giving.jpg",
    join: "/photos/join.jpg",
    about: "/photos/about.jpg",
    sponsors: "/photos/site/kajinge-scenic.jpg",
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
    title: "Kajinge, Rwanda",
    eyebrow: "International Project",
    location: "Kajinge, Western Province, Rwanda",
    status: "In design",
    navLabel: "International Project",
    summary:
      "A clean-water pipeline and chlorination system for the school and community of Kajinge, Rwanda.",
    heroImage: "/photos/site/kajinge-scenic.jpg",
    sections: [
      {
        heading: "Background",
        image: "/photos/site/rwanda-full-team.jpg",
        body: "UVM Engineers Without Borders was connected through IDA Rwanda, a Rwandan NGO, to Kajinge, a community in the Western Province of Rwanda. Kajinge is a rural community with a large school of 1,100 students, many of whom walk over an hour from the surrounding villages. In May 2025 we sent our first travel team on an assessment trip, where they collected project data, ran water-quality testing, and built a lasting relationship with the community.",
      },
      {
        heading: "Engineering",
        image: "/photos/site/rwanda-fieldwork.jpg",
        body: "Aging infrastructure has left the school and surrounding community depending on a spring-fed source that is frequently contaminated and often fails during the rainy season, leaving students and staff to spend long stretches collecting water while waterborne illness spreads. Around 79% of students are affected by illness, and 95% of those affected end up at the health center or arrive late to school. In 2021, 220 students dropped out and 630 arrived late because of health-center visits for waterborne illness.",
      },
      {
        heading: "Our solution",
        image: "/photos/site/rwanda-pipes.jpg",
        body: "We're designing a 700-meter replacement pipeline with a chlorination system at the source, buried one meter deep. The design reuses existing infrastructure where possible. We're targeting implementation in December 2027.",
      },
      {
        heading: "Community ownership",
        image: "/photos/site/rwanda-sienna-kids.jpg",
        body: "The project is built to outlast our travel team. We're establishing an elected local water committee with access to a maintenance fund to oversee upkeep and chlorination supplies, employing local labor, and sourcing as much material as possible from the nearby market in Kabaya. Educational seminars will deepen the community's understanding of the system so it can be maintained locally for years.",
      },
    ],
    technicalDrawings: ["/photos/site/rwanda-map.jpg"],
    models: [
      {
        src: "/models/School%20Kitchen.glb",
        label: "School Kitchen",
        alt: "3D scan of the school kitchen at Kajinge, Rwanda",
      },
      {
        src: "/models/Damaged%20Tapstand.glb",
        label: "Damaged Tapstand",
        alt: "3D scan of a damaged tapstand at Kajinge, Rwanda",
      },
      {
        src: "/models/Kajinge%20Board.glb",
        label: "Kajinge Board",
        alt: "3D scan of the Kajinge community board",
      },
      {
        src: "/models/School%20Handwashing%20Station.glb",
        label: "School Handwashing Station",
        alt: "3D scan of the school handwashing station at Kajinge, Rwanda",
      },
      {
        src: "/models/Current%20Water%20Source.glb",
        label: "Current Water Source",
        alt: "3D scan of the current water source at Kajinge, Rwanda",
      },
    ],
    statusItems: [],
    stats: [],
    published: true,
    order: 0,
  },
  {
    slug: "catskills-stormwater",
    title: "Catskills, New York",
    eyebrow: "Domestic Project",
    location: "Catskill, New York",
    status: "Active",
    navLabel: "Domestic Project",
    summary:
      "Stormwater-mitigation design for the Montessori School of Catskill, New York.",
    heroImage: "/photos/projects.jpg",
    sections: [
      {
        heading: "Background",
        body: "We're working on the Montessori School of Catskill, New York, designing stormwater-mitigation systems for the school.",
      },
      {
        heading: "Engineering",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placeholder text, to be filled in by the domestic team.",
      },
      {
        heading: "Our solution",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. Placeholder text, to be filled in by the domestic team.",
      },
      {
        heading: "Community ownership",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder text, to be filled in by the domestic team.",
      },
    ],
    technicalDrawings: ["/photos/site/catskills-cad.jpg"],
    statusItems: [],
    stats: [],
    published: true,
    order: 1,
  },
  {
    slug: "local-volunteering",
    title: "Local Volunteering",
    eyebrow: "Local Volunteering",
    location: "Vermont",
    status: "Ongoing",
    navLabel: "Local Volunteering",
    summary:
      "Hands-on service with community organizations across Vermont.",
    heroImage: "/photos/join.jpg",
    sections: [
      {
        heading: "Overview",
        body: "Our local project team partners with community organizations across Vermont. We work to support neighbors in need and people who have been disproportionately affected by flooding and other natural disasters in Vermont.",
      },
      {
        heading: "Fall 2025 projects",
        body: "On September 27th, members split across two sites with Rebuilding Together Greater Burlington. In South Burlington, volunteers built a new fence and repainted the facade of a family home that had fallen into disrepair. In Hinesburg, the group cleared and cleaned a property's yard so skilled volunteers could replace the deck and repair the kitchen. Working alongside experienced organizers, the team got to see the direct impact of their work in the community.",
      },
      {
        heading: "Spring 2026",
        body: "Started a project in Middlebury, Vermont. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Placeholder, more detail coming.",
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
    eyebrow: "Archive",
    location: "Various",
    status: "Archive",
    navLabel: "Past Projects",
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
        body: "Every dollar given to our chapter helps train the next generation of engineers while changing lives in communities around the world. When you support EWB-UVM, you're investing in clean water, reliable infrastructure, and a generation of engineers grounded in the communities they serve.",
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
        body: "Whether you want to join the chapter, partner with us, or support a project, we'd love to hear from you.",
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
        heading: "About us",
        body: "The University of Vermont Engineers Without Borders chapter aims to design and implement lasting solutions to problems in international and domestic communities, through collaboration with community partners around the world. Our members bring a variety of cultures and experiences, and get the chance to apply their knowledge while gaining real-world experience and global awareness.",
      },
    },
    {
      type: "RichText",
      props: {
        id: "about-2",
        heading: "Who we are",
        body: "UVM Engineers Without Borders is a student-led nonprofit focused on community-driven development through programs worldwide. We take on sustainable engineering projects while giving students room to grow through leadership roles, field work, and new technical skills.",
      },
    },
    {
      type: "CTABand",
      props: {
        id: "about-teams",
        heading: "Explore our teams",
        body: "See what our international, domestic, and local project teams are working on.",
        buttonLabel: "See our projects",
        buttonHref: "/projects",
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
        body: "Engineers Without Borders at UVM builds a better world through engineering projects that empower communities to meet their basic human needs, while developing engineers who lead with humility, listen first, and design for lasting local ownership.",
      },
    },
  ],
};

export const SEED_PAGES: Record<string, PuckData> = {
  home: SEED_PAGE_HOME,
  about: SEED_PAGE_ABOUT,
  "mission-statement": SEED_PAGE_MISSION,
};
