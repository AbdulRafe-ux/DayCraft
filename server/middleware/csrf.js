/**
 * CSRF protection for cookie-based login.
 *
 * Every request that changes data must carry the custom header
 * "X-Requested-With: DayCraft". A web page on another website cannot add a custom
 * header to a cross-site request without the browser first asking our server for
 * permission (CORS preflight), and our CORS policy only allows the DayCraft client.
 * Combined with SameSite=Lax cookies this blocks cross-site request forgery.
 */
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

module.exports = function csrfGuard(req, res, next) {
  if (SAFE_METHODS.includes(req.method)) return next();
  if (req.get('X-Requested-With') === 'DayCraft') return next();
  return res.status(403).json({ success: false, message: 'Request blocked for your security.' });
};
