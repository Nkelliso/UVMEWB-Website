import type { Metadata } from "next";
import EmailSignupForm from "@/components/EmailSignupForm";
import { getSettings } from "@/lib/store";
import { DEFAULT_CONTACT_PEOPLE } from "@/lib/contact-people";
import { CONTACT_TEXT, withDefaults } from "@/lib/page-text";

export const metadata: Metadata = {
  title: "Contact & Get Involved · EWB UVM",
  description:
    "Join the University of Vermont chapter of Engineers Without Borders, open to students of every major. Reach us by form or email.",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default async function ContactPage() {
  const settings = await getSettings();
  const heroImage = settings.sectionImages?.contact || "/photos/contact.jpg";
  // Edited in /admin/contact. Email/photo fall back gracefully (chapter email +
  // initials tile) until real ones are added.
  const people = settings.contactPeople?.length
    ? settings.contactPeople
    : DEFAULT_CONTACT_PEOPLE;
  // Wording is edited in /admin/contact; blank fields keep the default text.
  const t = withDefaults(CONTACT_TEXT, settings.contactText);

  return (
    <div className="ewb-shell">
      {/* Club-photo hero — the "all majors welcome" front door. */}
      <header className="ewb-shell-head ctc-hero">
        <div
          className="ewb-shell-bg"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="ewb-shell-scrim" />
        <div className="ewb-wrap ctc-hero-inner">
          <h1>{t.title}</h1>
        </div>
      </header>

      <div className="ewb-shell-body">
        <div className="ewb-wrap">
          {/* Get involved + meeting info */}
          <section className="ctc-involve">
            <div className="ctc-involve-text">
              <h2>{t.welcomeTitle}</h2>
              <p>{t.welcomeBody}</p>
            </div>
            <aside className="ctc-meeting-card">
              <h3 className="ctc-meeting-label">{t.meetingsTitle}</h3>
              <p className="ctc-meeting-body">
                {t.meetingsBody}{" "}
                <a href="#email-list">Join our email list</a> or
                find us on{" "}
                {settings.instagram ? (
                  <a href={settings.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                ) : (
                  "Instagram"
                )}{" "}
                for times and places.
              </p>
            </aside>
          </section>

          {/* Email list signup + chapter email */}
          <section className="ctc-reach" id="email-list">
            <h2>{t.listTitle}</h2>
            <p className="ewb-lede ctc-reach-lede">
              {t.listBody} Have a question? Email{" "}
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
              .
            </p>
            <EmailSignupForm />
          </section>

          {/* Outreach liaisons */}
          <section className="ctc-people">
            <h2>{t.peopleTitle}</h2>
            <div className="ctc-people-grid">
              {people.map((p, i) => {
                const email = p.email || settings.contactEmail;
                return (
                  <article key={i} className="ctc-person">
                    {p.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="ctc-person-photo"
                      />
                    ) : (
                      <div
                        className="ctc-person-photo ctc-person-photo--initials"
                        role="img"
                        aria-label={p.name}
                      >
                        {initials(p.name)}
                      </div>
                    )}
                    <p className="ctc-person-name">{p.name}</p>
                    <p className="ctc-person-role">{p.role}</p>
                    <a className="ctc-person-email" href={`mailto:${email}`}>
                      {email}
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
