import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

