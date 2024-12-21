Create a Reddit news aggregator and newsletter generator that:

Fetches top-rated posts from specified subreddits (/r/artificial, /r/technology, /r/programming, /r/coding, /r/softwareengineering, /r/MachineLearning, /r/ChatGPTPromptGenius, /r/ChatGPTCoding, /r/AZURE, /r/ChatGPT, /r/ClaudeAI, /r/OpenAI, /r/GeminiAI, /r/GoogleGeminiAI) within the last 24 hours

Filters posts based on:

Minimum upvote threshold (>1000)
Authenticity (verified sources, reputable domains)
Relevance to AI, technology, software engineering, and business technology
Excludes memes, jokes, and low-quality content
For each selected post, generate:

A concise 2-3 sentence summary
Original Reddit post link
Source article link (if applicable)
Key topics/tags
Upvote count and comment count
Organize content into categories:

AI/ML Developments
Programming & Software Engineering
Business Technology
Industry News
Tools & Resources
Output format:

A structured newsletter in HTML and Markdown
Ready for direct publication to Substack/Medium
Email-friendly format
Include table of contents
Maximum 10 top stories per category
Provide the solution in Python using PRAW (Reddit API wrapper) or JavaScript using Reddit's API, with proper error handling and rate limiting. Include options to customize subreddits, time range, and output format.

Installation

```
npm install

```

To run

```
npm run dev
```
