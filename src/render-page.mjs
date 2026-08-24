import portfolio from '../content/portfolio.mjs';
import { AiAugmented, CapabilityMap, Contact, Experience, FintechCorrectness, Footer, Header, Hero, OutcomeMap, ProofBar, SystemArchitecture, WorkflowEngineering, Work } from './components.mjs';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${portfolio.site.url}#website`,
      url: portfolio.site.url,
      name: `${portfolio.profile.name} — ${portfolio.profile.role}`,
      description: portfolio.site.description,
      inLanguage: portfolio.site.language
    },
    {
      '@type': 'ProfilePage',
      '@id': `${portfolio.site.url}#profile`,
      url: portfolio.site.url,
      name: portfolio.site.title,
      description: portfolio.site.description,
      inLanguage: portfolio.site.language,
      isPartOf: { '@id': `${portfolio.site.url}#website` },
      mainEntity: { '@id': `${portfolio.site.url}#person` },
      dateModified: portfolio.site.lastModified
    },
    {
      '@type': 'Person',
      '@id': `${portfolio.site.url}#person`,
      name: portfolio.profile.name,
      url: portfolio.site.url,
      image: new URL(portfolio.profile.portrait.fallback, portfolio.site.url).href,
      jobTitle: portfolio.profile.role,
      description: portfolio.site.description,
      email: `mailto:${portfolio.profile.email}`,
      sameAs: portfolio.profile.socialLinks.map((link) => link.href),
      alumniOf: { '@type': 'CollegeOrUniversity', name: portfolio.profile.education },
      knowsAbout: ['Software quality engineering', 'Test automation architecture', 'Robot Framework', 'API testing', 'Integration testing', 'BPMN testing', 'Camunda testing', 'Fintech quality engineering', 'Performance testing', 'GitLab CI']
    }
  ]
};

export const renderPage = () => `<!doctype html>
<html lang="${portfolio.site.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="${portfolio.site.themeColors.light}" data-theme-color data-light="${portfolio.site.themeColors.light}" data-dark="${portfolio.site.themeColors.dark}">
  <meta name="description" content="${portfolio.site.description}">
  <meta name="author" content="${portfolio.profile.name}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${portfolio.site.url}">
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="preload" href="./${portfolio.profile.portrait.webp}" as="image" type="image/webp">
  <script src="./theme-init.js"></script>
  <link rel="stylesheet" href="./styles.css">
  <script defer src="./script.js"></script>
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${portfolio.site.title}">
  <meta property="og:description" content="${portfolio.site.socialDescription}">
  <meta property="og:url" content="${portfolio.site.url}">
  <meta property="og:site_name" content="Aref Saran — Senior Test Engineer">
  <meta property="og:image" content="${new URL(portfolio.site.socialImage, portfolio.site.url).href}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="Aref Saran, Senior Test Engineer — engineering confidence into complex software">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${portfolio.site.title}">
  <meta name="twitter:description" content="${portfolio.site.socialDescription}">
  <meta name="twitter:image" content="${new URL(portfolio.site.socialImage, portfolio.site.url).href}">
  <meta name="twitter:image:alt" content="Aref Saran, Senior Test Engineer — engineering confidence into complex software">
  <title>${portfolio.site.title}</title>
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${Header(portfolio)}
  <main id="main">
    ${Hero(portfolio)}
    ${ProofBar(portfolio)}
    ${OutcomeMap(portfolio)}
    ${SystemArchitecture(portfolio)}
    ${WorkflowEngineering(portfolio)}
    ${FintechCorrectness(portfolio)}
    ${Work(portfolio)}
    ${AiAugmented(portfolio)}
    ${CapabilityMap(portfolio)}
    ${Experience(portfolio)}
    ${Contact(portfolio)}
  </main>
  ${Footer(portfolio)}
</body>
</html>
`;

export { portfolio };
