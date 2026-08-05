/**
 * Labeled placeholder for any image slot. No real photos were uploaded to the
 * original Lovable build, so every media area on the site renders one of these
 * until an officer uploads the real asset via /admin. Kept deliberately obvious
 * so nothing accidentally ships looking "finished."
 */
export default function Placeholder({
  label = "Placeholder photo — replace via /admin",
  height = "12rem",
}: {
  label?: string;
  height?: string;
}) {
  return (
    <div className="ewb-placeholder" style={{ minHeight: height }}>
      {label}
    </div>
  );
}
