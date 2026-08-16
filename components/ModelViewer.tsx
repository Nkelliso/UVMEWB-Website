"use client";

import { useEffect, useState } from "react";

// `<model-viewer>` is a browser-only custom element. We register it on the
// client (it touches `window`/`customElements`, so it can't run during SSR),
// then render the element once it's defined to avoid a flash of unstyled tag.
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        alt?: string;
        poster?: string;
        "camera-controls"?: boolean;
        "camera-orbit"?: string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        exposure?: string;
        loading?: string;
        reveal?: string;
        "ar"?: boolean;
        "ar-modes"?: string;
      };
    }
  }
}

export interface ModelViewerProps {
  src: string;
  alt?: string;
  poster?: string;
}

export default function ModelViewer({ src, alt, poster }: ModelViewerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="proj-model">
      {ready ? (
        <model-viewer
          src={src}
          alt={alt || "Interactive 3D model"}
          poster={poster}
          camera-controls
          camera-orbit="0deg 75deg auto"
          shadow-intensity="1"
          exposure="1"
          loading="lazy"
          reveal="auto"
          ar
          ar-modes="webxr scene-viewer quick-look"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <div className="proj-model-loading" aria-hidden>
          Loading 3D model…
        </div>
      )}
    </div>
  );
}
