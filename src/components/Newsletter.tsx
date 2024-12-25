import React from 'react';
import { format } from 'date-fns';
import { ProcessedPost, Category } from '../types/reddit';
import { ProcessedSubstackPost } from '../types/substack';
import { ExternalLink, ArrowUpCircle, MessageCircle } from 'lucide-react';

interface NewsletterProps {
  redditPosts: ProcessedPost[];
  substackPosts: ProcessedSubstackPost[];
}

interface PostMetricsProps {
  score: number;
  numComments: number;
  url: string;
}

const PostMetrics: React.FC<PostMetricsProps> = ({ score, numComments, url }) => (
  <div className="flex items-center gap-6 text-sm text-gray-600">
    <div className="flex items-center gap-1">
      <ArrowUpCircle size={16} />
      {score.toLocaleString()}
    </div>
    <div className="flex items-center gap-1">
      <MessageCircle size={16} />
      {numComments.toLocaleString()}
    </div>
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
    >
      <ExternalLink size={16} />
      Source
    </a>
  </div>
);

const Newsletter: React.FC<NewsletterProps> = ({ redditPosts, substackPosts }) => {
  const categories: Category[] = [
    'AI/ML Developments',
    'Programming & Software Engineering',
    'Business Technology',
    'Industry News',
    'Tools & Resources'
  ];

  const postsByCategory = categories.reduce((acc, category) => {
    // Get Reddit posts for this category
    const redditCategoryPosts = redditPosts
      .filter(post => post.category === category)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Get Substack posts for this category
    const substackCategoryPosts = substackPosts
      .filter(post => post.category === category)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);

    // Combine and sort posts
    acc[category] = [...redditCategoryPosts, ...substackCategoryPosts]
      .sort((a, b) => {
        // Normalize scores: Reddit uses upvotes, Substack uses likes
        const scoreA = 'score' in a ? a.score : a.likes * 10; // Adjust multiplier as needed
        const scoreB = 'score' in b ? b.score : b.likes * 10;
        return scoreB - scoreA;
      })
      .slice(0, 10);

    return acc;
  }, {} as Record<Category, Array<ProcessedPost | ProcessedSubstackPost>>);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Farees's Tech & AI News Digest</h1>
        <p className="text-gray-600">
          {format(new Date(), 'MMMM d, yyyy')} • Curated from Reddit's Top Tech Communities and Substack
        </p>
      </header>

      <div className="space-y-4">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
            <div className="space-y-4">
              {postsByCategory[category].map(post => {
                const isRedditPost = 'score' in post;
                return (
                  <div key={post.id} className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {post.title}
                      </a>
                    </h3>
                    {isRedditPost ? (
                      <PostMetrics
                        score={(post as ProcessedPost).score}
                        numComments={(post as ProcessedPost).num_comments}
                        url={post.url}
                      />
                    ) : (
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ArrowUpCircle size={16} />
                          {(post as ProcessedSubstackPost).likes.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          {(post as ProcessedSubstackPost).comments.toLocaleString()}
                        </div>
                        <div className="text-gray-500">
                          {(post as ProcessedSubstackPost).publicationName}
                        </div>
                        <a 
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={16} />
                          Read on Substack
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Newsletter;