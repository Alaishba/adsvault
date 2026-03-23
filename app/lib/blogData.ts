export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

/* Empty — all data comes from Supabase now */
export const blogArticles: BlogArticle[] = [];
