import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { FadeIn } from "@/components/motion/MotionComponents";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const plainText = post.content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract text from links
    .replace(/[#*_~`>]/g, '')                // Remove common markdown chars
    .replace(/\s+/g, ' ')                    // Collapse multiple spaces
    .trim();
  const description = post.excerpt || (plainText.length > 160 ? `${plainText.substring(0, 157)}...` : plainText);

  return {
    title: `${post.title} | PureSweep Blog`,
    description,
    alternates: {
      canonical: `https://puresweep.co.nz/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://puresweep.co.nz/blog/${slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  const plainText = post.content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract text from links
    .replace(/[#*_~`>]/g, '')                // Remove common markdown chars
    .replace(/\s+/g, ' ')                    // Collapse multiple spaces
    .trim();
  const description = post.excerpt || (plainText.length > 160 ? `${plainText.substring(0, 157)}...` : plainText);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.imageUrl ? [post.imageUrl] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "PureSweep Cleaning",
      logo: {
        "@type": "ImageObject",
        url: "https://puresweep.co.nz/icon.png",
      },
    },
    description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-20 overflow-x-hidden">
        <Container className="max-w-4xl">
          <FadeIn>
            <div className="mb-10">
              <Link href="/blog" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-primary transition-colors mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Journal
              </Link>
              <h1 className="font-serif text-[38px] md:text-[50px] text-primary leading-tight font-light tracking-tight mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500 border-y border-border py-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post.publishedAt 
                      ? new Intl.DateTimeFormat('en-NZ', { dateStyle: 'long' }).format(post.publishedAt)
                      : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>
            
            {post.imageUrl && (
              <div className="mb-12 aspect-[21/9] w-full overflow-hidden bg-stone-100 rounded-sm">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  width={1200}
                  height={630}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            <div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:font-light prose-a:text-accent hover:prose-a:text-primary">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </FadeIn>
        </Container>
      </article>
    </>
  );
}
