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
    "Our projects stretch from Kajinge, Rwanda to the New York Catskills to the greater Burlington area.",
  givingTitle: "Giving",
  givingBody:
    "Each gift supports the next generation of engineers and changemakers while changing lives in disadvantaged communities.",
  joinTitle: "Join us",
  joinBody:
    "Want to join the chapter, partner with us, or support a project? We'd love to hear from you.",
} as const;
