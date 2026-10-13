const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = p => fs.readFileSync(path.join(root, p), 'utf8');
const moduleFrom = async p => import('data:text/javascript;base64,' + Buffer.from(source(p)).toString('base64'));
const post = {
  slug: 'prueba-mineria', title: { rendered: 'Minería &amp; trabajo' },
  categories: [170094], content: { rendered: '<p>Litio <strong>en San Juan</strong></p>' },
  excerpt: { rendered: '<p>Información minera</p>' }, date: '2026-10-13T10:00:00', featured_media: 0
};
async function loadPage(file, fetchMock) {
  const date = await moduleFrom('lib/editorialDate.js');
  const wp = await moduleFrom('lib/wordpress.js');
  const text = source(file);
  // Evaluate real data processors and getStaticProps; JSX is outside these regions.
  const boundary = text.indexOf('const getCategoryName') >= 0 ? text.indexOf('const getCategoryName') : text.indexOf('const getCategoryLabel');
  const processors = text.slice(0, boundary)
    .replace(/^import .*;\r?\n/gm, '');
  const props = text.slice(text.indexOf('export async function getStaticProps'))
    .replace('export async function', 'async function');
  const context = vm.createContext({
    editorialDate: () => date.editorialDate(new Date('2026-10-13T14:00:00Z')),
    fetchPosts: wp.fetchPosts, validSlug: wp.validSlug
  });
  global.fetch = fetchMock;
  vm.runInContext(processors + '\n' + props + '\nthis.getProps = getStaticProps;', context);
  return context.getProps;
}
test('editorial day is stable and changes at Argentine midnight', async () => {
  const { editorialDate } = await moduleFrom('lib/editorialDate.js');
  assert.equal(editorialDate(new Date('2026-10-13T03:00:00Z')), editorialDate(new Date('2026-10-14T02:59:59Z')));
  assert.notEqual(editorialDate(new Date('2026-10-14T02:59:59Z')), editorialDate(new Date('2026-10-14T03:00:00Z')));
});
test('upstream errors and malformed data throw; a successful empty array is valid', async () => {
  const { fetchPosts } = await moduleFrom('lib/wordpress.js');
  for (const status of [404, 429, 500]) {
    global.fetch = async () => ({ ok: false, status });
    await assert.rejects(fetchPosts('https://example.com/posts'), new RegExp(String(status)));
  }
  for (const data of [{ error: 'bad' }, [null], [{}]]) {
    global.fetch = async () => ({ ok: true, json: async () => data });
    await assert.rejects(fetchPosts('https://example.com/posts'), /Invalid WordPress/);
  }
  global.fetch = async () => ({ ok: true, json: async () => [] });
  assert.deepEqual(await fetchPosts('https://example.com/posts'), []);
});
const pages = ['pages/index.js', 'pages/noticia/[cat].js', 'pages/noticia/[cat]/[id].js', 'pages/en-desarrollo/index.js', 'pages/en-desarrollo/[id].js'];
test('all five pages propagate main and sidebar/related failures', async () => {
  for (const file of pages) {
    let getProps = await loadPage(file, async () => ({ ok: false, status: 500 }));
    await assert.rejects(getProps({ params: { cat: 'nacionales', id: post.slug } }), /500/, file);
    if (file === 'pages/en-desarrollo/index.js') continue;
    let calls = 0;
    getProps = await loadPage(file, async () => ++calls === 1
      ? { ok: true, json: async () => [post] } : { ok: false, status: 429 });
    await assert.rejects(getProps({ params: { cat: 'nacionales', id: post.slug } }), /429/, file);
  }
});
test('unchanged news has stable props, same intervals, searchable body and full article', async () => {
  for (const file of pages) {
    const getProps = await loadPage(file, async () => ({ ok: true, json: async () => [post] }));
    const a = await getProps({ params: { cat: 'nacionales', id: post.slug } });
    const b = await getProps({ params: { cat: 'nacionales', id: post.slug } });
    assert.equal(JSON.stringify(a), JSON.stringify(b), file);
    assert.equal(a.revalidate, file === 'pages/noticia/[cat]/[id].js' ? 300 : 60);
    if (a.props.allNews) {
      assert.equal(a.props.allNews[0].searchText, 'Litio en San Juan');
      assert.equal(a.props.allNews[0].content, undefined);
    }
    if (a.props.noticia) assert.ok(a.props.noticia.content.includes('<strong>'));
    if (a.props.news) assert.ok(a.props.news.content.includes('<strong>'));
  }
});
test('confirmed missing posts get retryable 404; prototype category is rejected', async () => {
  for (const file of ['pages/noticia/[cat]/[id].js', 'pages/en-desarrollo/[id].js']) {
    const getProps = await loadPage(file, async () => ({ ok: true, json: async () => [] }));
    const result = await getProps({ params: { cat: 'nacionales', id: 'future-post' } });
    assert.equal(result.notFound, true);
    assert.equal(result.revalidate, 60);
  }
  const getProps = await loadPage('pages/noticia/[cat]/[id].js', () => { throw new Error('must not fetch'); });
  assert.equal((await getProps({ params: { cat: 'constructor', id: post.slug } })).notFound, true);
});
test('slugs reject separators and control characters, and are safely encoded', async () => {
  const { validSlug } = await moduleFrom('lib/wordpress.js');
  for (const value of ['../a', 'a\\b', 'a\u0000b', '', 'a'.repeat(401)]) assert.equal(validSlug(value), false);
  let requested;
  const getProps = await loadPage('pages/noticia/[cat]/[id].js', async url => {
    requested = url; return { ok: true, json: async () => [] };
  });
  await getProps({ params: { cat: 'nacionales', id: 'nota&categories=1' } });
  assert.ok(requested.includes('slug=nota%26categories%3D1'));
});
