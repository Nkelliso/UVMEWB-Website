import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact & Get Involved · EWB UVM",
  description:
    "Join the University of Vermont chapter of Engineers Without Borders, open to students of every major. Reach us by form or email.",
};

// Outreach liaisons shown at the foot of the page. Email/photo fall back
// gracefully (chapter email + initials tile) until real ones are added.
const LIAISONS = [
  { name: "Leah Dennis", role: "Outreach Coordinator", email: "", photo: "" },
  { name: "Luke O’Brien", role: "Outreach Coordinator", email: "", photo: "" },
];

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
          <p className="ewb-eyebrow">Get involved</p>
          <h1>Join the chapter</h1>
          <p className="ctc-hero-sub">
            Engineers Without Borders welcomes students of every major. No
            experience required. Come build with us.
          </p>
        </div>
      </header>

      <div className="ewb-shell-body">
        <div className="ewb-wrap">
          {/* Get involved + meeting info */}
          <section className="ctc-involve">
            <div className="ctc-involve-text">
              <h2>All majors welcome</h2>
              <p>
                You don’t have to be an engineer to make an impact. Our members
                come from across the university to design real infrastructure,
                fundraise, run outreach, and travel with our project teams.
                Curious? Sit in on a meeting. Everyone’s welcome.
              </p>
            </div>
            <aside className="ctc-meeting-card">
              <p className="ctc-meeting-label">Meetings</p>
              <p className="ctc-meeting-body">
                General body meetings run weekly during the semester. For the
                current time and place, follow us on{" "}
                {settings.instagram ? (
                  <a href={settings.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                ) : (
                  "Instagram"
                )}{" "}
                or reach out below.
              </p>
            </aside>
          </section>

          {/* Contact form + email */}
          <section className="ctc-reach">
            <h2>Contact us</h2>
            <p className="ewb-lede ctc-reach-lede">
              Get in touch with the form below, or email{" "}
              <a href={`mailto:${settings.contactEmail}`}>
                {settings.contactEmail}
              </a>
              .
            </p>
            <ContactForm />
          </section>

          {/* Outreach liaisons */}
          <section className="ctc-people">
            <p className="ewb-sponsor-tier-name">Contact emails</p>
            <div className="ctc-people-grid">
              {LIAISONS.map((p) => {
                const email = p.email || settings.contactEmail;
                return (
                  <article key={p.name} className="ctc-person">
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
