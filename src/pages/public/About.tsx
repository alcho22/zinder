export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">About Zinder</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-slate-600">
        <p>
          Zinder is an online marketplace for automotive services. We connect car owners with trusted local
          automotive service providers — mobile mechanics, detailers, tire shops, battery services, oil change
          providers, tint shops, body shops, towing companies, and more.
        </p>
        <p>
          Finding reliable automotive help today is slow and fragmented. People search on Google, call multiple
          shops, ask for prices, and wait for responses — without ever knowing who is available or what a fair
          price looks like. Zinder replaces that messy process with one simple flow: search for a service, compare
          local providers, and submit a structured request to get a real quote.
        </p>
        <h2 className="text-xl font-semibold text-slate-900">Our mission</h2>
        <p>
          To become the default way people find and request automotive services across the United States — starting
          right here in Austin, Texas.
        </p>
        <h2 className="text-xl font-semibold text-slate-900">For providers</h2>
        <p>
          Zinder gives automotive businesses a professional profile, control over their pricing, and higher-intent
          leads from customers who have already chosen their service and shared the details that matter.
        </p>
      </div>
    </div>
  );
}
