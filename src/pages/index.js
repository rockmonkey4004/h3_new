import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Health, Healing, and Hope with Laura</title>
        <meta name="description" content="Join my journey of health, healing, and hope focused on nutrient-dense paleo foods, stress management, and learning to listen to your body." />
      </Head>

      <div className="container-narrow py-12">
        <div className="text-center mb-12">
          <h1 className="mb-4">Health, Healing, and Hope</h1>
          <p className="text-xl text-gray-600">
            Join me on a journey of wellness and discovery
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Favorite Recipes</h2>
            <p className="mb-4">This is a collection of my personal favorite recipes often passing the test with non-paleo eaters.</p>
            <Link href="/recipes" className="btn">
              View Recipes
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">About My Journey</h2>
            <p className="mb-4">Learn about my wellness journey and how I found healing through paleo living and lifestyle changes.</p>
            <Link href="/about" className="btn">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 