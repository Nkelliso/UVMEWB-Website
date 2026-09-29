import type { CSSProperties, ReactNode } from "react";

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
  tall = false,
  imageRatio,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  narrow?: boolean;
  image?: string;
  /** Grow the photographic header band to a 2:1 crop anchored at the top of the
   *  photo, so most of the image shows instead of a thin band. */
  tall?: boolean;
  /** Width / height of `image`. When set, the band takes the photo's exact
   *  shape on desktop so the whole photo shows (no crop); phones keep the
   *  standard band so the title still fits. */
  imageRatio?: number;
}) {
  return (
    <div className="ewb-shell">
      <div
        className={`ewb-shell-head${tall ? " is-tall" : ""}${imageRatio ? " is-fit" : ""}`}
        style={imageRatio ? ({ "--head-ratio": imageRatio } as CSSProperties) : undefined}
      >
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
          {eyebrow && <p className="ewb-eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
        </div>
      </div>
      <div className="ewb-shell-body">
        <div className={narrow ? "ewb-wrap-narrow" : "ewb-wrap"}>{children}</div>
      </div>
    </div>
  );
}
