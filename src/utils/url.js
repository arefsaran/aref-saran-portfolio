export function safeHttpUrl(value = '', { allowRelative = false } = {}) {
  const input = String(value || '').trim();
  if (!input) return '';
  if (allowRelative && input.startsWith('/') && !input.startsWith('//')) return input;
  try {
    const url = new URL(input);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

export function safeEmail(value = '') {
  const input = String(value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) ? input : '';
}
