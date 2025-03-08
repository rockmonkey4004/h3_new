import Head from 'next/head';
import Link from 'next/link';
import PostCard from '../../components/blog/PostCard';
import { getAllPosts } from '../../lib/mdx';

// Component with minimal complexity
export default function TopicPage({ tag, posts }) {
  // Convert props to simplest form
  const safeTag = String(tag || '');
  const postsArray = Array.isArray(posts) ? posts : [];
  
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

// Hard-coded static paths
export async function getStaticPaths() {
  try {
    // Get all posts directly
    const allPosts = Array.isArray(getAllPosts()) ? getAllPosts() : [];
    
    // Extract tags manually
    const tagsSet = new Set();
    allPosts.forEach(post => {
      if (post && post.frontmatter && post.frontmatter.tags) {
        if (Array.isArray(post.frontmatter.tags)) {
          post.frontmatter.tags.forEach(tag => {
            if (tag && typeof tag === 'string') {
              tagsSet.add(tag);
            }
          });
        } else if (typeof post.frontmatter.tags === 'string') {
          tagsSet.add(post.frontmatter.tags);
        }
      }
    });
    
    // Convert to array and create paths manually
    const tags = Array.from(tagsSet);
    const paths = [];
    
    for (let i = 0; i < tags.length; i++) {
      paths.push({
        params: { tag: String(tags[i]) }
      });
    }
    
    // Fallback paths in case we have no tags
    const fallbackPaths = [
      { params: { tag: 'paleo' } },
      { params: { tag: 'recipes' } },
      { params: { tag: 'desserts' } }
    ];
    
    // Return either our found paths or fallbacks
    return {
      paths: paths.length > 0 ? paths : fallbackPaths,
      fallback: false
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    // Return minimal safe fallback
    return {
      paths: [
        { params: { tag: 'paleo' } }
      ],
      fallback: false
    };
  }
}

// Simple implementation that manually filters posts
export async function getStaticProps({ params }) {
  try {
    const tagValue = params?.tag ? String(params.tag) : '';
    const allPosts = Array.isArray(getAllPosts()) ? getAllPosts() : [];
    
    // Filter posts manually without complex operations
    const matchingPosts = [];
    
    for (let i = 0; i < allPosts.length; i++) {
      const post = allPosts[i];
      if (!post || !post.frontmatter) continue;
      
      let match = false;
      
      // Check tags array
      if (Array.isArray(post.frontmatter.tags)) {
        for (let j = 0; j < post.frontmatter.tags.length; j++) {
          if (post.frontmatter.tags[j] === tagValue) {
            match = true;
            break;
          }
        }
      } 
      // Check string tag
      else if (post.frontmatter.tags === tagValue) {
        match = true;
      }
      
      if (match) {
        // Create a simple object with only necessary properties
        matchingPosts.push({
          slug: post.slug,
          frontmatter: {
            title: post.frontmatter.title || '',
            date: post.frontmatter.date || '',
            description: post.frontmatter.description || '',
            featured_image: post.frontmatter.featured_image || '',
            alt: post.frontmatter.alt || '',
            tags: post.frontmatter.tags || []
          },
          content: post.content
        });
      }
    }
    
    return {
      props: {
        tag: tagValue,
        posts: matchingPosts
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        tag: params?.tag || '',
        posts: []
      }
    };
  }
} 