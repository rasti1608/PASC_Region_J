import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = '/api/auth.cfc';

/**
 * Process ColdFusion response (remove // prefix and lowercase keys)
 */
function processResponse(text) {
  let cleanText = text;
  if (cleanText.startsWith('//')) {
    cleanText = cleanText.substring(2);
  }

  try {
    const data = JSON.parse(cleanText);
    return lowercaseKeys(data);
  } catch (e) {
    console.error('Failed to parse response:', e);
    throw e;
  }
}

function lowercaseKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => lowercaseKeys(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = lowercaseKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

async function apiRequest(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const text = await response.text();
  return processResponse(text);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await apiRequest(`${API_URL}?method=checkAuth`);
      if (response.success && response.authenticated && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthCheckComplete(true);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      const response = await apiRequest(`${API_URL}?method=login`, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await apiRequest(`${API_URL}?method=logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await apiRequest(`${API_URL}?method=requestPasswordReset`, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return response;
    } catch (error) {
      return { success: false, message: error.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await apiRequest(`${API_URL}?method=resetPassword`, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      });
      return response;
    } catch (error) {
      return { success: false, message: error.message || 'Failed to reset password' };
    }
  };

  const changeRequiredPassword = async (newPassword) => {
    try {
      const response = await apiRequest(`${API_URL}?method=changeRequiredPassword`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });

      if (response.success && user) {
        setUser({ ...user, must_change_password: false });
      }
      return response;
    } catch (error) {
      return { success: false, message: error.message || 'Failed to change password' };
    }
  };

  const activateAccount = async (token, newPassword) => {
    try {
      const response = await apiRequest(`${API_URL}?method=activateAccountWithToken`, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      });
      return response;
    } catch (error) {
      return { success: false, message: error.message || 'Failed to activate account' };
    }
  };

  const value = {
    user,
    loading,
    authCheckComplete,
    isAuthenticated: !!user,
    isAdmin: user?.role_id === 1,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    changeRequiredPassword,
    activateAccount,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
