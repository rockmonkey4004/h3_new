import Head from 'next/head';
import Link from 'next/link';
import { getAllTags } from '../../lib/mdx';

export default function TopicsPage({ tags = [] }) {
  // Ensure tags is an array
  const tagsArray = Array.isArray(tags) ? tags : [];
  
  return (
    <>
      <Head>
        <title>Topics | Health, Healing, and Hope</title>
        <meta name="description" content="Browse all topics on Health, Healing, and Hope - paleo, gluten-free, wellness tips, and more." />
      </Head>

      <div className="container-narrow py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Topics</h1>
        
        <p className="text-lg text-gray-600 mb-12 text-center">
          Browse all topics to find exactly what you're looking for
        </p>
        
        {tagsArray.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tagsArray.map((tag) => (
              <Link
                key={tag}
                href={`/topics/${tag}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <span className="text-lg font-medium text-accent-dark">{tag}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No topics found. Check back later!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const tags = getAllTags();
  
  // Ensure tags is an array
  const tagsArray = Array.isArray(tags) ? tags : [];
  
  return {
    props: {
      tags: tagsArray,
    },
  };
} 