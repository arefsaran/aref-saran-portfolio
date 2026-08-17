export const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const list = (items, render) => items.map(render).join('');

export const externalLink = ({ label, href }, className = '') => {
  const classAttribute = className ? ` class="${escapeHtml(className)}"` : '';
  return `<a${classAttribute} href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)} profile, opens in a new tab">${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`;
};

export const sectionHeading = ({ kicker, title, description, id }) => `
  <div class="section-heading" data-reveal="up">
    <div>
      <p class="section-kicker">${escapeHtml(kicker)}</p>
      <h2 id="${escapeHtml(id)}">${escapeHtml(title)}</h2>
    </div>
    <p>${escapeHtml(description)}</p>
  </div>`;
