import Link from 'next/link';
import Image from 'next/image';

export default function PostCard({ post }) {
  const { slug, frontmatter } = post;
  const { title, date, description, featured_image, alt, tags } = frontmatter;
  
  const featuredImage = featured_image 
    ? `https://res.cloudinary.com/rockmonkey/image/upload/${featured_image}`
    : 'https://res.cloudinary.com/rockmonkey/image/upload/v1587782937/Blog/Burger-Up-Salad_w1gncd.jpg';
  
  const imageAlt = alt || title;

  return (
    <article className="recipe-card">
      <Link href={`/posts/${slug}`} className="block">
        <div className="relative aspect-video w-full">
          <Image
            src={featuredImage}
            alt={imageAlt}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <div className="mb-2 text-sm text-gray-500">{date}</div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h2>
          {description && (
            <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
          )}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-block px-2 py-1 text-xs bg-accent-light text-accent-dark rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
} 