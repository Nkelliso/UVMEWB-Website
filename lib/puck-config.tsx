import { FieldLabel, type Config, type CustomField } from "@measured/puck";
import WorldMap from "@/components/WorldMap";
import Placeholder from "@/components/Placeholder";
import FormattedText, { safeHref } from "@/components/FormattedText";
import FormattedTextField from "@/components/admin/FormattedTextField";
import { ImageField } from "@/components/admin/ImageField";

// Block names (SectionIntro, RichText, ImageBand, …) are stored in saved page
// data, so they stay fixed; only the labels officers see are friendly.
type Components = {
  SectionIntro: {
    /** Gold eyebrow labels were removed site-wide (2026-09-29). Old saved
     *  pages may still carry a value; it's ignored. */
    eyebrow?: string;
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
  ImageBand: { image?: string; alt?: string; caption: string; height: string };
  CTABand: {
    heading: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
  };
  Divider: Record<string, never>;
  Spacer: { size: string };
};

/** A text box with Bold / Italic / Link / Bullet list buttons. */
function formattedField(label: string, rows = 5): CustomField<string> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <FieldLabel label={label} el="div" readOnly={readOnly}>
        <FormattedTextField value={value} onChange={onChange} rows={rows} readOnly={readOnly} />
      </FieldLabel>
    ),
  };
}

/** The same upload / choose-a-photo picker used everywhere else in the admin. */
const photoField: CustomField<string | undefined> = {
  type: "custom",
  label: "Photo",
  render: ({ value, onChange }) => (
    <ImageField label="Photo" value={value ?? ""} onChange={(v) => onChange(v)} />
  ),
};

const linkHint = "(for example /contact or https://…)";

export const puckConfig: Config<Components> = {
  // The page itself has no settings to fill in (hides Puck's default "title").
  root: { fields: {} },
  components: {
    SectionIntro: {
      label: "Section: heading, text, and buttons",
      fields: {
        heading: { type: "textarea", label: "Heading" },
        body: formattedField("Text"),
        primaryLabel: { type: "text", label: "Main button text (leave blank for no button)" },
        primaryHref: { type: "text", label: `Main button link ${linkHint}` },
        secondaryLabel: { type: "text", label: "Second button text (optional)" },
        secondaryHref: { type: "text", label: `Second button link ${linkHint}` },
      },
      defaultProps: {
        heading: "A short, human headline about this section.",
        body: "A paragraph of supporting text. Say what matters in plain language.",
        primaryLabel: "Learn more",
        primaryHref: "/about",
        secondaryLabel: "",
        secondaryHref: "",
      },
      render: ({
        heading,
        body,
        primaryLabel,
        primaryHref,
        secondaryLabel,
        secondaryHref,
      }) => (
        <section className="ewb-section is-bordered">
          <div className="ewb-split">
            <div className="ewb-split-aside" />
            <div className="ewb-split-main">
              <h2 className="ewb-display">{heading}</h2>
              <FormattedText text={body} />
              {(primaryLabel || secondaryLabel) && (
                <div className="ewb-actions">
                  {primaryLabel && (
                    <a className="ewb-btn ewb-btn-primary" href={safeHref(primaryHref) ?? "#"}>
                      {primaryLabel} <span aria-hidden>→</span>
                    </a>
                  )}
                  {secondaryLabel && (
                    <a className="ewb-btn ewb-btn-ghost" href={safeHref(secondaryHref) ?? "#"}>
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
      label: "Text",
      fields: {
        heading: { type: "text", label: "Heading (optional)" },
        body: formattedField("Text", 8),
      },
      defaultProps: {
        heading: "Heading",
        body: "Add a paragraph of text here.",
      },
      render: ({ heading, body }) => (
        <section className="ewb-shell-body">
          <div className="ewb-wrap-narrow">
            {heading && <h2>{heading}</h2>}
            <FormattedText text={body} />
          </div>
        </section>
      ),
    },

    StatStrip: {
      label: "Numbers in a row",
      fields: {
        items: {
          type: "array",
          label: "Numbers",
          arrayFields: {
            value: { type: "text", label: "Number (for example 700m)" },
            label: { type: "text", label: "What it counts" },
          },
          defaultItemProps: { value: "100+", label: "Label" },
          getItemSummary: (item) => item.label || "Number",
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
            <h2 className="ewb-display" style={{ fontSize: "var(--text-h2)" }}>
              A chapter with global reach.
            </h2>
          </div>
          <WorldMap />
        </section>
      ),
    },

    ImageBand: {
      label: "Photo",
      fields: {
        image: photoField,
        alt: { type: "text", label: "Describe the photo in a few words (read aloud to people using screen readers)" },
        caption: { type: "text", label: "Caption under the photo (optional)" },
        height: {
          type: "select",
          label: "Height",
          options: [
            { label: "Short", value: "12rem" },
            { label: "Medium", value: "18rem" },
            { label: "Tall", value: "26rem" },
            { label: "Show the whole photo (no cropping)", value: "auto" },
          ],
        },
      },
      defaultProps: {
        image: "",
        alt: "",
        caption: "",
        height: "18rem",
      },
      render: ({ image, alt, caption, height }) => (
        <section className="ewb-shell-body">
          <div className="ewb-wrap">
            {image ? (
              <figure style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={alt || caption || ""}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: height === "auto" ? "auto" : height,
                    objectFit: "cover",
                    borderRadius: "var(--radius)",
                    display: "block",
                  }}
                />
                {caption && (
                  <figcaption className="ewb-note" style={{ marginTop: "0.6rem" }}>
                    {caption}
                  </figcaption>
                )}
              </figure>
            ) : (
              <Placeholder
                label={caption || "Choose a photo for this block"}
                height={height === "auto" ? "18rem" : height}
              />
            )}
          </div>
        </section>
      ),
    },

    CTABand: {
      label: "Green band with a button",
      fields: {
        heading: { type: "text", label: "Heading" },
        body: formattedField("Text", 3),
        buttonLabel: { type: "text", label: "Button text (leave blank for no button)" },
        buttonHref: { type: "text", label: `Button link ${linkHint}` },
      },
      defaultProps: {
        heading: "Build something that lasts.",
        body: "Whether you want to join, partner, or support a project, we'd love to hear from you.",
        buttonLabel: "Get in touch",
        buttonHref: "/contact",
      },
      render: ({ heading, body, buttonLabel, buttonHref }) => (
        <section className="ewb-cta">
          <div className="ewb-wrap">
            <h2>{heading}</h2>
            <FormattedText text={body} />
            {buttonLabel && (
              <a className="ewb-btn ewb-btn-gold" href={safeHref(buttonHref) ?? "#"}>
                {buttonLabel} <span aria-hidden>→</span>
              </a>
            )}
          </div>
        </section>
      ),
    },

    Divider: {
      label: "Divider line",
      fields: {},
      render: () => (
        <div className="ewb-wrap">
          <hr style={{ border: "none", borderTop: "1px solid var(--rule)" }} />
        </div>
      ),
    },

    Spacer: {
      label: "Empty space",
      fields: {
        size: {
          type: "select",
          label: "How much space",
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
