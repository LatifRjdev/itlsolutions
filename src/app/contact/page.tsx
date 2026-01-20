import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ITL Solutions. We're here to help with your technology needs.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@itlsolutions.net",
    href: "mailto:hello@itlsolutions.net",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "123 Tech Park, Silicon Valley, CA 94025",
    href: null,
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--primary)]/10 to-transparent">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed">
              Have a project in mind or want to learn more about our services?
              We&apos;d love to hear from you.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[var(--background)]">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)]">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
                  Get in touch
                </h2>
                <p className="text-[var(--foreground-secondary)] mb-8">
                  We&apos;re here to help and answer any questions you might have.
                  We look forward to hearing from you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]"
                  >
                    <div className="size-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-1">
                      {info.title}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-[var(--foreground-secondary)] hover:text-[var(--primary)] transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-[var(--foreground-secondary)]">
                        {info.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)] h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101223.02517846919!2d-122.18346984242845!3d37.38837199648534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb68ad0cfc739%3A0x7eb356b66bd4b50e!2sSilicon%20Valley!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
