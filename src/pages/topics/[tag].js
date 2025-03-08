import Head from 'next/head';
import PostCard from '../../components/blog/PostCard';
import { getAllTags, getPostsByTag } from '../../lib/mdx';

export default function TopicPage({ tag = '', posts = [] }) {
  // Extra safety: convert tag to string if it's somehow not a string
  const safeTag = typeof tag === 'string' ? tag : String(tag || '');
  
  // Ensure posts is an array and filter out any potentially invalid entries
  const postsArray = Array.isArray(posts) 
    ? posts.filter(post => post && typeof post === 'object' && post.slug && post.frontmatter)
    : [];
  
  return (
    <>
      <Head>
        <title>{safeTag || 'Topic'} | Health, Healing, and Hope</title>
        <meta 
          name="description" 
          content={`Browse all ${safeTag} posts on Health, Healing, and Hope.`} 
        />
      </Head>

      <div className="container-narrow py-12">
        <h1 className="text-4xl font-bold mb-4 text-center capitalize">
          {safeTag || 'Topic'}
        </h1>
        
        <p className="text-lg text-gray-600 mb-12 text-center">
          {postsArray.length > 0 
            ? `Showing ${postsArray.length} posts tagged with "${safeTag}"`
            : `No posts found tagged with "${safeTag}"`}
        </p>
        
        {postsArray.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsArray.map((post) => (
              <PostCard key={post.slug || `post-${Math.random()}`} post={post} />
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
  try {
    // Try to get tags, but handle any potential errors
    const tags = getAllTags();
    
    // Ultra-defensive approach: ensure tags is an array and each tag is a string
    let tagsArray = [];
    
    if (Array.isArray(tags)) {
      // Filter out any non-string values and ensure we have valid tags
      tagsArray = tags.filter(tag => tag && typeof tag === 'string');
    } else if (tags && typeof tags === 'string') {
      // If tags is a single string, convert it to an array
      tagsArray = [tags];
    }
    
    // If we somehow have no tags, return an empty paths array
    if (tagsArray.length === 0) {
      console.warn('No tags found for static paths generation');
      return {
        paths: [],
        fallback: false
      };
    }
    
    // Create the paths with proper params object format
    const paths = tagsArray.map(tag => ({
      params: { tag: String(tag) } // Ensure tag is a string
    }));
    
    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    // If anything goes wrong, log the error and return an empty paths array
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    // Safely extract the tag parameter
    const tag = params?.tag || '';
    
    // Only proceed if we have a valid tag
    if (!tag || typeof tag !== 'string') {
      return {
        props: {
          tag: '',
          posts: [],
        },
      };
    }
    
    // Get posts for this tag
    const posts = getPostsByTag(tag);
    
    // Ensure posts is an array and each post has the expected structure
    let postsArray = [];
    
    if (Array.isArray(posts)) {
      // Filter out any invalid posts (must have slug and frontmatter)
      postsArray = posts.filter(post => 
        post && 
        typeof post === 'object' && 
        post.slug && 
        post.frontmatter
      );
    }
    
    return {
      props: {
        tag,
        posts: postsArray,
      },
    };
  } catch (error) {
    // If anything goes wrong, log the error and return empty data
    console.error(`Error getting static props for tag ${params?.tag}:`, error);
    return {
      props: {
        tag: params?.tag || '',
        posts: [],
      },
    };
  }
} 