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

const fetchSubredditPosts = async (subreddit: string): Promise<RedditPost[]> => {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/top.json?limit=${POSTS_PER_SUBREDDIT}&t=day`
    );
    
    if (!response.ok) {
      console.warn(`Skipping subreddit ${subreddit} due to ${response.status} error`);
      return [];
    }
    
    const data = await response.json();
    return data.data.children
      .map((child: any) => child.data)
      .filter(isQualityContent);
  } catch (error) {
    console.error(`Error fetching posts from r/${subreddit}:`, error);
    return [];
  }
};

const fetchAllPosts = async (): Promise<RedditPost[]> => {
  try {
    const allPostsPromises = SUBREDDITS.map(subreddit => fetchSubredditPosts(subreddit));
    const allPosts = await Promise.all(allPostsPromises);
    
    return allPosts
      .flat()
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

export { fetchAllPosts, fetchSubredditPosts };