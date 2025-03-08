import Head from 'next/head';
import PostCard from '../../components/blog/PostCard';
import { getAllTags, getPostsByTag } from '../../lib/mdx';

export default function TopicPage({ tag = '', posts = [] }) {
  // Ensure posts is an array
  const postsArray = Array.isArray(posts) ? posts : [];
  
  return (
    <>
      <Head>
        <title>{tag} | Health, Healing, and Hope</title>
        <meta name="description" content={`Browse all ${tag} posts on Health, Healing, and Hope.`} />
      </Head>

      <div className="container-narrow py-12">
        <h1 className="text-4xl font-bold mb-4 text-center capitalize">{tag}</h1>
        
        <p className="text-lg text-gray-600 mb-12 text-center">
          Showing {postsArray.length} posts tagged with "{tag}"
        </p>
        
        {postsArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsArray.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
            <p className="text-gray-600">
              There are no posts with this tag yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const tags = getAllTags();
  
  // Ensure tags is an array
  const tagsArray = Array.isArray(tags) ? tags : [];
  
  const paths = tagsArray.map((tag) => ({
    params: { tag },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { tag } = params || {};
  const posts = getPostsByTag(tag || '');
  
  // Ensure posts is an array
  const postsArray = Array.isArray(posts) ? posts : [];
  
  return {
    props: {
      tag: tag || '',
      posts: postsArray,
    },
  };
} 