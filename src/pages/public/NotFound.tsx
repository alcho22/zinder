import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-6xl">🛠️</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">We couldn’t find the page you were looking for.</p>
        <Link to="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </div>
  );
}
