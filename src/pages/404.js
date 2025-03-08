import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | Health, Healing, and Hope</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>

      <div className="container-narrow py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <h2 className="text-3xl font-semibold mb-8">Page Not Found</h2>
        
        <p className="text-xl text-gray-600 mb-10">
          Oops! The page you are looking for does not exist.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="btn">
            Return Home
          </Link>
          
          <Link href="/recipes" className="btn-secondary btn">
            Browse Recipes
          </Link>
        </div>
      </div>
    </>
  );
} 