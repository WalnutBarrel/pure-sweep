"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const isPublished = formData.get("isPublished") === "on";

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
  try {
    await prisma.blogPost.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete post or already deleted:", error);
  }
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
