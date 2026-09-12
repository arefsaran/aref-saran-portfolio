import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js';

function normalizeLanguage(lang = '') {
  const raw = lang.toLowerCase().trim();
  const aliases = {
    robotframework: 'plaintext',
    robot: 'plaintext',
    shell: 'bash',
    sh: 'bash',
    yml: 'yaml',
  };
  const resolved = aliases[raw] || raw;
  return resolved && hljs.getLanguage(resolved) ? resolved : null;
}

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    code(token) {
      const text = typeof token === 'string' ? token : token.text;
      const lang = typeof token === 'string' ? '' : token.lang || '';
      const language = normalizeLanguage(lang);
      const highlighted = language
        ? hljs.highlight(text, { language, ignoreIllegals: true }).value
        : hljs.highlightAuto(text, ['python', 'javascript', 'typescript', 'json', 'yaml', 'bash', 'sql', 'plaintext']).value;
      const className = language ? `hljs language-${language}` : 'hljs';
      return `<pre><code class="${className}">${highlighted}</code></pre>`;
    },
  },
});

const allowedTags = [...new Set(sanitizeHtml.defaults.allowedTags.concat([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'figure', 'figcaption', 'pre', 'code', 'span', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
]))];

export function renderMarkdown(markdown = '') {
  const raw = marked.parse(markdown);
  return sanitizeHtml(raw, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      span: ['class'],
      th: ['scope'],
    },
    allowedClasses: {
      code: ['hljs', 'language-*'],
      span: ['hljs-*'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      h1: 'h2',
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
      img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }, true),
    },
  });
}

export function estimateReadingTime(markdown = '') {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function wordCount(markdown = '') {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}
