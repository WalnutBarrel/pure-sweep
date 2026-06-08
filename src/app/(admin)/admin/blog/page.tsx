import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/actions/blog";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b">
              <th className="p-4 font-medium text-sm text-stone-500">Title</th>
              <th className="p-4 font-medium text-sm text-stone-500">Status</th>
              <th className="p-4 font-medium text-sm text-stone-500">Date</th>
              <th className="p-4 font-medium text-sm text-stone-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-500">
                  No blog posts found. Create your first one to boost SEO!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b last:border-0 hover:bg-stone-50">
                  <td className="p-4">
                    <div className="font-medium text-primary">{post.title}</div>
                    <div className="text-xs text-stone-500">{post.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-stone-600">
                    {new Intl.DateTimeFormat('en-NZ').format(post.createdAt)}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/blog/${post.id}/edit`} className="inline-block p-2 text-stone-500 hover:bg-stone-100 rounded" title="Edit">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteBlogPost(post.id);
                    }} className="inline-block">
                      <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
