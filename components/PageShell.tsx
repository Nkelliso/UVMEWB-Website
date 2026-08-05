import type { ReactNode } from "react";

/** Standard interior-page wrapper: dark header band with eyebrow + title,
 *  then a constrained body.
 *
 *  Pass `image` to turn the header band into a photographic poster (used by the
 *  immersive / Cal Poly edition). If the file isn't uploaded yet the green field
 *  underneath shows through — never a broken band — so paths can be wired ahead
 *  of the photos arriving. */
export default function PageShell({
  eyebrow,
  title,
  children,
  narrow = true,
  image,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  narrow?: boolean;
  image?: string;
}) {
  return (
    <div className="ewb-shell">
      <div className="ewb-shell-head">
        {image && (
          <>
            <div
              className="ewb-shell-bg"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="ewb-shell-scrim" />
          </>
        )}
        <div className="ewb-wrap">
          <p className="ewb-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="ewb-shell-body">
        <div className={narrow ? "ewb-wrap-narrow" : "ewb-wrap"}>{children}</div>
      </div>
    </div>
  );
}
