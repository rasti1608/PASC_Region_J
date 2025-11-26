/**
 * Admin API Services for PASC Region J Conference
 */

const BASE_URL = '/api';

/**
 * Helper to convert ColdFusion response
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
      ...options.headers
    }
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete defaultOptions.headers['Content-Type'];
  } else if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, { ...defaultOptions, ...options });
  const text = await response.text();
  return processResponse(text);
}

// ==================== ANNOUNCEMENTS ====================

export const announcementsService = {
  getAll: () => apiRequest(`${BASE_URL}/announcements.cfc?method=getAnnouncementsAdmin`),

  getById: (id) => apiRequest(`${BASE_URL}/announcements.cfc?method=getAnnouncementById&id=${id}`),

  create: (data) => apiRequest(`${BASE_URL}/announcements.cfc?method=createAnnouncement`, {
    method: 'POST',
    body: data
  }),

  update: (id, data) => apiRequest(`${BASE_URL}/announcements.cfc?method=updateAnnouncement&id=${id}`, {
    method: 'POST',
    body: data
  }),

  delete: (id) => apiRequest(`${BASE_URL}/announcements.cfc?method=deleteAnnouncement&id=${id}`),

  toggleActive: (id) => apiRequest(`${BASE_URL}/announcements.cfc?method=toggleActive&id=${id}`),

  updateOrder: (id, newOrder) => apiRequest(`${BASE_URL}/announcements.cfc?method=updateOrder&id=${id}&displayOrder=${newOrder}`)
};

// ==================== GALLERY ====================

export const galleryService = {
  getAll: (location) => apiRequest(`${BASE_URL}/gallery.cfc?method=getImagesAdmin&location=${location || ''}`),

  getById: (id) => apiRequest(`${BASE_URL}/gallery.cfc?method=getImageById&id=${id}`),

  upload: (formData) => apiRequest(`${BASE_URL}/gallery.cfc?method=uploadImage`, {
    method: 'POST',
    body: formData
  }),

  update: (id, data) => apiRequest(`${BASE_URL}/gallery.cfc?method=updateImage&id=${id}`, {
    method: 'POST',
    body: data
  }),

  delete: (id) => apiRequest(`${BASE_URL}/gallery.cfc?method=deleteImage&id=${id}`),

  toggleActive: (id) => apiRequest(`${BASE_URL}/gallery.cfc?method=toggleActive&id=${id}`),

  updateOrder: (id, newOrder, location) =>
    apiRequest(`${BASE_URL}/gallery.cfc?method=updateOrder&id=${id}&displayOrder=${newOrder}&location=${location}`)
};

// ==================== DOCUMENTS ====================

export const documentsService = {
  getAll: () => apiRequest(`${BASE_URL}/documents.cfc?method=getDocumentsAdmin`),

  getById: (id) => apiRequest(`${BASE_URL}/documents.cfc?method=getDocumentById&id=${id}`),

  upload: (formData) => apiRequest(`${BASE_URL}/documents.cfc?method=uploadDocument`, {
    method: 'POST',
    body: formData
  }),

  update: (id, data) => apiRequest(`${BASE_URL}/documents.cfc?method=updateDocument&id=${id}`, {
    method: 'POST',
    body: data
  }),

  delete: (id) => apiRequest(`${BASE_URL}/documents.cfc?method=deleteDocument&id=${id}`),

  toggleActive: (id) => apiRequest(`${BASE_URL}/documents.cfc?method=toggleActive&id=${id}`),

  updateOrder: (id, newOrder) =>
    apiRequest(`${BASE_URL}/documents.cfc?method=updateOrder&id=${id}&displayOrder=${newOrder}`)
};

// ==================== FORMS ====================

export const formsService = {
  getAll: (location) => apiRequest(`${BASE_URL}/forms.cfc?method=getFormsAdmin&location=${location || ''}`),

  getById: (id) => apiRequest(`${BASE_URL}/forms.cfc?method=getFormById&id=${id}`),

  create: (data) => apiRequest(`${BASE_URL}/forms.cfc?method=createForm`, {
    method: 'POST',
    body: data
  }),

  update: (id, data) => apiRequest(`${BASE_URL}/forms.cfc?method=updateForm&id=${id}`, {
    method: 'POST',
    body: data
  }),

  delete: (id) => apiRequest(`${BASE_URL}/forms.cfc?method=deleteForm&id=${id}`),

  toggleActive: (id) => apiRequest(`${BASE_URL}/forms.cfc?method=toggleActive&id=${id}`),

  updateOrder: (id, newOrder, location) =>
    apiRequest(`${BASE_URL}/forms.cfc?method=updateOrder&id=${id}&displayOrder=${newOrder}&location=${location}`)
};

// ==================== CONTACTS ====================

export const contactsService = {
  getAll: () => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=getContacts`),

  getById: (id) => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=getContactById&id=${id}`),

  updateStatus: (id, status) =>
    apiRequest(`${BASE_URL}/contacts-admin.cfc?method=updateStatus&id=${id}&status=${status}`),

  updateAdminNotes: (id, notes) => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=updateNotes&id=${id}`, {
    method: 'POST',
    body: { notes }
  }),

  getStatusCounts: () => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=getStatusCounts`),

  // Email Recipients
  getEmailRecipients: () => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=getEmailRecipients`),

  addEmailRecipient: (formData) => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=addEmailRecipient`, {
    method: 'POST',
    body: formData
  }),

  toggleRecipientStatus: (formData) => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=toggleRecipientStatus`, {
    method: 'POST',
    body: formData
  }),

  deleteEmailRecipient: (formData) => apiRequest(`${BASE_URL}/contacts-admin.cfc?method=deleteEmailRecipient`, {
    method: 'POST',
    body: formData
  })
};

// ==================== USERS ====================

export const usersService = {
  getAll: () => apiRequest(`${BASE_URL}/users-admin.cfc?method=getUsers`),

  getById: (id) => apiRequest(`${BASE_URL}/users-admin.cfc?method=getUserById&id=${id}`),

  create: (data) => apiRequest(`${BASE_URL}/users-admin.cfc?method=createUser`, {
    method: 'POST',
    body: data
  }),

  update: (id, data) => apiRequest(`${BASE_URL}/users-admin.cfc?method=updateUser&id=${id}`, {
    method: 'POST',
    body: data
  }),

  delete: (id) => apiRequest(`${BASE_URL}/users-admin.cfc?method=deleteUser&id=${id}`),

  toggleActive: (id) => apiRequest(`${BASE_URL}/users-admin.cfc?method=toggleActive&id=${id}`),

  getRoles: () => apiRequest(`${BASE_URL}/users-admin.cfc?method=getRoles`),

  checkUsernameAvailability: (username, excludeUserId) =>
    apiRequest(`${BASE_URL}/users-admin.cfc?method=checkUsername&username=${username}&excludeId=${excludeUserId || ''}`)
};

// ==================== PROFILE ====================

export const profileService = {
  getProfile: () => apiRequest(`${BASE_URL}/profile.cfc?method=getProfile`),

  updateProfile: (data) => apiRequest(`${BASE_URL}/profile.cfc?method=updateProfile`, {
    method: 'POST',
    body: data
  }),

  changePassword: (data) => apiRequest(`${BASE_URL}/profile.cfc?method=changePassword`, {
    method: 'POST',
    body: data
  }),

  uploadProfilePicture: (formData) => apiRequest(`${BASE_URL}/profile.cfc?method=uploadPicture`, {
    method: 'POST',
    body: formData
  }),

  removeProfilePicture: () => apiRequest(`${BASE_URL}/profile.cfc?method=removePicture`)
};

// ==================== EMAIL SETTINGS ====================

export const emailSettingsService = {
  getSettings: () => apiRequest(`${BASE_URL}/email-settings.cfc?method=getSettings`),

  updateSettings: (data) => apiRequest(`${BASE_URL}/email-settings.cfc?method=updateSettings`, {
    method: 'POST',
    body: data
  })
};
