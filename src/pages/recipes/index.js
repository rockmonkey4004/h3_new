import Head from 'next/head';
import { useState } from 'react';
import PostCard from '../../components/blog/PostCard';
import { getAllPosts } from '../../lib/mdx';

export default function RecipesPage({ posts }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter posts based on search term
  const filteredPosts = posts.filter(post => {
    const { title, description, tags } = post.frontmatter;
    const searchContent = `${title} ${description} ${tags?.join(' ') || ''}`.toLowerCase();
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
  const posts = getAllPosts().filter(post => {
    // Only get posts that are recipes (you might want to adjust this logic based on your content)
    const categories = post.frontmatter.categories || [];
    const tags = post.frontmatter.tags || [];
    return categories.includes('recipe') || categories.includes('recipes') || 
           tags.includes('recipes') || tags.includes('paleo') || 
           post.frontmatter.title?.toLowerCase().includes('recipe');
  });

  return {
    props: {
      posts,
    },
  };
} 