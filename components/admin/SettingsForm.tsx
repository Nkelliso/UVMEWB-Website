"use client";

import { useState } from "react";
import AdminChrome, { Field, ImageField } from "./AdminChrome";
import { saveSettingsAction } from "@/app/admin/actions";
import type { SiteSettings, HomeCopy } from "@/lib/types";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const set = (patch: Partial<SiteSettings>) => setS((p) => ({ ...p, ...patch }));
  const home = s.home ?? {};
  const setHome = (patch: Partial<HomeCopy>) =>
    setS((p) => ({ ...p, home: { ...p.home, ...patch } }));

  return (
    <AdminChrome
      title="Site Settings"
      intro="Chapter identity, the home-page hero, and contact details."
      value={s}
      onSave={saveSettingsAction}
    >
      <Field label="Chapter name" value={s.chapterName} onChange={(v) => set({ chapterName: v })} />
      <Field label="Tagline (footer + meta)" value={s.tagline} onChange={(v) => set({ tagline: v })} textarea />
      <Field label="Contact email" value={s.contactEmail} onChange={(v) => set({ contactEmail: v })} />
      <ImageField
        label="Chapter logo (blank = text wordmark in the header)"
        value={s.logoUrl ?? ""}
        onChange={(v) => set({ logoUrl: v })}
      />

      <hr className="my-6 border-neutral-300" />
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Social &amp; links (footer + sponsors)</p>
      <Field label="Instagram URL (optional)" value={s.instagram ?? ""} onChange={(v) => set({ instagram: v })} placeholder="https://instagram.com/…" />
      <Field label="Facebook URL (optional)" value={s.facebook ?? ""} onChange={(v) => set({ facebook: v })} placeholder="https://facebook.com/…" />
      <Field label="LinkedIn URL (optional)" value={s.linkedin ?? ""} onChange={(v) => set({ linkedin: v })} placeholder="https://linkedin.com/company/…" />
      <Field label="Sponsorship package link (PDF / Drive URL)" value={s.sponsorshipPackageUrl ?? ""} onChange={(v) => set({ sponsorshipPackageUrl: v })} placeholder="https://…" />

      <hr className="my-6 border-neutral-300" />
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Home hero</p>
      <Field label="Hero heading" value={s.heroHeading} onChange={(v) => set({ heroHeading: v })} textarea />
      <Field label="Hero subline" value={s.heroSubline} onChange={(v) => set({ heroSubline: v })} textarea />
      <ImageField
        label="Hero image (blank shows a placeholder)"
        value={s.heroImages?.[0] ?? ""}
        onChange={(v) => set({ heroImages: v ? [v] : [] })}
      />
      <p className="text-xs text-neutral-400 -mt-1 mb-3">
        Tip: use <b>Photos</b> in the admin to crop &amp; color-adjust before placing.
      </p>

      <hr className="my-6 border-neutral-300" />
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Home page sections</p>
      <p className="text-xs text-neutral-400 mb-3">
        The scrolling sections below the hero. Leave a field blank to keep the
        default wording. Section photos are set in <b>Photos</b>.
      </p>
      <Field
        label="Projects section — heading"
        value={home.projectsTitle ?? ""}
        onChange={(v) => setHome({ projectsTitle: v })}
        placeholder="Projects, near and far"
      />
      <Field
        label="Giving section — heading"
        value={home.givingTitle ?? ""}
        onChange={(v) => setHome({ givingTitle: v })}
        placeholder="Giving"
      />
      <Field
        label="Giving section — text"
        value={home.givingBody ?? ""}
        onChange={(v) => setHome({ givingBody: v })}
        placeholder="Every gift trains the next generation of engineers while changing lives in the communities we serve."
        textarea
      />
      <Field
        label="Join section — heading"
        value={home.joinTitle ?? ""}
        onChange={(v) => setHome({ joinTitle: v })}
        placeholder="Join us"
      />
      <Field
        label="Join section — text"
        value={home.joinBody ?? ""}
        onChange={(v) => setHome({ joinBody: v })}
        placeholder="Want to join the chapter, partner with us, or support a project? We'd love to hear from you."
        textarea
      />
    </AdminChrome>
  );
}
