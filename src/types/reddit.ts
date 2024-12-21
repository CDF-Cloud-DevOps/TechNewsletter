export interface RedditPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  score: number;
  num_comments: number;
  created_utc: number;
  domain: string;
  selftext: string;
  author: string;
}

export interface ProcessedPost extends RedditPost {
  summary: string;
  category: Category;
  tags: string[];
}

export type Category = 
  | 'AI/ML Developments'
  | 'Programming & Software Engineering'
  | 'Business Technology'
  | 'Industry News'
  | 'Tools & Resources';