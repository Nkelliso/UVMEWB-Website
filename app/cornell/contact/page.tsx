import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contact — EWB UVM",
  description: "Get in touch with the EWB UVM chapter.",
};

export default async function CornellContactPage() {
  const settings = await getSettings();
  return (
    <PageShell eyebrow="Contact" title="Get in touch" image="/photos/contact.jpg">
      <p className="ewb-lede" style={{ marginBottom: "var(--space-lg)" }}>
        Want to join the chapter, partner with us, or support a project? Send a
        note and we&apos;ll get back to you. You can also email{" "}
        <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
      </p>
      <ContactForm />
    </PageShell>
  );
}
