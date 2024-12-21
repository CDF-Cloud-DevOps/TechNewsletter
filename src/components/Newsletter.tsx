import React from 'react';
import { format } from 'date-fns';
import { ProcessedPost, Category } from '../types/reddit';
import { ExternalLink, ArrowUpCircle, MessageCircle } from 'lucide-react';

interface NewsletterProps {
  posts: ProcessedPost[];
}

const Newsletter: React.FC<NewsletterProps> = ({ posts }) => {
  const categories: Category[] = [
    'AI/ML Developments',
    'Programming & Software Engineering',
    'Business Technology',
    'Industry News',
    'Tools & Resources'
  ];

  const postsByCategory = categories.reduce((acc, category) => {
    acc[category] = posts
      .filter(post => post.category === category)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    return acc;
  }, {} as Record<Category, ProcessedPost[]>);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Farees's Tech & AI News Digest</h1>
        <p className="text-gray-600">
          {format(new Date(), 'MMMM d, yyyy')} • Curated from Reddit's Top Tech Communities
        </p>
      </header>

      <nav className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <a 
                href={`#${category}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {categories.map(category => (
        <section key={category} id={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category}</h2>
          {postsByCategory[category].map(post => (
            <article key={post.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                <a 
                  href={`https://reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {post.title}
                </a>
              </h3>
              <p className="text-gray-700 mb-3">{post.summary}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ArrowUpCircle size={16} />
                  {post.score.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {post.num_comments.toLocaleString()}
                </div>
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} />
                  Source
                </a>
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
};

export default Newsletter;