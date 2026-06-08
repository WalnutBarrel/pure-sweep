import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { FadeIn, MotionSection } from "@/components/motion/MotionComponents";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Cleaning Blog & Resources | PureSweep",
  description: "Read the latest tips, tricks, and industry news from Auckland's premium cleaning team.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="space-y-24 py-20 overflow-x-hidden">
      <Container className="space-y-12">
        <SectionHeader
          subtitle="Resources"
          title="PureSweep Journal"
          description="Insights, guides, and stories from our cleaning experts."
        />

        {posts.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            <p>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <FadeIn key={post.id} delay={index * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="bg-surface border border-border h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    {post.imageUrl && (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {post.publishedAt 
                            ? new Intl.DateTimeFormat('en-NZ', { dateStyle: 'medium' }).format(post.publishedAt)
                            : "Draft"}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-primary mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-stone-600 line-clamp-3 mb-6 flex-1">
                        {post.excerpt || post.content.substring(0, 150) + "..."}
                      </p>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary self-start group-hover:text-accent group-hover:border-accent transition-colors pb-1">
                        Read Article &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
