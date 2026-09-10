/**
 * Default copy for the homepage's editable scrolling sections. Referenced by
 * BOTH the live page (`app/(site)/page.tsx` fallbacks) and the /admin Settings
 * form (`components/admin/SettingsForm.tsx` placeholders) so the two can never
 * drift. Editing a default here updates the live fallback and the editor's
 * placeholder in one place. Blank Settings fields fall back to these.
 */
export const HOME_COPY = {
  projectsTitle: "Projects",
  projectsBody:
    "Our projects reach from Kajinge, Rwanda to the Catskills of New York to the greater Burlington area.",
  givingTitle: "Giving",
  givingBody:
    "Every gift trains the next generation of engineers while changing lives in the communities we serve.",
  joinTitle: "Join us",
  joinBody:
    "Want to join the chapter, partner with us, or support a project? We'd love to hear from you.",
} as const;
