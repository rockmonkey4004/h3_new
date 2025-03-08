import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '../../lib/mdx';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';

// Components to use in MDX
const components = {
  h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
  h3: (props) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
  p: (props) => <p className="mb-4" {...props} />,
  ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  a: (props) => <a className="text-accent hover:text-accent-dark" {...props} />,
  img: (props) => (
    <div className="my-6">
      <img className="rounded-lg mx-auto" {...props} />
    </div>
  ),
};

export default function PostPage({ post, mdxSource }) {
  const { frontmatter } = post;
  const { title, description, date, featured_image, alt, tags } = frontmatter;

  const featuredImage = featured_image 
    ? `https://res.cloudinary.com/rockmonkey/image/upload/${featured_image}`
    : 'https://res.cloudinary.com/rockmonkey/image/upload/v1587782937/Blog/Burger-Up-Salad_w1gncd.jpg';

  const imageAlt = alt || title;

  return (
    <>
      <Head>
        <title>{title} | Health, Healing, and Hope</title>
        <meta name="description" content={description || `Read about ${title} on Health, Healing, and Hope`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={featuredImage} />
      </Head>

      <article className="container-narrow py-12">
        <header className="mb-8">
          <div className="text-sm text-gray-500 mb-2">{date}</div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-gray-600 mb-6">{description}</p>
          )}
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/topics/${tag}`}
                  className="inline-block px-3 py-1 text-sm bg-accent-light text-accent-dark rounded hover:bg-accent hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <div className="relative aspect-video w-full max-h-96 mb-8">
            <Image
              src={featuredImage}
              alt={imageAlt}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              priority
            />
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <MDXRemote {...mdxSource} components={components} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/recipes" className="text-accent hover:text-accent-dark">
            ← Back to Recipes
          </Link>
        </div>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  
  // Use next-mdx-remote to process the MDX content
  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        [rehypeHighlight, { ignoreMissing: true }],
      ],
    },
  });

  return {
    props: {
      post,
      mdxSource,
    },
  };
} 