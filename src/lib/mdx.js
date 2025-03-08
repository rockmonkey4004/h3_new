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
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Parse Jekyll date format from slug (e.g., 2021-03-12-title)
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : data.date || '';
  
  // Format the date
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : '';

  return {
    slug,
    frontmatter: {
      ...data,
      date: formattedDate
    },
    content
  };
}

/**
 * Get all posts with frontmatter
 */
export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    return getPostBySlug(slug);
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag) {
  const allPosts = getAllPosts();
  return allPosts.filter(post => {
    const tags = post.frontmatter.tags || [];
    
    // Handle both array and string formats for tags
    if (Array.isArray(tags)) {
      return tags.includes(tag);
    } else if (typeof tags === 'string') {
      return tags === tag;
    }
    return false;
  });
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  const allPosts = getAllPosts();
  const tagSet = new Set();

  allPosts.forEach(post => {
    const tags = post.frontmatter.tags || [];
    
    // Handle both array and string formats for tags
    if (Array.isArray(tags)) {
      tags.forEach(tag => tagSet.add(tag));
    } else if (typeof tags === 'string') {
      // If tags is a string, add it directly
      tagSet.add(tags);
    }
  });

  return Array.from(tagSet);
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