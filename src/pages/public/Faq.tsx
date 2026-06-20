const FAQS: [string, string][] = [
  ['How much does Zinder cost customers?', 'Zinder is free for customers. You search, compare providers, and request quotes at no charge. You only pay the provider directly for the service you choose.'],
  ['How do I get a quote?', 'Search for the service you need, pick a provider, and submit a structured request with your vehicle and job details. The provider reviews it and sends you a final quote.'],
  ['Is the price I see the final price?', 'Listed prices are estimated ranges set by each provider. Your final quote may vary based on your vehicle and the specific work needed.'],
  ['Do providers come to me?', 'Many providers offer mobile / on-site service. You can filter to show only mobile providers when you search.'],
  ['How do I become a provider?', 'Create an account, then apply through “Become a Provider.” Our team reviews applications (usually within 48 hours) before your provider dashboard unlocks.'],
  ['What areas do you serve?', 'Zinder is launching in Austin, Texas, with plans to expand to more cities across the U.S.'],
];

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Frequently asked questions</h1>
      <div className="mt-8 space-y-4">
        {FAQS.map(([q, a]) => (
          <details key={q} className="card group p-5">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
              <span className="flex items-center justify-between">
                {q}
                <span className="text-brand-600 transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
