const title = document.querySelector('[data-title-source]');
const slug = document.querySelector('[data-slug-target]');
if (title && slug) {
  let touched = Boolean(slug.value);
  slug.addEventListener('input', () => { touched = true; });
  title.addEventListener('input', () => {
    if (touched) return;
    slug.value = title.value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9\s-]/g,'').trim().replace(/[\s_-]+/g,'-');
  });
}

document.querySelectorAll('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (!target) return;
    const value = 'value' in target ? target.value : target.textContent;
    try {
      await navigator.clipboard.writeText(value.trim());
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch {
      button.textContent = 'Copy failed';
    }
  });
});

const articleForm = document.querySelector('[data-unsaved-form]');
if (articleForm) {
  let dirty = false;
  articleForm.addEventListener('input', () => { dirty = true; });
  articleForm.addEventListener('submit', () => { dirty = false; });
  addEventListener('beforeunload', (event) => { if (dirty) event.preventDefault(); });
}

const templates = {
  note: `## Problem\n\n## Why it matters\n\n## Failure mode\n\n## Technical analysis\n\n## Implementation example\n\n\`\`\`text\nexample\n\`\`\`\n\n## Verification\n\n## Trade-offs\n\n## Takeaway\n`,
  case: `## Context\n\n## Problem\n\n## Risk\n\n## Constraints\n\n## Approach\n\n## Architecture\n\n## Implementation\n\n## Result\n\n## Lessons\n`,
  tutorial: `## Objective\n\n## Prerequisites\n\n## Architecture\n\n## Implementation\n\n## Test\n\n## Failure cases\n\n## Production considerations\n\n## Summary\n`,
};
const templateSelect = document.querySelector('#article-template');
const applyTemplate = document.querySelector('[data-apply-template]');
const articleBody = document.querySelector('#body');
applyTemplate?.addEventListener('click', () => {
  if (!templateSelect?.value || !articleBody) return;
  if (articleBody.value.trim()) {
    alert('The editor is not empty. Clear it before applying a template so existing work is not overwritten.');
    return;
  }
  articleBody.value = templates[templateSelect.value] || '';
  articleBody.dispatchEvent(new Event('input', { bubbles: true }));
  articleBody.focus();
});

const previewBindings = [
  ['#slug', '[data-preview-slug]'],
  ['#seoTitle', '[data-preview-title]', '#title'],
  ['#seoDescription', '[data-preview-description]', '#excerpt'],
];
for (const [sourceSelector, targetSelector, fallbackSelector] of previewBindings) {
  const source = document.querySelector(sourceSelector);
  const target = document.querySelector(targetSelector);
  const fallback = fallbackSelector ? document.querySelector(fallbackSelector) : null;
  const sync = () => {
    if (!target) return;
    target.textContent = source?.value.trim() || fallback?.value.trim() || target.textContent;
  };
  source?.addEventListener('input', sync);
  fallback?.addEventListener('input', sync);
}
