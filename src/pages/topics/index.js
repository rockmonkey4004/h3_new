import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPosts } from '../../lib/mdx';

// Component with client-side data loading
export default function TopicsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load data client-side
  useEffect(() => {
    const loadTags = () => {
      try {
        // Get all posts
        const allPosts = getAllPosts();
        if (!Array.isArray(allPosts)) {
          setTags([]);
          setLoading(false);
          return;
        }
        
        // Extract tags manually
        const tagsSet = new Set();
        
        allPosts.forEach(post => {
          if (post && post.frontmatter && post.frontmatter.tags) {
            if (Array.isArray(post.frontmatter.tags)) {
              post.frontmatter.tags.forEach(tag => {
                if (tag && typeof tag === 'string' && tag.trim() !== '') {
                  tagsSet.add(tag.trim());
                }
              });
            } else if (typeof post.frontmatter.tags === 'string' && post.frontmatter.tags.trim() !== '') {
              tagsSet.add(post.frontmatter.tags.trim());
            }
          }
        });
        
        // Convert to array and sort
        const tagsList = Array.from(tagsSet).sort();
        setTags(tagsList);
      } catch (error) {
        console.error('Error loading tags:', error);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTags();
  }, []);
  
  // Show loading state
  if (loading) {
    return (
      <div className="container-narrow py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Loading Topics...</h1>
        <p>Organizing all available topics</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Topics | Health, Healing, and Hope</title>
        <meta name="description" content="Browse all topics on Health, Healing, and Hope - paleo, gluten-free, wellness tips, and more." />
      </Head>

      <div className="container-narrow py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Topics</h1>
        
        <p className="text-lg text-gray-600 mb-12 text-center">
          Browse all topics to find exactly what you're looking for
        </p>
        
        {tags.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags.map((tag, index) => (
              <Link
                key={index}
                href={`/topics/${tag}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <span className="text-lg font-medium text-accent-dark">{tag}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No topics found</h2>
            <p className="text-gray-600">
              Check back later for topics!
            </p>
          </div>
        )}
      </div>
    </>
  );
} 