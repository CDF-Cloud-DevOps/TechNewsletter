import React, { useEffect, useState } from 'react';
import { ProcessedPost } from './types/reddit';
import { fetchAllPosts } from './utils/redditApi';
import { processPost } from './utils/postProcessor';
import Newsletter from './components/Newsletter';
import { Loader2 } from 'lucide-react';

function App() {
  const [posts, setPosts] = useState<ProcessedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const rawPosts = await fetchAllPosts();
        const processedPosts = rawPosts.map(processPost);
        setPosts(processedPosts);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading latest tech news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Newsletter posts={posts} />
    </div>
  );
}

export default App;