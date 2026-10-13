// Throw on upstream failures so ISR retains the last successful page.
export async function fetchPosts(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'UGNoticiasMineras/1.0 (+https://ugnoticiasmineras.com)', Accept: 'application/json' },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error('WordPress posts request failed: ' + response.status);
  const posts = await response.json();
  if (!Array.isArray(posts)) throw new Error('Invalid WordPress posts response');
  if (posts.some(post => !post || typeof post.slug !== 'string' || !post.title || typeof post.title.rendered !== 'string')) {
    throw new Error('Invalid WordPress post');
  }
  return posts;
}
export function validSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 400 && !/[\/\\\u0000-\u001f]/.test(slug);
}
