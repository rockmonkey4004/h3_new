import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import { sanitizeData, ensureArray } from './utils';

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
    console.log(`Starting getPostsByTag for tag: "${tag}"`);
    
    // Ensure tag is a valid string
    if (!tag || typeof tag !== 'string') {
      console.warn('Invalid tag provided to getPostsByTag');
      return [];
    }
    
    // Get all posts
    const allPosts = getAllPosts();
    
    // Ensure posts is an array
    const postsArray = ensureArray(allPosts);
    console.log(`Processing ${postsArray.length} posts to find tag: "${tag}"`);
    
    // Match posts with the given tag
    const result = [];
    
    // Use traditional for loop for maximum compatibility
    for (let i = 0; i < postsArray.length; i++) {
      const post = postsArray[i];
      
      // Skip invalid posts
      if (!post || !post.frontmatter) {
        continue;
      }
      
      const postTags = post.frontmatter.tags;
      let matchFound = false;
      
      // Check array of tags
      if (Array.isArray(postTags)) {
        for (let j = 0; j < postTags.length; j++) {
          if (postTags[j] === tag) {
            matchFound = true;
            break;
          }
        }
      } 
      // Check string tag
      else if (typeof postTags === 'string' && postTags === tag) {
        matchFound = true;
      }
      
      if (matchFound) {
        result.push(sanitizeData(post));
      }
    }
    
    console.log(`Found ${result.length} posts with tag: "${tag}"`);
    return result;
  } catch (error) {
    console.error(`Error in getPostsByTag for tag "${tag}":`, error);
    return [];
  }
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  try {
    console.log("Starting getAllTags function");
    
    // Get all posts
    const allPosts = getAllPosts();
    console.log(`Retrieved ${allPosts ? (Array.isArray(allPosts) ? allPosts.length : 'non-array') : 'null'} posts in getAllTags`);
    
    // Ensure it's an array
    const postsArray = ensureArray(allPosts);
    
    // Standard array to collect tags
    const allTagsList = [];
    
    // Collect all tags from posts
    for (let i = 0; i < postsArray.length; i++) {
      const post = postsArray[i];
      if (!post || !post.frontmatter) continue;
      
      const tags = post.frontmatter.tags;
      
      // Handle tags as array
      if (Array.isArray(tags)) {
        for (let j = 0; j < tags.length; j++) {
          const tag = tags[j];
          if (tag && typeof tag === 'string' && tag.trim() !== '') {
            allTagsList.push(tag.trim());
          }
        }
      } 
      // Handle tags as string
      else if (tags && typeof tags === 'string' && tags.trim() !== '') {
        allTagsList.push(tags.trim());
      }
    }
    
    // Create a unique array of tags
    const uniqueTags = [...new Set(allTagsList)];
    console.log(`Found ${uniqueTags.length} unique tags`);
    
    // Return sanitized data
    return sanitizeData(uniqueTags);
  } catch (error) {
    console.error('Error in getAllTags:', error);
    return [];
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