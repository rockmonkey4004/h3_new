import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';

// Path to our content
const postsDirectory = path.join(process.cwd(), '_posts');
const pagesDirectory = path.join(process.cwd(), 'src/content/pages');

/**
 * Get all post slugs
 */
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, '')
      }
    };
  });
}

/**
 * Get post data by slug
 */
export function getPostBySlug(slug) {
  try {
    // Ensure slug is a string
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid slug provided');
    }
    
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    if (!fileContents) {
      throw new Error(`Empty file contents for ${fullPath}`);
    }
    
    const { data, content } = matter(fileContents);

    // Parse Jekyll date format from slug (e.g., 2021-03-12-title)
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : data.date || '';
    
    // Format the date
    let formattedDate = '';
    if (date) {
      try {
        formattedDate = format(new Date(date), 'MMMM d, yyyy');
      } catch (e) {
        console.error(`Error formatting date ${date}:`, e);
        formattedDate = date; // Fallback to original date string
      }
    }

    return {
      slug,
      frontmatter: {
        ...data,
        date: formattedDate
      },
      content
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    // Return a minimal valid post object rather than throwing
    return {
      slug,
      frontmatter: {
        title: `Error loading post: ${slug}`,
        date: '',
      },
      content: ''
    };
  }
}

/**
 * Get all posts with frontmatter
 */
export function getAllPosts() {
  try {
    // Get all post files
    const fileNames = fs.readdirSync(postsDirectory);
    
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      return [];
    }
    
    const allPostsData = fileNames.map(fileName => {
      try {
        const slug = fileName.replace(/\.md$/, '');
        return getPostBySlug(slug);
      } catch (err) {
        console.error(`Error processing post ${fileName}:`, err);
        return null;
      }
    }).filter(Boolean); // Remove any null posts

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (!a || !a.frontmatter || !a.frontmatter.date) return 1;
      if (!b || !b.frontmatter || !b.frontmatter.date) return -1;
      
      if (a.frontmatter.date < b.frontmatter.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error getting all posts:', error);
    return []; // Return empty array on error
  }
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag) {
  try {
    // Ensure tag is a valid string
    if (!tag || typeof tag !== 'string') {
      return [];
    }
    
    const allPosts = getAllPosts();
    
    // Ensure allPosts is an array
    const postsArray = Array.isArray(allPosts) ? allPosts : [];
    
    return postsArray.filter(post => {
      // Skip invalid posts
      if (!post || !post.frontmatter) return false;
      
      const tags = post.frontmatter.tags || [];
      
      // Handle both array and string formats for tags
      if (Array.isArray(tags)) {
        return tags.some(t => t && typeof t === 'string' && t === tag);
      } else if (typeof tags === 'string') {
        return tags === tag;
      }
      return false;
    });
  } catch (error) {
    console.error(`Error getting posts by tag ${tag}:`, error);
    return []; // Return empty array on error
  }
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  try {
    const allPosts = getAllPosts();
    
    // Ensure allPosts is an array
    const postsArray = Array.isArray(allPosts) ? allPosts : [];
    
    // Use a standard array instead of a Set for cleaner serialization
    const uniqueTags = [];

    postsArray.forEach(post => {
      if (!post || !post.frontmatter) return;
      
      const tags = post.frontmatter.tags || [];
      
      // Handle both array and string formats for tags
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          if (tag && typeof tag === 'string' && !uniqueTags.includes(tag)) {
            uniqueTags.push(tag);
          }
        });
      } else if (typeof tags === 'string' && tags.trim() !== '') {
        // If tags is a non-empty string, add it directly if not already included
        if (!uniqueTags.includes(tags)) {
          uniqueTags.push(tags);
        }
      }
    });

    // Return a clean array of strings only
    return uniqueTags;
  } catch (error) {
    console.error('Error getting all tags:', error);
    return []; // Return empty array on error
  }
}

/**
 * Get a specific page by slug
 */
export function getPageBySlug(slug) {
  const fullPath = path.join(pagesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content
  };
} 