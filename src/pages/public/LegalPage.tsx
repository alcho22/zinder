/**
 * Generic legal page. Copy here is placeholder boilerplate so the routes work
 * and are styled. Replace with real, lawyer-reviewed content — the Admin
 * "Legal pages management" setting (Product Plan §13.3) is where this content
 * will ultimately be edited and served from the API.
 */

type Doc = 'privacy' | 'terms' | 'sms' | 'refund' | 'provider-agreement';

const DOCS: Record<Doc, { title: string; intro: string; sections: [string, string][] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This Privacy Policy explains how Zinder Service LLC collects, uses, and protects your information.',
    sections: [
      ['Information we collect', 'Account details, vehicle and address information you provide, service requests, and usage data needed to operate the marketplace.'],
      ['How we use information', 'To connect you with providers, process service requests, communicate with you, and improve the platform.'],
      ['Sharing', 'We share request details with the provider you select. Full contact details are shared only after a provider accepts your request.'],
      ['Your choices', 'You can update your profile, manage notifications, and request account deletion at any time.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These Terms govern your use of the Zinder marketplace. By using Zinder you agree to them.',
    sections: [
      ['Marketplace role', 'Zinder is a marketplace that connects customers with independent providers. Zinder does not perform the services itself.'],
      ['Accounts', 'You are responsible for keeping your account secure and for the accuracy of information you provide.'],
      ['Quotes & payments', 'Quotes are provided by independent providers. Payment for services is arranged between you and the provider unless otherwise stated.'],
      ['Acceptable use', 'You agree not to misuse the platform, submit fraudulent requests, or attempt to bypass the marketplace.'],
    ],
  },
  sms: {
    title: 'SMS Terms & Consent',
    intro: 'By providing your phone number and opting in, you consent to receive SMS messages from Zinder.',
    sections: [
      ['Message types', 'Account verification (OTP), request and quote updates, and service notifications.'],
      ['Frequency & rates', 'Message frequency varies. Message and data rates may apply.'],
      ['Opt-out', 'Reply STOP to unsubscribe at any time, or HELP for help.'],
    ],
  },
  refund: {
    title: 'Refund Policy',
    intro: 'This policy describes how refunds are handled on the Zinder platform.',
    sections: [
      ['Service payments', 'Payments for completed services are arranged with the provider. Refund eligibility for services is determined per provider and applicable law.'],
      ['Provider lead fees', 'Provider lead fees and related billing terms are described in the Provider Agreement.'],
    ],
  },
  'provider-agreement': {
    title: 'Provider Agreement',
    intro: 'This Agreement sets out the terms for businesses providing services through Zinder.',
    sections: [
      ['Eligibility', 'Providers must be properly licensed and insured where required and complete the onboarding and approval process.'],
      ['Lead fees', 'Providers pay a lead fee when they accept a customer request and send a quote. Fees vary by service value.'],
      ['Conduct', 'Providers agree to respond professionally, honor quoted pricing in good faith, and not bypass the platform to avoid fees.'],
      ['Suspension', 'Zinder may suspend or remove providers who violate this Agreement or generate excessive complaints.'],
    ],
  },
};

export default function LegalPage({ doc }: { doc: Doc }) {
  const d = DOCS[doc];
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">{d.title}</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mt-6 text-slate-600">{d.intro}</p>
      <div className="mt-8 space-y-6">
        {d.sections.map(([h, body]) => (
          <section key={h}>
            <h2 className="text-lg font-semibold text-slate-900">{h}</h2>
            <p className="mt-2 text-sm text-slate-600">{body}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
        ⚠️ Placeholder content for development. Replace with legally reviewed copy before launch.
      </p>
    </div>
  );
}
