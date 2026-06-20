import { Link } from '@/lib/router';

export function Logo({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
          <path
            d="M20 22h24l-22 20h22"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Zinder
      </span>
    </Link>
  );
}
