import { type Config } from "@measured/puck";
import WorldMap from "@/components/WorldMap";
import Placeholder from "@/components/Placeholder";

type Components = {
  SectionIntro: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  RichText: { heading: string; body: string };
  StatStrip: { items: { value: string; label: string }[] };
  WorldMapBlock: Record<string, never>;
  ImageBand: { caption: string; height: string };
  CTABand: {
    heading: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
  };
  Divider: Record<string, never>;
  Spacer: { size: string };
};

export const puckConfig: Config<Components> = {
  components: {
    SectionIntro: {
      label: "Section (eyebrow + heading + text)",
      fields: {
        eyebrow: { type: "text" },
        heading: { type: "textarea" },
        body: { type: "textarea" },
        primaryLabel: { type: "text" },
        primaryHref: { type: "text" },
        secondaryLabel: { type: "text" },
        secondaryHref: { type: "text" },
      },
      defaultProps: {
        eyebrow: "Who we are",
        heading: "A short, human headline about this section.",
        body: "A paragraph of supporting text. Say what matters in plain language.",
        primaryLabel: "Learn more",
        primaryHref: "/about",
        secondaryLabel: "",
        secondaryHref: "",
      },
      render: ({
        eyebrow,
        heading,
        body,
        primaryLabel,
        primaryHref,
        secondaryLabel,
        secondaryHref,
      }) => (
        <section className="ewb-section is-bordered">
          <div className="ewb-split">
            <div className="ewb-split-aside">
              {eyebrow && <p className="ewb-eyebrow">{eyebrow}</p>}
            </div>
            <div className="ewb-split-main">
              <h2 className="ewb-display">{heading}</h2>
              {body && <p>{body}</p>}
              {(primaryLabel || secondaryLabel) && (
                <div className="ewb-actions">
                  {primaryLabel && (
                    <a className="ewb-btn ewb-btn-primary" href={primaryHref || "#"}>
                      {primaryLabel} <span aria-hidden>→</span>
                    </a>
                  )}
                  {secondaryLabel && (
                    <a className="ewb-btn ewb-btn-ghost" href={secondaryHref || "#"}>
                      {secondaryLabel} <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      ),
    },

    RichText: {
      label: "Text block",
      fields: {
        heading: { type: "text" },
        body: { type: "textarea" },
      },
      defaultProps: {
        heading: "Heading",
        body: "Add a paragraph of text here.",
      },
      render: ({ heading, body }) => (
        <section className="ewb-shell-body">
          <div className="ewb-wrap-narrow">
            {heading && <h2>{heading}</h2>}
            {body && <p>{body}</p>}
          </div>
        </section>
      ),
    },

    StatStrip: {
      label: "Stat strip",
      fields: {
        items: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" },
          },
          defaultItemProps: { value: "100+", label: "Label" },
          getItemSummary: (item) => item.label || "Stat",
        },
      },
      defaultProps: {
        items: [
          { value: "6,300", label: "Residents served" },
          { value: "700m", label: "New pipeline" },
          { value: "2026", label: "Implementation target" },
        ],
      },
      render: ({ items }) => (
        <section className="ewb-shell-body">
          <div className="ewb-wrap">
            <div className="ewb-stats">
              {items.map((s, i) => (
                <div className="ewb-stat" key={i}>
                  <div className="ewb-stat-val">{s.value}</div>
                  <div className="ewb-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    WorldMapBlock: {
      label: "World map",
      fields: {},
      render: () => (
        <section className="ewb-section is-bordered">
          <div className="ewb-wrap" style={{ marginBottom: "1.5rem" }}>
            <p className="ewb-eyebrow">Where we work</p>
            <h2 className="ewb-display" style={{ fontSize: "var(--text-h2)" }}>
              A chapter with global reach.
            </h2>
          </div>
          <WorldMap />
        </section>
      ),
    },

    ImageBand: {
      label: "Image band (placeholder)",
      fields: {
        caption: { type: "text" },
        height: {
          type: "select",
          options: [
            { label: "Short", value: "12rem" },
            { label: "Medium", value: "18rem" },
            { label: "Tall", value: "26rem" },
          ],
        },
      },
      defaultProps: {
        caption: "Placeholder photo — replace via /admin",
        height: "18rem",
      },
      render: ({ caption, height }) => (
        <section className="ewb-shell-body">
          <div className="ewb-wrap">
            <Placeholder label={caption} height={height} />
          </div>
        </section>
      ),
    },

    CTABand: {
      label: "Call to action band",
      fields: {
        heading: { type: "text" },
        body: { type: "textarea" },
        buttonLabel: { type: "text" },
        buttonHref: { type: "text" },
      },
      defaultProps: {
        heading: "Build something that lasts.",
        body: "Whether you want to join, partner, or support a project — we'd love to hear from you.",
        buttonLabel: "Get in touch",
        buttonHref: "/contact",
      },
      render: ({ heading, body, buttonLabel, buttonHref }) => (
        <section className="ewb-cta">
          <div className="ewb-wrap">
            <h2>{heading}</h2>
            {body && <p>{body}</p>}
            {buttonLabel && (
              <a className="ewb-btn ewb-btn-gold" href={buttonHref || "#"}>
                {buttonLabel} <span aria-hidden>→</span>
              </a>
            )}
          </div>
        </section>
      ),
    },

    Divider: {
      label: "Divider",
      fields: {},
      render: () => (
        <div className="ewb-wrap">
          <hr style={{ border: "none", borderTop: "1px solid var(--rule)" }} />
        </div>
      ),
    },

    Spacer: {
      label: "Spacer",
      fields: {
        size: {
          type: "select",
          options: [
            { label: "Small", value: "s" },
            { label: "Medium", value: "m" },
            { label: "Large", value: "l" },
          ],
        },
      },
      defaultProps: { size: "m" },
      render: ({ size }) => {
        const h = size === "s" ? "1.5rem" : size === "l" ? "6rem" : "3.5rem";
        return <div style={{ height: h }} />;
      },
    },
  },
};
