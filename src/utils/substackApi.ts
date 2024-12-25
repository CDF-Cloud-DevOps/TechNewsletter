import { SubstackPost } from '../types/substack';

const PUBLICATIONS = [
  // AI & ML
  'artificialintelligenceweekly',
  'machinelearnings',
  'thesequence',
  'aiweekly',
  
  // Software Engineering
  'bytes',
  'programming-digest',
  'levelup',
  'devops-weekly',
  'softwareleadweekly',
  
  // Tech Industry
  'platformer',
  'stratechery',
  'theverge',
  'techmeme',
  
  // Cloud & Infrastructure
  'cloudweekly',
  'devopsish',
  'lastweekinkubernetes',
  
  // Data Science
  'dataelixir',
  'datascience-weekly'
];

const MIN_LIKES = 50;
const POSTS_PER_PUBLICATION = 10;

const isQualityContent = (post: SubstackPost): boolean => {
  // Filter criteria for quality posts
  if (!post.title || !post.url) return false;
  if (post.likes < MIN_LIKES) return false;
  
  // Exclude promotional or sponsored content
  const lowerTitle = post.title.toLowerCase();
  if (
    lowerTitle.includes('sponsored') ||
    lowerTitle.includes('promotion') ||
    lowerTitle.includes('advertisement')
  ) {
    return false;
  }
  
  return true;
};

const fetchPublicationPosts = async (publication: string): Promise<SubstackPost[]> => {
  try {
    const response = await fetch(
      `https://api.substack.com/api/v1/publication/${publication}/posts?limit=${POSTS_PER_PUBLICATION}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts from ${publication}`);
    }
    
    const posts = await response.json();
    return posts
      .filter(isQualityContent)
      .map((post: any) => ({
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        description: post.description,
        url: post.canonical_url,
        publishedAt: post.published_at,
        author: post.author?.name || 'Unknown',
        publicationName: post.publication?.name || publication,
        likes: post.likes || 0,
        comments: post.comment_count || 0
      }));
  } catch (error) {
    console.error(`Error fetching posts from ${publication}:`, error);
    return [];
  }
};

const fetchAllPosts = async (): Promise<SubstackPost[]> => {
  try {
    const allPosts = await Promise.all(
      PUBLICATIONS.map(pub => fetchPublicationPosts(pub))
    );
    
    return allPosts
      .flat()
      .sort((a, b) => b.likes - a.likes);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

export { fetchAllPosts, fetchPublicationPosts };
