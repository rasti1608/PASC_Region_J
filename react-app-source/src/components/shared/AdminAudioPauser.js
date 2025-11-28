import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';

/**
 * Component that pauses background music when navigating to admin routes
 * This matches the Angular app behavior
 */
function AdminAudioPauser() {
  const location = useLocation();
  const { pause } = useAudio();

  useEffect(() => {
    // Pause audio when navigating to admin pages
    if (location.pathname.startsWith('/admin')) {
      pause();
    }
  }, [location.pathname, pause]);

  return null; // This component doesn't render anything
}

export default AdminAudioPauser;
