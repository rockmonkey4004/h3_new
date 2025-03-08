import Head from 'next/head';
import PostCard from '../../components/blog/PostCard';
import { getAllTags, getPostsByTag } from '../../lib/mdx';
import { useMemo } from 'react';
import { sanitizeData, ensureArray } from '../../lib/utils';

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
    console.log("Starting getStaticPaths for topics/[tag]");
    let rawTags = getAllTags();
    console.log(`Raw tags retrieved: ${JSON.stringify(rawTags)}`);
    
    // Convert tags to a clean array of strings
    const tags = ensureArray(rawTags).filter(tag => 
      tag !== null && tag !== undefined && String(tag).trim() !== ''
    ).map(tag => String(tag));
    
    console.log(`Sanitized tags: ${JSON.stringify(tags)}`);
    
    // Create explicitly formatted paths array
    const paths = [];
    
    // Use traditional for loop instead of map to avoid any issues
    for (let i = 0; i < tags.length; i++) {
      paths.push({
        params: { tag: tags[i] }
      });
    }
    
    // Sanitize the paths object before returning
    const sanitizedResult = {
      paths: sanitizeData(paths),
      fallback: false
    };
    
    console.log(`Generated ${sanitizedResult.paths.length} static paths for tags`);
    
    return sanitizedResult;
  } catch (error) {
    console.error('Error in getStaticPaths for [tag].js:', error);
    return {
      paths: [],
      fallback: false
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    console.log(`Starting getStaticProps for tag: ${JSON.stringify(params)}`);
    
    // Get the tag parameter
    const tag = params?.tag ? String(params.tag) : '';
    
    if (!tag) {
      console.warn('Empty tag parameter in getStaticProps');
      return {
        props: sanitizeData({
          tag: '',
          posts: []
        })
      };
    }
    
    // Get posts for this tag
    let rawPosts = getPostsByTag(tag);
    console.log(`Retrieved ${rawPosts ? (Array.isArray(rawPosts) ? rawPosts.length : 'non-array') : 'null'} raw posts for tag "${tag}"`);
    
    // Convert to a clean array and filter invalid posts
    const posts = ensureArray(rawPosts).filter(post => 
      post && typeof post === 'object' && post.slug
    );
    
    console.log(`Sanitized to ${posts.length} valid posts for tag "${tag}"`);
    
    // Create a clean props object with sanitized data
    const props = sanitizeData({
      tag,
      posts
    });
    
    return { props };
  } catch (error) {
    console.error(`Error in getStaticProps for tag ${JSON.stringify(params)}:`, error);
    return {
      props: sanitizeData({
        tag: params?.tag ? String(params.tag) : '',
        posts: []
      })
    };
  }
} 