import Head from 'next/head';
import PostCard from '../../components/blog/PostCard';
import { getAllTags, getPostsByTag } from '../../lib/mdx';
import { useMemo } from 'react';

export default function TopicPage({ tag = '', posts = [] }) {
  // Convert tag to string and sanitize
  const safeTag = useMemo(() => {
    try {
      return typeof tag === 'string' ? tag.trim() : String(tag || '').trim();
    } catch (e) {
      console.error('Error processing tag:', e);
      return '';
    }
  }, [tag]);
  
  // Process posts safely with useMemo to avoid recomputation
  const postsArray = useMemo(() => {
    try {
      // First verify if posts is an array
      if (!Array.isArray(posts)) {
        return [];
      }
      
      // Then filter out any invalid posts
      return posts.filter(post => 
        post && 
        typeof post === 'object' && 
        post.slug && 
        typeof post.slug === 'string' &&
        post.frontmatter && 
        typeof post.frontmatter === 'object'
      );
    } catch (e) {
      console.error('Error processing posts:', e);
      return [];
    }
  }, [posts]);
  
  // Handle any errors in the render process
  try {
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
              {postsArray.map((post, index) => (
                <PostCard 
                  key={`${post.slug}-${index}`} 
                  post={post} 
                />
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
  } catch (error) {
    console.error('Error rendering TopicPage:', error);
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-lg text-gray-600">
          Sorry, there was an error loading this page. Please try again later.
        </p>
      </div>
    );
  }
}

export async function getStaticPaths() {
  try {
    // Try to get tags, but handle any potential errors
    const rawTags = getAllTags();
    
    // Force conversion to array and ensure each item is a string
    // This explicit JSON parsing/stringifying forces a clean array data structure
    let tagsArray = [];
    
    try {
      // Attempt to clean the data by JSON serialization/deserialization
      if (rawTags) {
        const cleanJson = JSON.stringify(rawTags);
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed)) {
          tagsArray = parsed.filter(tag => tag && typeof tag === 'string');
        }
      }
    } catch (jsonError) {
      console.warn('Error cleaning tags data:', jsonError);
      // Fallback to manual filtering if JSON method fails
      if (Array.isArray(rawTags)) {
        tagsArray = rawTags.filter(tag => tag && typeof tag === 'string');
      } else if (rawTags && typeof rawTags === 'string') {
        tagsArray = [rawTags];
      }
    }
    
    // Create an explicitly formatted paths array with stringified params
    const paths = [];
    
    // Use a for loop instead of map to avoid any potential array method issues
    for (let i = 0; i < tagsArray.length; i++) {
      const tagStr = String(tagsArray[i] || '').trim();
      if (tagStr) {
        paths.push({
          params: { tag: tagStr }
        });
      }
    }
    
    console.log(`Generated ${paths.length} static paths for tags`);
    
    return {
      paths: paths,
      fallback: false
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    // Safely extract the tag parameter, ensure it's a string
    const tag = params && params.tag ? String(params.tag) : '';
    
    // Only proceed if we have a valid tag
    if (!tag || tag.trim() === '') {
      console.warn('Empty or invalid tag parameter received');
      return {
        props: {
          tag: '',
          posts: [],
        },
      };
    }
    
    // Get posts for this tag
    const rawPosts = getPostsByTag(tag);
    
    // Clean the data structure by forcing serialization/deserialization
    let cleanPosts = [];
    
    try {
      // Attempt to clean the data through JSON
      const postsJson = JSON.stringify(rawPosts);
      const parsedPosts = JSON.parse(postsJson);
      
      if (Array.isArray(parsedPosts)) {
        cleanPosts = parsedPosts.filter(post => 
          post && 
          typeof post === 'object' && 
          post.slug && 
          post.frontmatter
        );
      }
    } catch (jsonError) {
      console.warn('Error cleaning posts data:', jsonError);
      // Fall back to manual filtering
      if (Array.isArray(rawPosts)) {
        cleanPosts = rawPosts.filter(post => 
          post && 
          typeof post === 'object' && 
          post.slug && 
          post.frontmatter
        );
      }
    }
    
    console.log(`Found ${cleanPosts.length} posts for tag "${tag}"`);
    
    return {
      props: {
        tag,
        posts: cleanPosts,
      },
    };
  } catch (error) {
    console.error(`Error getting static props for tag ${params?.tag}:`, error);
    return {
      props: {
        tag: params?.tag ? String(params.tag) : '',
        posts: [],
      },
    };
  }
} 