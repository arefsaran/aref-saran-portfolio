import { defaultSiteSettings } from '../services/settings.js';

export function notFound(req, res) {
  res.status(404).render('404', {
    title: 'Not found',
    description: 'The requested page could not be found.',
    path: req.path,
  });
}

export function errorHandler(error, req, res, _next) {
  const status = error.status || error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  if (status >= 500) console.error(error);
  if (req.accepts(['html', 'json']) === 'json') {
    return res.status(status).json({ error: status === 500 ? 'Internal server error' : error.message });
  }
  res.locals.baseUrl ||= req.app.locals.baseUrl;
  res.locals.currentPath ||= req.path;
  res.locals.settings ||= defaultSiteSettings;
  res.status(status).render('error', {
    title: 'Something went wrong',
    description: status === 500 ? 'The request could not be completed.' : error.message,
    status,
  });
}
