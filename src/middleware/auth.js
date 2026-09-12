export function requireAdmin(req, res, next) {
  if (!req.session?.adminId) {
    const wantsJson = req.accepts(['html', 'json']) === 'json' || req.path.startsWith('/api/');
    if (wantsJson) return res.status(401).json({ error: 'Authentication required' });
    return res.redirect('/admin/login');
  }
  next();
}

export function redirectIfAuthenticated(req, res, next) {
  if (req.session?.adminId) return res.redirect('/admin');
  next();
}
