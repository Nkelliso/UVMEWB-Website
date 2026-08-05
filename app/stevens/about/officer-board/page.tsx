import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Placeholder from "@/components/Placeholder";
import { getOfficers } from "@/lib/store";
import type { Officer } from "@/lib/types";

export const metadata: Metadata = {
  title: "Officer Board — EWB UVM",
  description: "Meet the EWB UVM officer board.",
};

function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <article className="ewb-officer-card">
      {officer.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={officer.photoUrl}
          alt={officer.name}
          style={{
            width: "100%",
            height: "8rem",
            objectFit: "cover",
            borderRadius: "0.35rem",
            marginBottom: "0.9rem",
          }}
        />
      ) : (
        <div style={{ marginBottom: "0.9rem" }}>
          <Placeholder label="Photo — placeholder" height="8rem" />
        </div>
      )}
      <p className="ewb-officer-title">{officer.title}</p>
      <h3 className="ewb-officer-name">{officer.name}</h3>
    </article>
  );
}

export default async function StevensOfficerBoardPage() {
  const board = await getOfficers();

  return (
    <PageShell eyebrow="About" title="Meet our team" narrow={false} image="/photos/about.jpg">
      <p className="ewb-note">Current officers — {board.asOf}.</p>

      <section className="ewb-officer-section">
        <h2>Faculty Advisor</h2>
        <div className="ewb-officer-grid is-single">
          <OfficerCard officer={board.facultyAdvisor} />
        </div>
      </section>

      <section className="ewb-officer-section">
        <h2>Executive Board</h2>
        <div className="ewb-officer-grid">
          {board.executiveBoard.map((o) => (
            <OfficerCard key={`${o.title}-${o.name}`} officer={o} />
          ))}
        </div>
      </section>

      <section className="ewb-officer-section">
        <h2>Project Directors</h2>
        {board.projectDirectors.map((group) => (
          <div key={group.heading}>
            {group.heading && (
              <p className="ewb-officer-group-heading">{group.heading}</p>
            )}
            <div
              className={
                group.officers.length === 1
                  ? "ewb-officer-grid is-single"
                  : "ewb-officer-grid"
              }
            >
              {group.officers.map((o) => (
                <OfficerCard key={`${o.title}-${o.name}`} officer={o} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
