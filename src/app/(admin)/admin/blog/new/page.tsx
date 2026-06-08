import { createBlogPost } from "@/actions/blog";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-stone-500 hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Create New Blog Post</h1>
      </div>

      <form action={createBlogPost} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required 
              className="w-full border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. 10 Spring Cleaning Tips"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              required 
              className="w-full border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. spring-cleaning-tips"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="block text-sm font-medium">Excerpt (SEO Description)</label>
          <textarea 
            id="excerpt" 
            name="excerpt" 
            rows={2}
            className="w-full border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none"
            placeholder="A short description for Google search results..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="block text-sm font-medium">Header Image URL (Optional)</label>
          <input 
            type="url" 
            id="imageUrl" 
            name="imageUrl" 
            className="w-full border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">Content</label>
          <textarea 
            id="content" 
            name="content" 
            required 
            rows={15}
            className="w-full border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
            placeholder="Write your article content here..."
          />
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <input type="checkbox" id="isPublished" name="isPublished" className="w-4 h-4" />
          <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/blog" className="px-4 py-2 border border-border rounded text-stone-600 hover:bg-stone-50">
            Cancel
          </Link>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90">
            <Save className="w-4 h-4" /> Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
