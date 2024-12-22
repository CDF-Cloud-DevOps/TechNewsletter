import { RedditPost, ProcessedPost, Category } from '../types/reddit';

const categoryKeywords = {
  'AI/ML Developments': [
    'ai', 'ml', 'machine learning', 'artificial intelligence', 'deep learning',
    'chatgpt', 'claude', 'gemini', 'llm', 'gpt', 'neural network',
    'transformer', 'openai', 'anthropic', 'stable diffusion', 'midjourney',
    'mlops', 'model', 'training', 'inference', 'prompt engineering'
  ],
  'Programming & Software Engineering': [
    'programming', 'software', 'code', 'development', 'engineering',
    'api', 'framework', 'library', 'backend', 'frontend', 'fullstack',
    'database', 'architecture', 'design pattern', 'algorithm', 'performance',
    'optimization', 'testing', 'deployment', 'ci/cd', 'version control',
    'git', 'docker', 'kubernetes', 'microservices', 'serverless',
    'typescript', 'javascript', 'python', 'java', 'golang', 'rust'
  ],
  'Business Technology': [
    'business', 'enterprise', 'startup', 'company', 'industry',
    'saas', 'cloud', 'aws', 'azure', 'gcp', 'digital transformation',
    'automation', 'productivity', 'collaboration', 'remote work',
    'security', 'compliance', 'regulation', 'investment', 'acquisition',
    'partnership', 'market', 'strategy', 'innovation'
  ],
  'Industry News': [
    'announces', 'launches', 'releases', 'update', 'news',
    'report', 'study', 'research', 'breakthrough', 'discovery',
    'trend', 'analysis', 'forecast', 'prediction', 'impact',
    'change', 'future', 'development', 'standard', 'regulation'
  ],
  'Tools & Resources': [
    'tool', 'library', 'framework', 'resource', 'guide',
    'tutorial', 'documentation', 'best practice', 'example',
    'template', 'boilerplate', 'starter', 'kit', 'sdk',
    'api', 'service', 'platform', 'solution', 'utility'
  ]
};

export function categorizePost(post: RedditPost): Category {
  const content = `${post.title} ${post.selftext}`.toLowerCase();
  const subreddit = post.subreddit.toLowerCase();
  let maxScore = 0;
  let bestCategory: Category = 'Industry News'; // default category

  // Score each category based on keyword matches and subreddit context
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    
    // Check for keyword matches
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = (content.match(regex) || []).length;
      score += matches;
    });
    
    // Add weight based on subreddit
    if (category === 'AI/ML Developments' && 
        /ai|ml|chatgpt|claude|gemini|learning/i.test(subreddit)) {
      score += 5;
    } else if (category === 'Programming & Software Engineering' && 
               /programming|coding|developer|webdev/i.test(subreddit)) {
      score += 5;
    } else if (category === 'Tools & Resources' && 
               /github|tool|resource/i.test(post.domain)) {
      score += 3;
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category as Category;
    }
  }

  return bestCategory;
}

export function generateTags(post: RedditPost): string[] {
  const content = `${post.title} ${post.selftext}`.toLowerCase();
  const tags = new Set<string>();
  
  // Add subreddit as a tag
  tags.add(post.subreddit.toLowerCase());
  
  // Add domain as a tag (if it's not a common domain)
  const domain = post.domain.replace(/^www\.|\.com$/g, '');
  if (!/reddit|imgur|youtube/i.test(domain)) {
    tags.add(domain);
  }
  
  // Add technology-specific tags
  const techKeywords = [
    'python', 'javascript', 'typescript', 'java', 'golang', 'rust',
    'react', 'vue', 'angular', 'node', 'django', 'flask',
    'aws', 'azure', 'gcp', 'kubernetes', 'docker',
    'ai', 'ml', 'chatgpt', 'llm', 'deep learning'
  ];
  
  techKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      tags.add(keyword);
    }
  });

  return Array.from(tags)
    .filter(tag => tag.length >= 2) // Remove single-character tags
    .slice(0, 5); // Limit to 5 tags
}

export function generateSummary(post: RedditPost): string {
  const content = post.selftext || post.title;
  
  // If content is short enough, use it as is
  if (content.length <= 200) {
    return content;
  }
  
  // Otherwise, create a summary
  const sentences = content
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .filter(s => s.length > 20); // Filter out very short sentences
    
  const firstSentences = sentences.slice(0, 2).join(' ');
  return firstSentences.length > 200 
    ? `${firstSentences.substring(0, 197)}...`
    : firstSentences;
}

export function processPost(post: RedditPost): ProcessedPost {
  return {
    ...post,
    category: categorizePost(post),
    tags: generateTags(post),
    summary: generateSummary(post)
  };
}