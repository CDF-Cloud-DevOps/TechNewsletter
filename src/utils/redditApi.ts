import { RedditPost } from '../types/reddit';

const SUBREDDITS = [
  // AI & ML
  'artificial',
  'MachineLearning',
  'ChatGPT',
  'OpenAI',
  'ClaudeAI',
  'GeminiAI',
  'GoogleGeminiAI',
  'MLOps',
  'learnmachinelearning',
  'deeplearning',
  
  // Software Engineering
  'programming',
  'coding',
  'softwareengineering',
  'webdev',
  'devops',
  'aws',
  'AZURE',
  'golang',
  'rust',
  'typescript',
  'node',
  'python',
  'java',
  'dotnet',
  'kubernetes',
  'docker',
  
  // Tech Industry
  'technology',
  'tech',
  'cscareerquestions',
  'programming_discussions',
  'compsci',
  'cybersecurity',
  'netsec',
  'datascience',
  'database',
  'cloud',
  'systemdesign'
];

const MIN_UPVOTES = 1000;
const POSTS_PER_SUBREDDIT = 100;

const LOW_QUALITY_DOMAINS = [
  'i.redd.it',
  'i.imgur.com',
  'youtube.com',
  'youtu.be',
  'gfycat.com',
  'v.redd.it',
  'reddit.com/gallery',
  'tenor.com'
];

const LOW_QUALITY_KEYWORDS = [
  'meme',
  'funny',
  'joke',
  '[meme]',
  '[humor]',
  'lol',
  'showerthought',
  'eli5',
  'starter pack',
  'starterpack'
];

function isQualityContent(post: RedditPost): boolean {
  const titleAndText = `${post.title} ${post.selftext}`.toLowerCase();
  
  // Check for low quality indicators
  if (LOW_QUALITY_DOMAINS.includes(post.domain)) return false;
  if (LOW_QUALITY_KEYWORDS.some(keyword => titleAndText.includes(keyword))) return false;
  
  // Check for technical indicators
  const hasTechnicalContent = post.title.length > 30 || // Detailed titles
    post.selftext.length > 100 || // Substantial text content
    post.domain.includes('github.com') || // Code repositories
    post.domain.includes('arxiv.org') || // Research papers
    /\.(pdf|md|py|js|ts|java|go|rs|cs|cpp|h)$/i.test(post.url); // Technical files
    
  return hasTechnicalContent;
}

export async function fetchSubredditPosts(subreddit: string): Promise<RedditPost[]> {
  const timestamp24HoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
  const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=${POSTS_PER_SUBREDDIT}&t=day`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    // Add error handling for rate limiting
    if (data.error === 429) {
      console.warn(`Rate limited when fetching from r/${subreddit}. Waiting before retry...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchSubredditPosts(subreddit);
    }

    return data.data.children
      .map((child: any) => ({
        ...child.data,
        subreddit: child.data.subreddit, // Ensure subreddit is included
        domain: child.data.domain || '', // Ensure domain exists
        created_utc: child.data.created_utc || 0 // Ensure timestamp exists
      }))
      .filter((post: RedditPost) => 
        post.score >= MIN_UPVOTES &&
        post.created_utc >= timestamp24HoursAgo &&
        isQualityContent(post)
      );
  } catch (error) {
    console.error(`Error fetching posts from r/${subreddit}:`, error);
    return [];
  }
}

export async function fetchAllPosts(): Promise<RedditPost[]> {
  // Fetch in batches to avoid overwhelming Reddit's API
  const batchSize = 5;
  const allPosts: RedditPost[] = [];
  
  for (let i = 0; i < SUBREDDITS.length; i += batchSize) {
    const batch = SUBREDDITS.slice(i, i + batchSize);
    const batchPosts = await Promise.all(
      batch.map(subreddit => fetchSubredditPosts(subreddit))
    );
    allPosts.push(...batchPosts.flat());
    
    // Add a small delay between batches
    if (i + batchSize < SUBREDDITS.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return allPosts;
}