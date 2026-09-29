"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Placeholder from "@/components/Placeholder";

const INTERVAL_MS = 5000;
const EMPTY_SLOTS = 3;

/** Rotating photo carousel for project pages. Auto-advances unless the
 *  visitor prefers reduced motion, pauses while hovered or focused, and
 *  supports prev/next, dots, arrow keys, and swipe. With no photos it shows
 *  labeled slots so the layout can be reviewed before photos arrive. */
export default function PhotoCarousel({
  photos,
  label,
}: {
  photos: string[];
  label: string;
}) {
  const empty = photos.length === 0;
  const count = empty ? EMPTY_SLOTS : photos.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (to: number) => setIndex(((to % count) + count) % count),
    [count]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (empty || paused || reduced || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [empty, paused, reduced, count]);

  return (
    <div
      className="proj-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="proj-carousel-viewport">
        <div
          className="proj-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="proj-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              {empty ? (
                <Placeholder label={`Photo ${i + 1} coming soon`} height="100%" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photos[i]}
                  alt={`${label}, photo ${i + 1} of ${count}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="proj-carousel-controls">
          <button
            type="button"
            className="proj-carousel-btn"
            onClick={() => go(index - 1)}
            aria-label="Previous photo"
          >
            <span aria-hidden>←</span>
          </button>
          <div className="proj-carousel-dots">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`proj-carousel-dot${i === index ? " is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
          <button
            type="button"
            className="proj-carousel-btn"
            onClick={() => go(index + 1)}
            aria-label="Next photo"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
