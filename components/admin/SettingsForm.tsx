"use client";

import AdminChrome, { Field, ImageField, Row, Card, AddButton, MoveButtons, Section } from "./AdminChrome";
import { useEditable, move } from "./useEditable";
import { saveSettingsAction } from "@/app/admin/actions";
import type { SiteSettings, HomeCopy, ContactPerson } from "@/lib/types";
import { HOME_COPY } from "@/lib/home-copy";
import { DEFAULT_CONTACT_PEOPLE } from "@/lib/contact-people";
import { HERO_CUTOUTS } from "@/lib/hero-cutouts";
import {
  CONTACT_TEXT,
  PROJECTS_TEXT,
  SPONSORS_TEXT,
  type ContactText,
  type ProjectsText,
  type SponsorsText,
  type SponsorWay,
} from "@/lib/page-text";

/** Site settings are split across several plain screens. Each one only sends
 *  its own fields, so they can't overwrite each other. */
export type SettingsScreen = "home" | "contact" | "site" | "projectsPage" | "sponsorsPage";

function pick(s: SiteSettings, screen: SettingsScreen): Partial<SiteSettings> {
  switch (screen) {
    case "home":
      return { heroHeading: s.heroHeading, heroSubline: s.heroSubline, heroImages: s.heroImages ?? [], home: s.home ?? {} };
    case "contact":
      return {
        contactEmail: s.contactEmail,
        contactPeople: s.contactPeople?.length ? s.contactPeople : DEFAULT_CONTACT_PEOPLE,
        contactText: s.contactText ?? {},
      };
    case "projectsPage":
      return { projectsText: s.projectsText ?? {} };
    case "sponsorsPage":
      return { sponsorsText: { ...s.sponsorsText, ways: s.sponsorsText?.ways ?? SPONSORS_TEXT.ways } };
    case "site":
      return {
        chapterName: s.chapterName,
        logoUrl: s.logoUrl ?? "",
        instagram: s.instagram ?? "",
        facebook: s.facebook ?? "",
        linkedin: s.linkedin ?? "",
        sponsorshipPackageUrl: s.sponsorshipPackageUrl ?? "",
      };
  }
}

const CLEARED = "If you clear a box completely, the original wording comes back.";

const COPY: Record<SettingsScreen, { title: string; view: string; intro: string }> = {
  home: {
    title: "Home page words",
    view: "/",
    intro: `Change any of the words on the home page. ${CLEARED} To change the home page photos, use Photos.`,
  },
  contact: {
    title: "Contact page",
    view: "/contact",
    intro: `The words on the Contact page, the club email, and the people listed under Contact emails. ${CLEARED}`,
  },
  projectsPage: {
    title: "Projects page words",
    view: "/projects",
    intro: `The title and intro at the top of the Projects page. The projects themselves are edited in Projects. ${CLEARED}`,
  },
  sponsorsPage: {
    title: "Sponsors page words and photos",
    view: "/sponsors",
    intro: `Everything on the Sponsors page except the logo list, which is edited in Sponsors. ${CLEARED}`,
  },
  site: {
    title: "Site details",
    view: "/",
    intro: "Things that show up on every page: the club name, logo, and social media links.",
  },
};

export default function SettingsForm({
  initial,
  screen,
}: {
  initial: SiteSettings;
  screen: SettingsScreen;
}) {
  const editor = useEditable<Partial<SiteSettings>>(pick(initial, screen));
  const s = editor.value;
  const set = (patch: Partial<SiteSettings>, label?: string) => editor.change({ ...s, ...patch }, label);
  const copy = COPY[screen];

  // Home page
  const home = s.home ?? {};
  const setHome = (patch: Partial<HomeCopy>) => set({ home: { ...home, ...patch } });
  const homeText = (k: keyof HomeCopy) => home[k] ?? HOME_COPY[k];
  const heroUrl = s.heroImages?.[0] ?? "";
  const hasDepth = !!HERO_CUTOUTS[heroUrl];

  // Contact page
  const people = s.contactPeople ?? [];
  const setPeople = (list: ContactPerson[], label?: string) => set({ contactPeople: list }, label);
  const ct = s.contactText ?? {};
  const contactText = (k: keyof ContactText) => ct[k] ?? CONTACT_TEXT[k];
  const setContact = (patch: Partial<ContactText>) => set({ contactText: { ...ct, ...patch } });

  // Projects page
  const pt = s.projectsText ?? {};
  const projectsText = (k: keyof ProjectsText) => pt[k] ?? PROJECTS_TEXT[k];
  const setProjects = (patch: Partial<ProjectsText>) => set({ projectsText: { ...pt, ...patch } });

  // Sponsors page
  const st = s.sponsorsText ?? {};
  const sponsorsText = (k: Exclude<keyof SponsorsText, "ways">) => st[k] ?? SPONSORS_TEXT[k];
  const setSponsors = (patch: Partial<SponsorsText>, label?: string) =>
    set({ sponsorsText: { ...st, ...patch } }, label);
  const ways = st.ways ?? SPONSORS_TEXT.ways;
  const setWays = (list: SponsorWay[], label?: string) => setSponsors({ ways: list }, label);

  return (
    <AdminChrome
      title={copy.title}
      editor={editor}
      onSave={saveSettingsAction}
      viewHref={copy.view}
      intro={<p>{copy.intro}</p>}
    >
      {screen === "home" && (
        <>
          <Section title="Top of the home page">
            <Field
              label="Big headline"
              value={s.heroHeading ?? ""}
              onChange={(v) => set({ heroHeading: v })}
              textarea
              rows={2}
            />
            <Field
              label="Line under the headline"
              value={s.heroSubline ?? ""}
              onChange={(v) => set({ heroSubline: v })}
              textarea
              rows={2}
            />
            <ImageField
              label="Big photo at the top"
              hint={<>To crop it or adjust its colours, use <a className="underline" href="/admin/photos">Photos</a>.</>}
              value={heroUrl}
              onChange={(v) => set({ heroImages: v ? [v] : [] })}
            />
            <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 -mt-2 mb-5">
              {hasDepth
                ? "This photo has a 3D depth effect: the people stand in front of the headline. The effect only works with this exact photo, so choosing a different one, or re-cropping this one in Photos, turns it off."
                : "The 3D depth effect (people standing in front of the headline) only works with the original team photo, so it's off with this photo."}
            </p>
          </Section>
          <Section title="Projects section" hint="The first section you reach as you scroll down.">
            <Field label="Heading" value={homeText("projectsTitle")} onChange={(v) => setHome({ projectsTitle: v })} />
            <Field label="Text" value={homeText("projectsBody")} onChange={(v) => setHome({ projectsBody: v })} textarea />
          </Section>
          <Section title="Giving section">
            <Field label="Heading" value={homeText("givingTitle")} onChange={(v) => setHome({ givingTitle: v })} />
            <Field label="Text" value={homeText("givingBody")} onChange={(v) => setHome({ givingBody: v })} textarea />
          </Section>
          <Section title="Join section" hint="The last section, which invites people to join.">
            <Field label="Heading" value={homeText("joinTitle")} onChange={(v) => setHome({ joinTitle: v })} />
            <Field label="Text" value={homeText("joinBody")} onChange={(v) => setHome({ joinBody: v })} textarea />
          </Section>
        </>
      )}

      {screen === "contact" && (
        <>
          <Section title="Words on the page">
            <Field label="Page title" hint="The big title over the photo." value={contactText("title")} onChange={(v) => setContact({ title: v })} />
            <Row>
              <Field label="Welcome heading" value={contactText("welcomeTitle")} onChange={(v) => setContact({ welcomeTitle: v })} />
              <Field label="Meetings box heading" value={contactText("meetingsTitle")} onChange={(v) => setContact({ meetingsTitle: v })} />
            </Row>
            <Field label="Welcome text" value={contactText("welcomeBody")} onChange={(v) => setContact({ welcomeBody: v })} textarea rows={4} />
            <Field
              label="Meetings box text"
              hint='Update this each semester. The site adds "Join our email list or find us on Instagram for times and places." after it, with links.'
              value={contactText("meetingsBody")}
              onChange={(v) => setContact({ meetingsBody: v })}
              textarea
            />
            <Field label="Email list heading" value={contactText("listTitle")} onChange={(v) => setContact({ listTitle: v })} />
            <Field
              label="Email list text"
              hint='The site adds "Have a question? Email" and the club email after it.'
              value={contactText("listBody")}
              onChange={(v) => setContact({ listBody: v })}
              textarea
              rows={2}
            />
            <Field label="Heading above the contact people" value={contactText("peopleTitle")} onChange={(v) => setContact({ peopleTitle: v })} />
          </Section>

          <Section title="Club email">
            <Field
              label="Club email"
              hint="This shows on the Contact page, the Sponsors page, and the bottom of every page."
              value={s.contactEmail ?? ""}
              onChange={(v) => set({ contactEmail: v })}
            />
          </Section>

          <Section
            title="Contact people"
            hint="The people listed at the bottom of the Contact page. If someone has no email here, the club email shows instead."
          >
            {people.map((p, i) => (
              <Card
                key={i}
                title={p.name || "(no name yet)"}
                move={
                  <MoveButtons
                    what={p.name}
                    onUp={() => setPeople(move(people, i, -1), `Moved ${p.name}`)}
                    onDown={() => setPeople(move(people, i, 1), `Moved ${p.name}`)}
                    isFirst={i === 0}
                    isLast={i === people.length - 1}
                  />
                }
                onRemove={() => setPeople(people.filter((_, j) => j !== i), `Removed ${p.name || "person"}`)}
              >
                <Row>
                  <Field label="Name" value={p.name} onChange={(v) => setPeople(people.map((x, j) => (j === i ? { ...x, name: v } : x)))} />
                  <Field label="Role" value={p.role} placeholder="e.g. Outreach Coordinator" onChange={(v) => setPeople(people.map((x, j) => (j === i ? { ...x, role: v } : x)))} />
                </Row>
                <Field
                  label="Their email"
                  value={p.email ?? ""}
                  placeholder={s.contactEmail}
                  onChange={(v) => setPeople(people.map((x, j) => (j === i ? { ...x, email: v } : x)))}
                />
                <ImageField
                  label="Photo (optional)"
                  hint="Without one, the site shows their initials."
                  minWidth={500}
                  value={p.photo ?? ""}
                  onChange={(v) => setPeople(people.map((x, j) => (j === i ? { ...x, photo: v } : x)))}
                />
              </Card>
            ))}
            <AddButton label="Add a person" onClick={() => setPeople([...people, { name: "", role: "", email: "", photo: "" }], "Added a person")} />
          </Section>
        </>
      )}

      {screen === "projectsPage" && (
        <>
          <Field label="Page title" hint="The big title over the header photo." value={projectsText("title")} onChange={(v) => setProjects({ title: v })} />
          <Field label="Intro" hint="The paragraph above the project cards." value={projectsText("intro")} onChange={(v) => setProjects({ intro: v })} textarea rows={4} />
          <p className="text-sm text-neutral-500">
            To change the header photo, use <a className="underline" href="/admin/photos">Photos</a> (&quot;Projects page: header&quot;).
          </p>
        </>
      )}

      {screen === "sponsorsPage" && (
        <>
          <Section title="Top of the page">
            <Field label="Page title" value={sponsorsText("title")} onChange={(v) => setSponsors({ title: v })} />
            <Field label="Intro" value={sponsorsText("intro")} onChange={(v) => setSponsors({ intro: v })} textarea rows={4} />
            <Field
              label="Button label"
              hint={<>The button opens the sponsorship packet link from <a className="underline" href="/admin/settings">Site details</a>. Without a link, it goes to the Contact page.</>}
              value={sponsorsText("buttonLabel")}
              onChange={(v) => setSponsors({ buttonLabel: v })}
            />
            <p className="text-sm text-neutral-500 mb-5">
              To change the header photo, use <a className="underline" href="/admin/photos">Photos</a> (&quot;Sponsors page: header&quot;).
            </p>
          </Section>

          <Section title="Ways to support us" hint="The photo cards under the header. Three fit the layout best.">
            {ways.map((w, i) => (
              <Card
                key={i}
                title={w.title || `Card ${i + 1}`}
                move={
                  <MoveButtons
                    what={w.title}
                    onUp={() => setWays(move(ways, i, -1), `Moved ${w.title || "a card"}`)}
                    onDown={() => setWays(move(ways, i, 1), `Moved ${w.title || "a card"}`)}
                    isFirst={i === 0}
                    isLast={i === ways.length - 1}
                  />
                }
                onRemove={() => setWays(ways.filter((_, j) => j !== i), `Removed ${w.title || "a card"}`)}
              >
                <Field label="Heading" value={w.title} onChange={(v) => setWays(ways.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
                <Field label="Text" value={w.body} onChange={(v) => setWays(ways.map((x, j) => (j === i ? { ...x, body: v } : x)))} textarea />
                <ImageField label="Photo" value={w.image} onChange={(v) => setWays(ways.map((x, j) => (j === i ? { ...x, image: v } : x)))} />
              </Card>
            ))}
            <AddButton label="Add a card" onClick={() => setWays([...ways, { title: "", body: "", image: "" }], "Added a card")} />
          </Section>

          <Section title="Logo section" hint="The logos themselves are edited in Sponsors.">
            <Field label="Heading above the logos" value={sponsorsText("logosTitle")} onChange={(v) => setSponsors({ logosTitle: v })} />
            <Field
              label="Text when there are no sponsors yet"
              value={sponsorsText("logosEmpty")}
              onChange={(v) => setSponsors({ logosEmpty: v })}
              textarea
              rows={2}
            />
            <Field
              label="Line at the bottom"
              hint='The site adds "Email" and the club email after it.'
              value={sponsorsText("partnerPrompt")}
              onChange={(v) => setSponsors({ partnerPrompt: v })}
            />
          </Section>
        </>
      )}

      {screen === "site" && (
        <>
          <Field
            label="Club name"
            hint="This shows in the top bar of every page when there's no logo."
            value={s.chapterName ?? ""}
            onChange={(v) => set({ chapterName: v })}
          />
          <ImageField
            label="Logo (optional)"
            hint="The logo replaces the club name in the top bar. Leave it empty to show the name as text."
            minWidth={0}
            value={s.logoUrl ?? ""}
            onChange={(v) => set({ logoUrl: v })}
          />
          <Section title="Social media" hint="These show at the bottom of every page. Leave one blank to hide it.">
            <Field label="Instagram link" value={s.instagram ?? ""} placeholder="https://instagram.com/…" onChange={(v) => set({ instagram: v })} />
            <Field label="Facebook link" value={s.facebook ?? ""} placeholder="https://facebook.com/…" onChange={(v) => set({ facebook: v })} />
            <Field label="LinkedIn link" value={s.linkedin ?? ""} placeholder="https://linkedin.com/company/…" onChange={(v) => set({ linkedin: v })} />
          </Section>
          <Section title="Sponsorship packet">
            <Field
              label="Link to the sponsorship packet"
              hint="The button at the top of the Sponsors page opens this. Paste a Google Drive or PDF link."
              value={s.sponsorshipPackageUrl ?? ""}
              placeholder="https://…"
              onChange={(v) => set({ sponsorshipPackageUrl: v })}
            />
          </Section>
        </>
      )}
    </AdminChrome>
  );
}
