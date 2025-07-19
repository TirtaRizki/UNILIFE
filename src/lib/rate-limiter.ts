
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

export const rateLimitMiddleware = async (request: Request) => {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    try {
        await rateLimiter.consume(ip);
        return null; // No issue, continue
    } catch (error) {
        return new Response('Too Many Requests', { status: 429 });
    }
};
