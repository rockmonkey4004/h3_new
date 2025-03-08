import Head from 'next/head';
import { useState, useEffect } from 'react';
import PostCard from '../../components/blog/PostCard';
import { getAllPosts } from '../../lib/mdx';

// Component with client-side data loading
export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load data client-side
  useEffect(() => {
    const loadRecipes = () => {
      try {
        // Get all posts
        const allPosts = getAllPosts();
        if (!Array.isArray(allPosts)) {
          setPosts([]);
          setLoading(false);
          return;
        }
        
        // Filter for recipe posts
        const recipes = allPosts.filter(post => {
          if (!post || !post.frontmatter) return false;
          
          // Simple check for recipe-related content
          return (
            (post.frontmatter.categories && String(post.frontmatter.categories).includes('recipe')) ||
            (post.frontmatter.tags && String(post.frontmatter.tags).includes('recipe')) ||
            (post.frontmatter.tags && String(post.frontmatter.tags).includes('paleo')) ||
            (post.frontmatter.title && post.frontmatter.title.toLowerCase().includes('recipe'))
          );
        });
        
        setPosts(recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipes();
  }, []);
  
  // Filter posts based on search term
  const filteredPosts = posts.filter(post => {
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
  
  // Show loading state
  if (loading) {
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Loading Recipes...</h1>
        <p>Finding the perfect recipes for you</p>
      </div>
    );
  }

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