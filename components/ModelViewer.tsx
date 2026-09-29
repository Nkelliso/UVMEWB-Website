"use client";

import { useEffect, useRef, useState } from "react";

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

// Safari on iPad still only ships the prefixed Fullscreen API.
type FullscreenCapable = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

export default function ModelViewer({ src, alt, poster }: ModelViewerProps) {
  const [ready, setReady] = useState(false);
  const [full, setFull] = useState(false);
  // iPhone Safari has no element fullscreen; fall back to a fixed overlay.
  const [overlay, setOverlay] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Track native fullscreen so Esc (handled by the browser) resets the button.
  useEffect(() => {
    const doc = document as FullscreenDoc;
    const sync = () => {
      const el = doc.fullscreenElement ?? doc.webkitFullscreenElement;
      setFull(el === boxRef.current);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  // The overlay fallback needs its own Esc handling and scroll lock.
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlay(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [overlay]);

  const toggle = () => {
    const doc = document as FullscreenDoc;
    const box = boxRef.current as FullscreenCapable | null;
    if (!box) return;
    if (overlay) return setOverlay(false);
    if (full) {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else doc.webkitExitFullscreen?.();
      return;
    }
    if (box.requestFullscreen) box.requestFullscreen().catch(() => setOverlay(true));
    else if (box.webkitRequestFullscreen) box.webkitRequestFullscreen();
    else setOverlay(true);
  };

  const expanded = full || overlay;

  return (
    <div
      ref={boxRef}
      className={overlay ? "proj-model is-overlay" : "proj-model"}
    >
      {ready && (
        <button
          type="button"
          className="proj-model-fs"
          onClick={toggle}
          aria-label={expanded ? "Exit full screen" : "View full screen"}
          title={expanded ? "Exit full screen" : "View full screen"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            {expanded ? (
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
            ) : (
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            )}
          </svg>
        </button>
      )}
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
