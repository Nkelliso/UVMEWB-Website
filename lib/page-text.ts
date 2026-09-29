/**
 * Default wording for pages whose text is edited in /admin (Contact, Projects,
 * Sponsors). Saved text lives in SiteSettings (contactText / projectsText /
 * sponsorsText); any field left blank falls back to the default here, so the
 * live site reads exactly like this until someone changes it.
 */

export interface ContactText {
  title: string;
  welcomeTitle: string;
  welcomeBody: string;
  meetingsTitle: string;
  meetingsBody: string;
  listTitle: string;
  listBody: string;
  peopleTitle: string;
}

export interface ProjectsText {
  title: string;
  intro: string;
}

export interface SponsorWay {
  title: string;
  body: string;
  image: string;
}

export interface SponsorsText {
  title: string;
  intro: string;
  buttonLabel: string;
  ways: SponsorWay[];
  logosTitle: string;
  logosEmpty: string;
  partnerPrompt: string;
}

export const CONTACT_TEXT: ContactText = {
  title: "Join the chapter",
  welcomeTitle: "All majors welcome",
  welcomeBody:
    "You don’t have to be an engineer to make an impact! Our members come from majors all across the university. Together we design real infrastructure, fundraise, work with local businesses, and create real change in people’s lives. Come meet us at a meeting!",
  meetingsTitle: "Meetings",
  meetingsBody:
    "Each of our project teams meets every week during the semester, so there’s always a meeting to drop into.",
  listTitle: "Sign up for our email list",
  listBody: "Get meeting times, project news, and ways to get involved.",
  peopleTitle: "Contact emails",
};

export const PROJECTS_TEXT: ProjectsText = {
  title: "Our work",
  intro:
    "From a clean-water pipeline in Rwanda to stormwater work in the Northeast and volunteering across Vermont, every project is designed for community ownership and built to last.",
};

export const SPONSORS_TEXT: SponsorsText = {
  title: "Sponsors",
  intro:
    "Behind every successful project is a community of supporters. From corporate partners and professional mentors to our alumni network, we’re proud to be backed by those who believe in student-led, community-driven engineering.",
  buttonLabel: "Sponsorship Package",
  ways: [
    {
      title: "Corporate Partners",
      body: "Fuel our projects through financial support, in-kind donations, and collaborative opportunities. Put your name behind clean water and infrastructure that outlasts us.",
      image: "/photos/giving.jpg",
    },
    {
      title: "Professional Mentors",
      body: "Licensed engineers and technical experts who guide our student teams and help ensure every design meets real-world industry standards.",
      image: "/photos/projects.jpg",
    },
    {
      title: "Alumni & Friends",
      body: "Former members and community supporters who keep the mission moving through mentorship, networking, and ongoing project support.",
      image: "/photos/site/cooper-uvm.jpg",
    },
  ],
  logosTitle: "Our sponsors & partners",
  logosEmpty: "Be one of our founding partners. Your organization’s logo will appear here.",
  partnerPrompt: "Interested in partnering?",
};

/** Saved text over defaults; blank or missing fields use the default. */
export function withDefaults<T extends object>(defaults: T, saved?: Partial<T>): T {
  const out = { ...defaults };
  for (const [k, v] of Object.entries(saved ?? {})) {
    if (typeof v === "string" ? v.trim() !== "" : v !== undefined && v !== null) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}
