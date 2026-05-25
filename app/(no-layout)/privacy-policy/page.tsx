

import {
  ShieldCheck,
  Lock,
  Database,
  FileText,
  Mail,
  Globe,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    title: "Introduction",
    icon: <Globe className="w-5 h-5" />,
    content:
      "CompliPing Pro is a compliance management platform operated by AtticBits Solutions Private Limited. This Privacy Policy explains how we collect, use, store, and protect information when users interact with our platform.",
  },
  {
    title: "Information We Collect",
    icon: <Database className="w-5 h-5" />,
    content:
      "We collect account details, WhatsApp messaging data, uploaded documents, billing information, device details, and consent records required for platform functionality and legal compliance.",
  },
  {
    title: "How We Use Data",
    icon: <CheckCircle2 className="w-5 h-5" />,
    content:
      "Data is used for compliance reminders, document collection, filing confirmations, billing management, security monitoring, and maintaining legal audit records.",
  },
  {
    title: "WhatsApp & Meta Data",
    icon: <ShieldCheck className="w-5 h-5" />,
    content:
      "We use Meta WhatsApp Cloud API only for delivering compliance communication. No data is used for advertising, profiling, or resale purposes.",
  },
  {
    title: "Consent & Opt-Out",
    icon: <FileText className="w-5 h-5" />,
    content:
      "Users must explicitly opt in before receiving messages. Clients can opt out anytime by replying STOP to any WhatsApp communication.",
  },
  {
    title: "Security & Encryption",
    icon: <Lock className="w-5 h-5" />,
    content:
      "Sensitive data is encrypted using AES-256 encryption. Data in transit is protected using TLS 1.3 and securely hosted in AWS India servers.",
  },
];

function SectionCard({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          {icon}
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>

      <p className="leading-8 text-slate-600">{content}</p>
    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-lg font-semibold text-slate-900">{value}</h3>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary/10 via-white to-indigo-100" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-5 py-2 text-sm font-medium text-brand-primary">
              <ShieldCheck className="h-4 w-4" />
              Privacy & Data Protection
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-7xl">
              Privacy Policy
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
              We are committed to protecting your privacy, securing your data,
              and maintaining complete transparency about how information is
              collected and used.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <span className="font-medium text-slate-700">
                  AES-256 Encryption
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <span className="font-medium text-slate-700">
                  TLS 1.3 Security
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <span className="font-medium text-slate-700">
                  India Data Hosting
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              content={section.content}
              icon={section.icon}
            />
          ))}
        </div>

        {/* Data Retention */}
        <div className="mt-20 rounded-4xl bg-white p-10 shadow-sm">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900">
              Data Retention
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              We retain information only for the legally required duration.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InfoCard
              title="Active Account Data"
              value="Retained while account is active"
            />

            <InfoCard
              title="Audit Logs"
              value="Minimum 2 years"
            />

            <InfoCard
              title="Consent Records"
              value="Minimum 2 years"
            />

            <InfoCard
              title="Billing Records"
              value="7 years"
            />
          </div>
        </div>

        {/* User Rights */}
        <div className="mt-20 rounded-4xl bg-brand-primary p-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black">
              Your Rights
            </h2>

            <p className="mt-5 text-lg leading-8 text-indigo-100">
              Under India's Digital Personal Data Protection Act 2023, users
              have full rights to access, update, delete, and control their
              personal data.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              "Access personal data",
              "Correct inaccurate information",
              "Delete stored information",
              "Withdraw consent anytime",
              "Request data portability",
              "Review consent history",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-5 w-5" />

                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-20 rounded-4xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-slate-900">
                Contact Us
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                For privacy-related concerns, legal requests, or support,
                contact AtticBits Solutions Private Limited.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-brand-primary px-6 py-5 text-white shadow-lg">
              <Mail className="h-5 w-5" />

              <span className="font-semibold">
                connect@atticbits.com
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-8 text-center">
          <p className="text-slate-500">
            © {new Date().getFullYear()} CompliPing Pro • AtticBits Solutions
            Private Limited
          </p>
        </footer>
      </section>
    </main>
  );
}