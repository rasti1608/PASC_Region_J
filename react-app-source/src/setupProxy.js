/**
 * Proxy configuration for React development server
 * Proxies API calls to ColdFusion server (same setup as Angular)
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy /api requests to ColdFusion server
  // IMPORTANT: Don't strip /api prefix - ColdFusion expects /api/xxx.cfc
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:80',
      changeOrigin: true,
      secure: false,
      // Preserve the /api path prefix (don't rewrite)
      pathRewrite: undefined,
      logger: console,
      on: {
        proxyReq: (proxyReq, req, res) => {
          // req.url here is already stripped of /api, need to use req.originalUrl
          console.log('[Proxy] Request:', req.method, req.originalUrl, '-> http://localhost:80' + req.originalUrl);
          // Forward cookies
          if (req.headers.cookie) {
            proxyReq.setHeader('cookie', req.headers.cookie);
          }
          // Manually set the path to include /api
          proxyReq.path = req.originalUrl;
        },
        proxyRes: (proxyRes, req, res) => {
          console.log('[Proxy] Response:', proxyRes.statusCode, req.originalUrl);
        },
        error: (err, req, res) => {
          console.error('[Proxy] Error:', err.message);
        }
      }
    })
  );

  // Proxy /Front_End for dynamic assets from ColdFusion
  app.use(
    '/Front_End',
    createProxyMiddleware({
      target: 'http://localhost:80',
      changeOrigin: true,
      secure: false,
      on: {
        proxyReq: (proxyReq, req, res) => {
          proxyReq.path = req.originalUrl;
        }
      }
    })
  );
};
