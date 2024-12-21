import { RedditPost, ProcessedPost, Category } from '../types/reddit';

const categoryKeywords = {
  'AI/ML Developments': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'chatgpt', 'claude', 'gemini'],
  'Programming & Software Engineering': ['programming', 'software', 'code', 'development', 'engineering'],
  'Business Technology': ['business', 'enterprise', 'startup', 'company', 'industry'],
  'Industry News': ['announces', 'launches', 'releases', 'update', 'news'],
  'Tools & Resources': ['tool', 'library', 'framework', 'resource', 'guide']
};

export function categorizePost(post: RedditPost): Category {
  const content = `${post.title} ${post.selftext}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category as Category;
    }
  }
  
  return 'Industry News';
}

export function generateTags(post: RedditPost): string[] {
  const content = `${post.title} ${post.selftext}`.toLowerCase();
  const tags = new Set<string>();

  Object.entries(categoryKeywords).forEach(([_, keywords]) => {
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        tags.add(keyword);
      }
    });
  });

  return Array.from(tags).slice(0, 5);
}

export function generateSummary(post: RedditPost): string {
  // For now, return a truncated version of the title or selftext
  // In a production environment, you might want to use an AI service for better summarization
  const content = post.selftext || post.title;
  return content.length > 200 ? `${content.substring(0, 197)}...` : content;
}

export function processPost(post: RedditPost): ProcessedPost {
  return {
    ...post,
    category: categorizePost(post),
    tags: generateTags(post),
    summary: generateSummary(post)
  };
}