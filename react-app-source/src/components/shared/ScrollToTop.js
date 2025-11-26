import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Scrolls to top on every route change
 * Must be placed inside Router but outside Routes
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force instant scroll to top on every navigation
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
