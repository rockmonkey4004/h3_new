import Head from 'next/head';
import { useState } from 'react';
import PostCard from '../../components/blog/PostCard';
import { getAllPosts } from '../../lib/mdx';

export default function RecipesPage({ posts = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ensure posts is an array before filtering
  const postsArray = Array.isArray(posts) ? posts : [];
  
  // Filter posts based on search term
  const filteredPosts = postsArray.filter(post => {
    const { title = '', description = '', tags } = post.frontmatter || {};
    
    // Handle tags that might be a string or an array
    let tagsString = '';
    if (Array.isArray(tags)) {
      tagsString = tags.join(' ');
    } else if (typeof tags === 'string') {
      tagsString = tags;
    }
    
    const searchContent = `${title} ${description} ${tagsString}`.toLowerCase();
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
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
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
  const allPosts = getAllPosts();
  
  // Ensure allPosts is an array
  const postsArray = Array.isArray(allPosts) ? allPosts : [];
  
  const posts = postsArray.filter(post => {
    if (!post || !post.frontmatter) return false;
    
    // Handle categories that might be strings or arrays
    const categories = post.frontmatter.categories || [];
    const categoriesArray = Array.isArray(categories) ? categories : 
                           (typeof categories === 'string' ? [categories] : []);
    
    // Handle tags that might be strings or arrays
    const tags = post.frontmatter.tags || [];
    const tagsArray = Array.isArray(tags) ? tags : 
                     (typeof tags === 'string' ? [tags] : []);
    
    const title = post.frontmatter.title || '';
    
    return categoriesArray.includes('recipe') || categoriesArray.includes('recipes') || 
           tagsArray.includes('recipes') || tagsArray.includes('paleo') || 
           title.toLowerCase().includes('recipe');
  });

  return {
    props: {
      posts,
    },
  };
} 