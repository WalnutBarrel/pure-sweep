import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";
import { AUCKLAND_LOCATIONS } from "@/lib/locations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://puresweep.co.nz";
  
  let blogUrls: MetadataRoute.Sitemap = [];
  let serviceUrls: MetadataRoute.Sitemap = [];

  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.warn("Could not fetch blog posts for sitemap", e);
  }

  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    serviceUrls = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.warn("Could not fetch services for sitemap", e);
  }

  const locationUrls: MetadataRoute.Sitemap = AUCKLAND_LOCATIONS.map((loc) => ({
    url: `${baseUrl}/locations/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/book-a-cleaning`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...locationUrls,
    ...blogUrls,
    ...serviceUrls,
  ];
}
