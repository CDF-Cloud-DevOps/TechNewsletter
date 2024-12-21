import { RedditPost } from '../types/reddit';

const SUBREDDITS = [
  'artificial',
  'technology',
  'programming',
  'coding',
  'softwareengineering',
  'MachineLearning',
  'ChatGPTPromptGenius',
  'ChatGPTCoding',
  'AZURE',
  'ChatGPT',
  'ClaudeAI',
  'OpenAI',
  'GeminiAI',
  'GoogleGeminiAI'
];

const MIN_UPVOTES = 1000;
const POSTS_PER_SUBREDDIT = 100;

export async function fetchSubredditPosts(subreddit: string): Promise<RedditPost[]> {
  const timestamp24HoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
  const url = `https://www.reddit.com/r/${subreddit}/top.json?limit=${POSTS_PER_SUBREDDIT}&t=day`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    return data.data.children
      .map((child: any) => child.data)
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

function isQualityContent(post: RedditPost): boolean {
  const lowQualityDomains = ['i.redd.it', 'i.imgur.com', 'youtube.com', 'youtu.be'];
  const lowQualityKeywords = ['meme', 'funny', 'joke', '[meme]', '[humor]'];

  return !lowQualityDomains.includes(post.domain) &&
    !lowQualityKeywords.some(keyword => 
      post.title.toLowerCase().includes(keyword) || 
      post.selftext.toLowerCase().includes(keyword)
    );
}

export async function fetchAllPosts(): Promise<RedditPost[]> {
  const allPosts = await Promise.all(
    SUBREDDITS.map(subreddit => fetchSubredditPosts(subreddit))
  );
  
  return allPosts.flat();
}