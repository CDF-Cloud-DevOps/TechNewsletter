export interface SubstackPost {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  publishedAt: string;
  author: string;
  publicationName: string;
  likes: number;
  comments: number;
}

export interface ProcessedSubstackPost extends SubstackPost {
  category: Category;
}

export type Category = 
  | 'AI/ML Developments'
  | 'Programming & Software Engineering'
  | 'Business Technology'
  | 'Industry News'
  | 'Tools & Resources';
