# Cloudflare AI Integration Guide

This guide explains how to integrate Cloudflare AI services with the Dyslexia Grand Hub application deployed on Cloudflare Pages.

## Overview

Cloudflare offers AI capabilities through:
- **Cloudflare Workers AI** - Run AI models at the edge
- **Cloudflare AI Gateway** - Manage and monitor AI API calls
- **Vectorize** - Vector database for semantic search
- **Workers** - Serverless compute for AI processing

## Potential AI Use Cases for Dyslexia Hub

### 1. AI-Powered Content Recommendations
Use Workers AI to:
- Recommend training modules based on screening results
- Suggest personalized learning paths
- Adapt content difficulty dynamically

### 2. Semantic Search
Use Vectorize to:
- Search research claims by meaning, not just keywords
- Find relevant interventions based on user queries
- Enable natural language search across the knowledge base

### 3. Chatbot Assistant
Use Workers AI with LLMs to:
- Answer questions about dyslexia research
- Guide users through the screening process
- Provide explanations of interventions

### 4. Text-to-Speech Enhancement
Use Cloudflare's AI audio processing to:
- Improve TTS quality for content
- Generate natural voiceovers for training materials
- Provide audio feedback during exercises

## Integration Options

### Option 1: Cloudflare Workers AI (Recommended)

**Setup:**
1. Enable Workers AI in Cloudflare dashboard
2. Create a Worker that calls AI models
3. Connect Workers AI to your Pages project

**Example Worker Code:**
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/ai/recommend') {
      const body = await request.json();
      const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt: `Based on these screening results: ${JSON.stringify(body.results)}, recommend training modules`
      });
      
      return new Response(JSON.stringify({ recommendation: response }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};
```

**Connect to Pages:**
```toml
# wrangler.toml
name = "dyslexia-hub"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"
```

### Option 2: Cloudflare AI Gateway

**Setup:**
1. Create AI Gateway in Cloudflare dashboard
2. Configure providers (OpenAI, Anthropic, etc.)
3. Use Gateway as proxy for AI API calls

**Benefits:**
- Centralized API key management
- Rate limiting and caching
- Analytics and monitoring
- Cost tracking

**Example Usage:**
```javascript
const response = await fetch('https://gateway.ai.cloudflare.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${env.AI_GATEWAY_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [...]
  })
});
```

### Option 3: Vectorize for Semantic Search

**Setup:**
1. Enable Vectorize in Cloudflare dashboard
2. Create vector index
3. Upload embeddings for research claims

**Example:**
```javascript
// Create vector index
const vectorize = env.VECTORIZE;

// Insert embeddings
await vectorize.insert([
  {
    id: 'claim-1',
    values: [0.1, 0.2, ...], // embedding vector
    metadata: { text: 'Dyslexia affects...', phase: 'foundational' }
  }
]);

// Semantic search
const results = await vectorize.query([0.1, 0.2, ...], {
  topK: 5,
  namespace: 'claims'
});
```

## Implementation Steps

### Step 1: Enable Cloudflare AI

1. Go to Cloudflare Dashboard → AI → Workers AI
2. Enable Workers AI for your account
3. Select models to use (e.g., Llama 2, Mistral, etc.)

### Step 2: Create Worker for AI Functions

1. Create a new Worker in Cloudflare Dashboard
2. Add AI binding in `wrangler.toml`
3. Implement AI endpoints

### Step 3: Update Dyslexia Hub

1. Add API calls to Workers AI endpoints
2. Create AI service layer in the app
3. Add UI for AI-powered features

### Step 4: Deploy and Test

1. Deploy Worker alongside Pages
2. Test AI endpoints
3. Monitor performance in Cloudflare dashboard

## Example: AI-Powered Training Recommendations

**1. Create Worker Endpoint:**
```javascript
// ai-worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/recommend') {
      const { screeningResults } = await request.json();
      
      const prompt = `
        You are a dyslexia intervention specialist. Based on these screening results:
        - Phonological score: ${screeningResults.phonological}/100
        - RAN score: ${screeningResults.ran}/100
        - Working memory score: ${screeningResults.workingMemory}/100
        - Attention score: ${screeningResults.attention}/100
        
        Recommend 3 training modules from this list:
        - phonological-training
        - ran-training
        - working-memory
        - fluency-training
        
        Return JSON with module IDs and brief reasoning.
      `;
      
      const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', { prompt });
      
      return new Response(response, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
```

**2. Add to Dyslexia Hub:**
```typescript
// services/ai.service.ts
export async function getAIRecommendations(screeningResults: ScreeningResults) {
  const response = await fetch('https://ai-worker.your-account.workers.dev/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ screeningResults })
  });
  
  return response.json();
}
```

**3. Use in Training Dashboard:**
```typescript
// TrainingDashboardPage.tsx
const aiRecommendations = await getAIRecommendations(screeningResults);
```

## Cost Considerations

**Workers AI Pricing:**
- Free tier: 10,000 requests/day
- Paid: $0.0001 per 1,000 tokens
- Check Cloudflare pricing for current rates

**Vectorize Pricing:**
- Free tier: 1M vectors
- Paid: $0.50 per 1M vectors per month

**AI Gateway:**
- Free tier: 10,000 requests/month
- Paid: Based on usage

## Best Practices

1. **Start Small**: Begin with one AI feature, expand gradually
2. **Cache Responses**: Cache AI responses to reduce costs
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Fallback**: Have non-AI fallbacks when AI fails
5. **Monitoring**: Use Cloudflare analytics to track usage
6. **Privacy**: Ensure user data is handled securely

## Security

1. **API Keys**: Store in Cloudflare secrets, not in code
2. **Validation**: Validate all AI inputs
3. **Sanitization**: Sanitize AI outputs before display
4. **Rate Limits**: Implement rate limiting on AI endpoints
5. **Content Filtering**: Use content filters for LLM outputs

## Deployment

1. **Deploy Worker:**
   ```bash
   wrangler deploy ai-worker
   ```

2. **Deploy Pages:**
   - Cloudflare Pages auto-deploys on git push
   - Worker and Pages can be connected

3. **Custom Domain:**
   - Configure custom domain for Worker
   - Use same domain as Pages (subdomain)

## Resources

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Cloudflare AI Pricing](https://www.cloudflare.com/products/ai/pricing/)

## Next Steps

1. Decide which AI features to implement
2. Enable Cloudflare AI services
3. Create AI Worker with endpoints
4. Integrate with Dyslexia Hub
5. Test thoroughly
6. Monitor and optimize

## Note

AI integration is optional. The Dyslexia Hub works perfectly without AI features. Consider AI as an enhancement to provide personalized recommendations and advanced search capabilities.
