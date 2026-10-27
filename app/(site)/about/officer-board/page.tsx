import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getOfficers, getSettings } from "@/lib/store";
import type { Officer } from "@/lib/types";
import styles from "./officer-board.module.css";

export const metadata: Metadata = {
  title: "Officer Board · EWB UVM",
  description: "Meet the EWB UVM officer board.",
};

function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <article className={styles.person}>
      <div className={styles.portrait}>
        {officer.photoUrl ? (
          // Serve the uploaded original: these portraits do not benefit from more compression.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={officer.photoUrl} alt={officer.name} loading="lazy" decoding="async" />
        ) : (
          <div className={styles.missing}>Photo to come</div>
        )}
      </div>
      <div className={styles.caption}>
        <h3>{officer.name}</h3>
        <p>{officer.title}</p>
      </div>
    </article>
  );
}

export default async function OfficerBoardPage() {
  const [board, settings] = await Promise.all([getOfficers(), getSettings()]);
  const teamPhoto = settings.sectionImages?.team || "/photos/site/team-group.jpg";

  return (
    <div className={styles.board}>
      <PageShell title="Meet our team" narrow={false} image={teamPhoto}>
        <p className="ewb-note">Current officers as of {board.asOf}.</p>

        <section className={styles.section} aria-labelledby="executive-board">
          <h2 id="executive-board">Executive Board</h2>
          <div className={styles.grid}>
            {board.executiveBoard.map((officer) => (
              <OfficerCard key={`${officer.title}-${officer.name}`} officer={officer} />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="project-directors">
          <h2 id="project-directors">Project Directors</h2>
          <div className={styles.grid}>
            {board.projectDirectors.flatMap((group) => group.officers.map((officer) => (
              <OfficerCard key={`${group.heading}-${officer.title}-${officer.name}`} officer={officer} />
            )))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="faculty-advisor">
          <h2 id="faculty-advisor">Faculty Advisor</h2>
          <div className={styles.grid}>
            <OfficerCard officer={board.facultyAdvisor} />
          </div>
        </section>
      </PageShell>
    </div>
  );
}
