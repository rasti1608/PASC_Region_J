import React, { useState, useEffect, useCallback } from 'react';
import { getScheduleAdmin, saveSchedule } from '../../services/api';

// Available icons for selection
const availableIcons = [
  { emoji: '📋', label: 'Registration' },
  { emoji: '🎤', label: 'Speaker' },
  { emoji: '🍽️', label: 'Lunch/Food' },
  { emoji: '🏆', label: 'Awards' },
  { emoji: '📚', label: 'Workshop' },
  { emoji: '🎓', label: 'Ceremony' },
  { emoji: '☕', label: 'Break' },
  { emoji: '🎯', label: 'Activities' },
  { emoji: '💼', label: 'Professional' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '🗣️', label: 'Presentation' },
  { emoji: '👥', label: 'Networking' }
];

function ScheduleManagement() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [timeErrors, setTimeErrors] = useState(new Map());

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getScheduleAdmin();
      if (response.success && response.data) {
        setScheduleItems(response.data);
      } else {
        setError(response.message || 'Failed to load schedule');
      }
      setLoading(false);
    } catch (err) {
      setError('Error loading schedule: ' + err.message);
      setLoading(false);
    }
  };

  /**
   * Parse time string to minutes for sorting
   */
  const parseTime = useCallback((timeStr) => {
    if (!timeStr) return 0;

    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }, []);

  /**
   * Validate time format
   */
  const validateTimeFormat = useCallback((timeStr) => {
    if (!timeStr) return false;
    // Valid formats: "9:00 AM", "10:30 PM", "12:00 PM"
    const timePattern = /^(1[0-2]|[1-9]):([0-5]\d)\s*(AM|PM)$/i;
    return timePattern.test(timeStr);
  }, []);

  /**
   * Sort schedule by time
   */
  const sortByTime = useCallback((items) => {
    const sorted = [...items].sort((a, b) => {
      const timeA = parseTime(a.event_time);
      const timeB = parseTime(b.event_time);
      return timeA - timeB;
    });

    // Resequence display_order after sorting
    return sorted.map((item, i) => ({
      ...item,
      display_order: i + 1
    }));
  }, [parseTime]);

  /**
   * Add new time slot
   */
  const addTimeSlot = () => {
    const newItem = {
      event_time: '',
      end_time: '',
      event_name: '',
      event_icon: '📋',
      event_description: '',
      display_order: scheduleItems.length + 1,
      is_active: true
    };

    setScheduleItems(prev => [...prev, newItem]);
  };

  /**
   * Remove time slot
   */
  const removeTimeSlot = (index) => {
    setScheduleItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      // Resequence display_order
      return newItems.map((item, i) => ({
        ...item,
        display_order: i + 1
      }));
    });

    // Clear any error for this index
    setTimeErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(index);
      return newErrors;
    });
  };

  /**
   * Check for time conflicts with other events
   */
  const checkTimeConflicts = useCallback((index, items) => {
    const currentItem = items[index];

    if (!currentItem.event_time || !currentItem.end_time) {
      return null; // Skip if either time is empty
    }

    const currentStart = parseTime(currentItem.event_time);
    const currentEnd = parseTime(currentItem.end_time);

    // Check if end time is before start time
    if (currentEnd <= currentStart) {
      return 'End time must be after start time';
    }

    // Check for conflicts with other events
    for (let i = 0; i < items.length; i++) {
      if (i === index) continue; // Skip self

      const otherItem = items[i];
      if (!otherItem.event_time || !otherItem.end_time) continue;

      const otherStart = parseTime(otherItem.event_time);
      const otherEnd = parseTime(otherItem.end_time);

      // Check for overlap
      const hasOverlap = (currentStart < otherEnd && currentEnd > otherStart);

      if (hasOverlap) {
        return `Time conflict with "${otherItem.event_name || 'event ' + (i + 1)}"`;
      }
    }

    return null;
  }, [parseTime]);

  /**
   * Update time (no auto-sort while typing)
   */
  const onTimeChange = (index, newTime) => {
    setScheduleItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], event_time: newTime };
      return newItems;
    });

    // Clear validation error while typing
    setTimeErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(index);
      return newErrors;
    });
  };

  /**
   * Update end time
   */
  const onEndTimeChange = (index, newTime) => {
    setScheduleItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], end_time: newTime };
      return newItems;
    });

    // Clear validation error while typing
    setTimeErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(index);
      return newErrors;
    });
  };

  /**
   * Handle time input blur - validate and sort
   */
  const onTimeBlur = (index, timeStr) => {
    if (timeStr && !validateTimeFormat(timeStr)) {
      // Set validation error
      setTimeErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.set(index, 'Invalid format. Use: 9:00 AM or 2:30 PM');
        return newErrors;
      });
    } else {
      // Clear error and check conflicts
      setTimeErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(index);
        return newErrors;
      });

      // Check for time conflicts
      const conflict = checkTimeConflicts(index, scheduleItems);
      if (conflict) {
        setTimeErrors(prev => {
          const newErrors = new Map(prev);
          newErrors.set(index, conflict);
          return newErrors;
        });
      }

      // Sort after user finishes editing
      if (timeStr) {
        setScheduleItems(prev => sortByTime(prev));
      }
    }
  };

  /**
   * Handle end time input blur - validate and check conflicts
   */
  const onEndTimeBlur = (index, timeStr) => {
    if (timeStr && !validateTimeFormat(timeStr)) {
      // Set validation error
      setTimeErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.set(index, 'Invalid format. Use: 9:00 AM or 2:30 PM');
        return newErrors;
      });
    } else {
      // Clear error and check conflicts
      setTimeErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(index);
        return newErrors;
      });

      // Check for time conflicts
      const conflict = checkTimeConflicts(index, scheduleItems);
      if (conflict) {
        setTimeErrors(prev => {
          const newErrors = new Map(prev);
          newErrors.set(index, conflict);
          return newErrors;
        });
      }
    }
  };

  /**
   * Get time error for specific index
   */
  const getTimeError = (index) => {
    return timeErrors.get(index);
  };

  /**
   * Update event name
   */
  const onEventNameChange = (index, newName) => {
    setScheduleItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], event_name: newName };
      return newItems;
    });
  };

  /**
   * Update event icon
   */
  const onEventIconChange = (index, newIcon) => {
    setScheduleItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], event_icon: newIcon };
      return newItems;
    });
  };

  /**
   * Update event description
   */
  const onEventDescriptionChange = (index, newDescription) => {
    setScheduleItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], event_description: newDescription };
      return newItems;
    });
  };

  /**
   * Check if schedule has validation errors
   */
  const hasValidationErrors = () => {
    return timeErrors.size > 0;
  };

  /**
   * Validate all times before save
   */
  const validateAllTimes = () => {
    let hasErrors = false;
    const newErrors = new Map();

    scheduleItems.forEach((item, index) => {
      if (item.event_time && !validateTimeFormat(item.event_time)) {
        newErrors.set(index, 'Invalid format. Use: 9:00 AM or 2:30 PM');
        hasErrors = true;
      }
    });

    setTimeErrors(newErrors);
    return !hasErrors;
  };

  /**
   * Save entire schedule
   */
  const handleSaveSchedule = async () => {
    // Validate all times first
    if (!validateAllTimes()) {
      setError('Please fix invalid time formats before saving');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    // Ensure all items have display_order set correctly
    const itemsToSave = scheduleItems.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));

    try {
      const response = await saveSchedule(itemsToSave);
      if (response.success && response.data) {
        setScheduleItems(response.data);
        setSuccessMessage('Schedule saved successfully!');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || 'Failed to save schedule');
      }
      setSaving(false);
    } catch (err) {
      setError('Error saving schedule: ' + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="schedule-management">
      {/* Page Header */}
      <div className="schedule-page-header">
        <div className="header-content">
          <h1 className="page-title">Schedule Management</h1>
          <p className="page-subtitle">Manage conference schedule with inline editing</p>
        </div>
        <button className="btn btn-add-slot" onClick={addTimeSlot}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add Time Slot
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading schedule...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error schedule-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success schedule-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {successMessage}
        </div>
      )}

      {/* Schedule Table */}
      {!loading && scheduleItems.length > 0 && (
        <>
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Icon</th>
                  <th>Event Name</th>
                  <th>Description</th>
                  <th width="80">Remove</th>
                </tr>
              </thead>
              <tbody>
                {scheduleItems.map((item, index) => (
                  <tr key={item.schedule_id || index}>
                    {/* Start Time Input with Validation */}
                    <td>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className={`form-input time-input ${getTimeError(index) ? 'input-error' : ''}`}
                          value={item.event_time || ''}
                          onChange={(e) => onTimeChange(index, e.target.value)}
                          onBlur={(e) => onTimeBlur(index, e.target.value)}
                          placeholder="9:00 AM"
                          title="Format: 9:00 AM or 2:30 PM"
                        />
                        {getTimeError(index) && (
                          <div className="validation-error">{getTimeError(index)}</div>
                        )}
                      </div>
                    </td>
                    {/* End Time Input with Validation */}
                    <td>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className={`form-input time-input ${getTimeError(index) ? 'input-error' : ''}`}
                          value={item.end_time || ''}
                          onChange={(e) => onEndTimeChange(index, e.target.value)}
                          onBlur={(e) => onEndTimeBlur(index, e.target.value)}
                          placeholder="10:00 AM"
                          title="Format: 10:00 AM or 3:30 PM"
                        />
                      </div>
                    </td>
                    {/* Icon Selector */}
                    <td>
                      <select
                        className="form-select icon-select"
                        value={item.event_icon || '📋'}
                        onChange={(e) => onEventIconChange(index, e.target.value)}
                      >
                        {availableIcons.map(icon => (
                          <option key={icon.emoji} value={icon.emoji}>
                            {icon.emoji} {icon.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Event Name */}
                    <td>
                      <input
                        type="text"
                        className="form-input name-input"
                        value={item.event_name || ''}
                        onChange={(e) => onEventNameChange(index, e.target.value)}
                        placeholder="Event Name"
                      />
                    </td>
                    {/* Description */}
                    <td>
                      <textarea
                        className="form-input description-input"
                        value={item.event_description || ''}
                        onChange={(e) => onEventDescriptionChange(index, e.target.value)}
                        placeholder="Event description"
                        rows="2"
                      ></textarea>
                    </td>
                    {/* Remove Button */}
                    <td className="remove-cell">
                      <button
                        className="btn-remove"
                        onClick={() => removeTimeSlot(index)}
                        title="Remove this time slot"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Help Text */}
          <div className="help-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>
              <strong>Time Format:</strong> Use format like "9:00 AM" or "2:30 PM".
              Rows will automatically reorder by time when you finish editing.
            </span>
          </div>

          {/* Save Button */}
          <div className="save-section">
            <button
              className="btn btn-save"
              onClick={handleSaveSchedule}
              disabled={saving || hasValidationErrors()}
            >
              {saving ? (
                <>
                  <div className="spinner-small"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && scheduleItems.length === 0 && (
        <div className="empty-state schedule-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3>No Schedule Items</h3>
          <p>Click "Add Time Slot" to create your first schedule item.</p>
          <button className="btn btn-add-slot" onClick={addTimeSlot}>
            Add Time Slot
          </button>
        </div>
      )}
    </div>
  );
}

export default ScheduleManagement;
