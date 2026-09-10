import type { Data as PuckData } from "@measured/puck";

export type { PuckData };

export interface Officer {
  title: string;
  name: string;
  photoUrl?: string;
}

export interface OfficerGroup {
  heading?: string;
  officers: Officer[];
}

export interface OfficerBoard {
  facultyAdvisor: Officer;
  executiveBoard: Officer[];
  projectDirectors: OfficerGroup[];
  asOf: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface ProjectSection {
  heading: string;
  body: string;
  /** Optional photo shown beside this section in the alternating layout. */
  image?: string;
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  location: string;
  status: string;
  summary: string;
  heroImage?: string;
  sections: ProjectSection[];
  statusItems: string[];
  stats: ProjectStat[];
  published: boolean;
  order: number;
  /** Friendly label for the Projects nav dropdown (falls back to the title). */
  navLabel?: string;
  /** Technical drawings / maps shown in their own section. */
  technicalDrawings?: string[];
  /** Optional interactive 3D models (glTF/GLB) shown in their own section. */
  models?: ProjectModel[];
}

/** One interactive 3D model shown in the project's "Explore in 3D" section. */
export interface ProjectModel {
  /** Path under /public (URL-encode spaces) or a full URL to a .glb/.gltf file. */
  src: string;
  /** Label shown above the viewer (defaults to the file's name). */
  label: string;
  /** Accessible description of what the model shows. */
  alt?: string;
  /** Optional still image shown before the model loads. */
  poster?: string;
}

export interface Sponsor {
  name: string;
  tier: string;
  logoUrl?: string;
  url?: string;
}

export interface SiteSettings {
  chapterName: string;
  tagline: string;
  contactEmail: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  /** Link to the chapter's sponsorship-package PDF (Drive/Dropbox/etc. or an
   *  uploaded file). Shown as the "View our sponsorship package" CTA. */
  sponsorshipPackageUrl?: string;
  /** Chapter logo image (path under /public or full URL). When set, the header
   *  renders it in place of the "EWB·UVM" text wordmark. Editable via /admin. */
  logoUrl?: string;
  heroHeading: string;
  heroSubline: string;
  heroImages: string[];
  /** Per-position images for the immersive edition's section bands + page
   *  headers (keys: projects, giving, join, about, sponsors, contact). Editable
   *  via /admin/photos; falls back to the /photos defaults when unset. */
  sectionImages?: Record<string, string>;
  /** Editable copy for the homepage's scrolling PosterSection stack on "/".
   *  Any blank field falls back to the built-in default text. Section images
   *  are set in /admin/photos (sectionImages); the hero uses heroHeading /
   *  heroSubline / heroImages above. */
  home?: HomeCopy;
}

/** Text for the homepage's scrolling sections (see SiteSettings.home). */
export interface HomeCopy {
  projectsTitle?: string;
  projectsBody?: string;
  givingTitle?: string;
  givingBody?: string;
  joinTitle?: string;
  joinBody?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}
