import React, { useState, useEffect } from 'react';
import { getSchedule } from '../../services/api';

function ScheduleManagement() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getSchedule();
      if (response.success && response.data) {
        setScheduleItems(response.data);
      } else {
        setError('Failed to load schedule');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load schedule');
      setLoading(false);
      console.error('Error loading schedule:', err);
    }
  };

  return (
    <>
      <div className="content-header">
        <h1>Schedule Management</h1>
        <p>View and manage conference schedule</p>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Conference Schedule</h2>
        </div>

        <div className="info-box">
          <p>
            <strong>Note:</strong> Schedule management is handled through the database.
            Contact the administrator to make changes to the conference schedule.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading schedule...</p>
          </div>
        )}

        {!loading && scheduleItems.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Time</th>
                  <th style={{ width: '10%' }}>Icon</th>
                  <th style={{ width: '30%' }}>Event</th>
                  <th style={{ width: '45%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {scheduleItems.map((item, index) => (
                  <tr key={item.schedule_id || index}>
                    <td data-label="TIME">
                      {item.event_time}
                      {item.end_time && ` - ${item.end_time}`}
                    </td>
                    <td data-label="ICON">{item.event_icon}</td>
                    <td data-label="EVENT"><strong>{item.event_name}</strong></td>
                    <td data-label="DESCRIPTION">{item.event_description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && scheduleItems.length === 0 && (
          <div className="empty-state">
            <p>No schedule items found.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ScheduleManagement;
