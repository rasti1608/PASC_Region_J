/**
 * API Service for interacting with ColdFusion backend
 * All endpoints are in /api/*.cfc
 */

const BASE_URL = '/api';

/**
 * Helper to convert ColdFusion response (remove // prefix and lowercase keys)
 */
function processResponse(text) {
  // Remove ColdFusion's "//" secure JSON prefix
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

/**
 * Recursively convert all object keys to lowercase
 */
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

/**
 * Make API request with secure JSON handling
 */
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const text = await response.text();
  return processResponse(text);
}

// ==================== ANNOUNCEMENTS ====================

export async function getAnnouncements() {
  return apiRequest(`${BASE_URL}/announcements.cfc?method=getAnnouncements`);
}

// ==================== GALLERY ====================

export async function getGalleryImages(location = 'gallery', page = 1, limit = 9) {
  const params = new URLSearchParams({
    method: 'getImages',
    location,
    page: page.toString(),
    limit: limit.toString()
  });
  return apiRequest(`${BASE_URL}/gallery.cfc?${params}`);
}

export async function getGalleryCount(location = 'gallery') {
  const params = new URLSearchParams({
    method: 'getCount',
    location
  });
  return apiRequest(`${BASE_URL}/gallery.cfc?${params}`);
}

// ==================== DOCUMENTS ====================

export async function getDocuments() {
  return apiRequest(`${BASE_URL}/documents.cfc?method=getDocuments`);
}

// ==================== WORKSHOPS ====================

export async function getWorkshopForms(location = 'Workshops') {
  const params = new URLSearchParams({
    method: 'getForms',
    location
  });
  return apiRequest(`${BASE_URL}/workshops.cfc?${params}`);
}

// ==================== CONTACT ====================

export async function submitContact(submission) {
  const params = new URLSearchParams({
    method: 'submitContact',
    name: submission.name,
    email: submission.email,
    subject: submission.subject,
    message: submission.message,
    website: submission.website || ''
  });

  return apiRequest(`${BASE_URL}/contact.cfc?${params}`, {
    method: 'POST'
  });
}

// ==================== PAGES ====================

export async function getConferenceInfo() {
  return apiRequest(`${BASE_URL}/pages.cfc?method=getConferenceInfo`);
}

export async function getPageContent(pageName) {
  const params = new URLSearchParams({
    method: 'getContent',
    pageName
  });
  return apiRequest(`${BASE_URL}/pages.cfc?${params}`);
}

// ==================== SCHEDULE ====================

export async function getSchedule() {
  return apiRequest(`${BASE_URL}/schedule.cfc?method=getSchedule`);
}

export async function getScheduleAdmin() {
  return apiRequest(`${BASE_URL}/schedule.cfc?method=getScheduleAdmin`);
}

export async function saveSchedule(scheduleItems) {
  const formData = new FormData();
  formData.append('method', 'saveSchedule');
  formData.append('scheduleData', JSON.stringify(scheduleItems));

  return apiRequest(`${BASE_URL}/schedule.cfc`, {
    method: 'POST',
    body: formData
  });
}
