import Head from 'next/head';
import { useState } from 'react';
import PostCard from '../../components/blog/PostCard';
import { getAllPosts } from '../../lib/mdx';
import { sanitizeData, ensureArray } from '../../lib/utils';

export default function RecipesPage({ posts = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use safe array check with empty default
  const postsArray = Array.isArray(posts) ? posts : [];
  
  // Filter posts safely based on search term
  const filteredPosts = postsArray.filter(post => {
    if (!post || !post.frontmatter) return false;
    
    const title = post.frontmatter.title || '';
    const description = post.frontmatter.description || '';
    const tags = post.frontmatter.tags || [];
    
    // Handle different tag formats
    let tagString = '';
    if (Array.isArray(tags)) {
      tagString = tags.join(' ');
    } else if (typeof tags === 'string') {
      tagString = tags;
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
              <PostCard key={`post-${index}-${post.slug || ''}`} post={post} />
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

export async function getStaticProps() {
  try {
    console.log("Starting getStaticProps for recipes page");
    
    // Get all posts
    const allPosts = getAllPosts();
    
    // Ensure it's an array
    const postsArray = ensureArray(allPosts);
    
    // Filter for recipe posts
    const recipePosts = [];
    
    for (let i = 0; i < postsArray.length; i++) {
      const post = postsArray[i];
      if (!post || !post.frontmatter) continue;
      
      const categories = ensureArray(post.frontmatter.categories);
      const tags = ensureArray(post.frontmatter.tags);
      const title = post.frontmatter.title || '';
      
      // Check if this is a recipe post
      const isRecipe = 
        categories.includes('recipe') || 
        categories.includes('recipes') || 
        tags.includes('recipes') || 
        tags.includes('paleo') || 
        title.toLowerCase().includes('recipe');
      
      if (isRecipe) {
        recipePosts.push(sanitizeData(post));
      }
    }
    
    console.log(`Found ${recipePosts.length} recipe posts`);
    
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