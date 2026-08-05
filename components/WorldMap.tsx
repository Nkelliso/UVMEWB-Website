/**
 * "Where we work" map. The original Lovable build referenced a world-map image
 * that was never uploaded, so this renders a labeled placeholder with the
 * chapter's active locations pinned on it. Swap in a real map image later by
 * setting a background on `.ewb-map` and positioning the pins.
 */
const LOCATIONS = [
  { name: "Kajinge, Rwanda", top: "58%", left: "56%" },
  { name: "Catskills, New York", top: "40%", left: "27%" },
  { name: "Vermont (local)", top: "34%", left: "28%" },
];

export default function WorldMap() {
  return (
    <div className="ewb-wrap">
      <div className="ewb-map">
        <div
          className="ewb-placeholder"
          style={{ minHeight: "22rem", borderRadius: 0, border: "none" }}
        >
          World map — placeholder
        </div>
        {LOCATIONS.map((loc) => (
          <span
            key={loc.name}
            className="ewb-map-pin"
            style={{ top: loc.top, left: loc.left }}
            title={loc.name}
            aria-label={loc.name}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        {LOCATIONS.map((loc) => (
          <span key={loc.name} className="ewb-tag">
            {loc.name}
          </span>
        ))}
      </div>
    </div>
  );
}
