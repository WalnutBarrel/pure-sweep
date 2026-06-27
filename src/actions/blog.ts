"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth-utils";
import { adminBlogSchema } from "@/schemas";

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const parsed = adminBlogSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl"),
    isPublished: formData.get("isPublished") === "on",
  });
  const { title, excerpt, content, isPublished } = parsed;
  let { slug } = parsed;
  const imageUrl = parsed.imageUrl && parsed.imageUrl !== "" ? parsed.imageUrl : null;

  // Ensure slug uniqueness to prevent crashes on double-clicks or reused slugs
  const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
  if (existingPost) {
    slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
  }

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      imageUrl: imageUrl || null,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  try {
    await prisma.blogPost.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete post or already deleted:", error);
  }
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = adminBlogSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl"),
    isPublished: formData.get("isPublished") === "on",
  });
  const { title, excerpt, content, isPublished } = parsed;
  let { slug } = parsed;
  const imageUrl = parsed.imageUrl && parsed.imageUrl !== "" ? parsed.imageUrl : null;

  const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
  if (existingPost && existingPost.id !== id) {
    slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
  }

  const currentPost = await prisma.blogPost.findUnique({ where: { id } });
  
  let publishedAt = currentPost?.publishedAt;
  if (isPublished && !currentPost?.isPublished) {
    publishedAt = new Date();
  } else if (!isPublished) {
    publishedAt = null;
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      imageUrl: imageUrl || null,
      isPublished,
      publishedAt,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

