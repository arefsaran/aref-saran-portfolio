export function buildLinkedInDraft(article, baseUrl) {
  const hook = article.linkedinHook?.trim() || article.excerpt?.trim() || article.title;
  const summary = article.linkedinSummary?.trim() || article.excerpt?.trim() || '';
  const points = (article.linkedinKeyPoints || []).filter(Boolean).slice(0, 6);
  const cta = article.linkedinCTA?.trim() || `Read the full engineering note: ${baseUrl}/articles/${article.slug}`;
  const hashtags = (article.linkedinHashtags || []).filter(Boolean).map((tag) => tag.startsWith('#') ? tag : `#${tag.replace(/\s+/g, '')}`);

  return [
    hook,
    summary,
    points.length ? points.map((point) => `• ${point}`).join('\n') : '',
    cta,
    hashtags.join(' '),
  ].filter(Boolean).join('\n\n');
}
