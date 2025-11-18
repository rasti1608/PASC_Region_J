const PROXY_CONFIG = {
  "/api": {
    target: "http://localhost",
    secure: false,
    changeOrigin: false,
    logLevel: "debug",
    cookieDomainRewrite: "localhost"
  },
  "/admin_api": {
    target: "http://localhost",
    secure: false,
    changeOrigin: false,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
    onProxyReq: (proxyReq, req, res) => {
      // Forward cookies from Angular dev server to ColdFusion
      if (req.headers.cookie) {
        proxyReq.setHeader('cookie', req.headers.cookie);
      }
    }
  },
  "/assets": {
    target: "http://localhost",
    secure: false,
    changeOrigin: false
  }
};

module.exports = PROXY_CONFIG;
