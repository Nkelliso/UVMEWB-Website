import type { ContactPerson } from "./types";

/** Shown on the contact page until someone edits the list in /admin/contact. */
export const DEFAULT_CONTACT_PEOPLE: ContactPerson[] = [
  { name: "Leah Dennis", role: "Outreach Coordinator", email: "", photo: "" },
  { name: "Luke O’Brien", role: "Outreach Coordinator", email: "", photo: "" },
];
