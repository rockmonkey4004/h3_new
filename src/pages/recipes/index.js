import Head from 'next/head';
import { useState } from 'react';
import PostCard from '../../components/blog/PostCard';
import { getAllPosts } from '../../lib/mdx';

// Simple component with minimal complexity
export default function RecipesPage({ posts }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ensure posts is an array
  const postsArray = Array.isArray(posts) ? posts : [];
  
  // Basic filter implementation
  const filteredPosts = postsArray.filter(post => {
    if (!post || !post.frontmatter) return false;
    
    const title = post.frontmatter.title || '';
    const description = post.frontmatter.description || '';
    
    // Simple tag handling
    let tagString = '';
    if (Array.isArray(post.frontmatter.tags)) {
      tagString = post.frontmatter.tags.join(' ');
    } else if (typeof post.frontmatter.tags === 'string') {
      tagString = post.frontmatter.tags;
    }
    
    const searchContent = `${title} ${description} ${tagString}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Head>
        <title>Recipes | Health, Healing, and Hope</title>
        <meta name="description" content="Discover paleo, gluten-free, refined sugar-free, and egg-free recipes for your health journey." />
      </Head>

      <div className="container-narrow py-12">
        <div className="text-center mb-12">
          <h1 className="mb-4">Recipes</h1>
          <p className="text-xl text-gray-600">
            Discover paleo, gluten-free, refined sugar-free, and egg-free recipes
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No recipes found</h2>
            <p className="text-gray-600">
              Try adjusting your search or check back later for new recipes!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// Simple implementation with minimal data processing
export async function getStaticProps() {
  try {
    const allPosts = getAllPosts();
    
    // Ensure it's an array
    const postsArray = Array.isArray(allPosts) ? allPosts : [];
    
    // Filter for recipe posts with minimal processing
    const recipePosts = [];
    
    for (let i = 0; i < postsArray.length; i++) {
      const post = postsArray[i];
      if (!post || !post.frontmatter) continue;
      
      // Simple check for recipe-related content
      const isRecipe = 
        (post.frontmatter.categories && String(post.frontmatter.categories).includes('recipe')) ||
        (post.frontmatter.tags && String(post.frontmatter.tags).includes('recipe')) ||
        (post.frontmatter.tags && String(post.frontmatter.tags).includes('paleo')) ||
        (post.frontmatter.title && post.frontmatter.title.toLowerCase().includes('recipe'));
      
      if (isRecipe) {
        // Create a simple clean object
        recipePosts.push({
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
        posts: recipePosts
      }
    };
  } catch (error) {
    console.error("Error in recipes getStaticProps:", error);
    return {
      props: {
        posts: []
      }
    };
  }
} 