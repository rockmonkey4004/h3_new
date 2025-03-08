import Head from 'next/head';
import Link from 'next/link';
import PostCard from '../../components/blog/PostCard';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getAllPosts } from '../../lib/mdx';

// Component that handles its own data loading
export default function TopicPage() {
  const router = useRouter();
  const { tag } = router.query;
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load data client-side
  useEffect(() => {
    if (!tag) return; // Wait for tag to be available
    
    // Simple function to get posts for a tag
    const getPostsForTag = (tagValue) => {
      try {
        // Get all posts
        const allPosts = getAllPosts();
        if (!Array.isArray(allPosts)) return [];
        
        // Find posts with matching tag
        return allPosts.filter(post => {
          if (!post || !post.frontmatter) return false;
          
          const postTags = post.frontmatter.tags;
          
          if (Array.isArray(postTags)) {
            return postTags.includes(tagValue);
          } else if (typeof postTags === 'string') {
            return postTags === tagValue;
          }
          
          return false;
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    };
    
    // Get matching posts
    const matchingPosts = getPostsForTag(tag);
    setPosts(matchingPosts);
    setLoading(false);
  }, [tag]);
  
  // Convert tag to safe string
  const safeTag = typeof tag === 'string' ? tag : '';
  
  // Show loading state
  if (loading) {
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Loading...</h1>
        <p>Finding posts tagged with "{safeTag}"</p>
      </div>
    );
  }
  
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
          {posts.length > 0 
            ? `Showing ${posts.length} posts tagged with "${safeTag}"`
            : `No posts found tagged with "${safeTag}"`}
        </p>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostCard 
                key={index} 
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
            <div className="mt-8">
              <Link href="/topics" className="btn">
                Browse All Topics
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Create limited static paths (just placeholders)
export async function getStaticPaths() {
  // Just return an empty paths array with fallback true
  return {
    paths: [],
    fallback: true // This is the key change - enable fallback
  };
}

// Minimal static props
export async function getStaticProps() {
  // Return minimal props, data will be loaded client-side
  return {
    props: {}
  };
} 