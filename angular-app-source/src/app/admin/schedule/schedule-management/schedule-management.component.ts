import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ScheduleItem } from '../../../models/api-models';

interface IconOption {
  emoji: string;
  label: string;
}

@Component({
  selector: 'app-schedule-management',
  standalone: false,
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.css']
})
export class ScheduleManagementComponent implements OnInit {
  scheduleItems = signal<ScheduleItem[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  timeErrors = signal<Map<number, string>>(new Map());

  // Available icons for selection
  availableIcons: IconOption[] = [
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  /**
   * Load schedule from API
   */
  loadSchedule(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getScheduleAdmin().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.scheduleItems.set(response.data);
        } else {
          this.error.set(response.message || 'Failed to load schedule');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading schedule: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  /**
   * Add new time slot
   */
  addTimeSlot(): void {
    const newItem: ScheduleItem = {
      event_time: '',
      end_time: '',
      event_name: '',
      event_icon: '📋',
      event_description: '',
      display_order: this.scheduleItems().length + 1,
      is_active: true
    };

    this.scheduleItems.update(items => [...items, newItem]);
  }

  /**
   * Remove time slot
   */
  removeTimeSlot(index: number): void {
    this.scheduleItems.update(items => {
      const newItems = items.filter((_, i) => i !== index);
      // Resequence display_order
      return newItems.map((item, i) => ({
        ...item,
        display_order: i + 1
      }));
    });

    // Clear any error for this index
    this.timeErrors.update(errors => {
      const newErrors = new Map(errors);
      newErrors.delete(index);
      return newErrors;
    });
  }

  /**
   * Sort schedule by time
   */
  sortByTime(): void {
    this.scheduleItems.update(items => {
      const sorted = [...items].sort((a, b) => {
        const timeA = this.parseTime(a.event_time);
        const timeB = this.parseTime(b.event_time);
        return timeA - timeB;
      });

      // Resequence display_order after sorting
      return sorted.map((item, i) => ({
        ...item,
        display_order: i + 1
      }));
    });
  }

  /**
   * Parse time string to minutes for sorting
   */
  private parseTime(timeStr: string): number {
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
  }

  /**
   * Validate time format
   */
  private validateTimeFormat(timeStr: string): boolean {
    if (!timeStr) return false;

    // Valid formats: "9:00 AM", "10:30 PM", "12:00 PM"
    const timePattern = /^(1[0-2]|[1-9]):([0-5]\d)\s*(AM|PM)$/i;
    return timePattern.test(timeStr);
  }

  /**
   * Update time (no auto-sort while typing)
   */
  onTimeChange(index: number, newTime: string): void {
    this.scheduleItems.update(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], event_time: newTime };
      return newItems;
    });

    // Clear validation error while typing
    this.timeErrors.update(errors => {
      const newErrors = new Map(errors);
      newErrors.delete(index);
      return newErrors;
    });
  }

  /**
   * Update end time
   */
  onEndTimeChange(index: number, newTime: string): void {
    this.scheduleItems.update(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], end_time: newTime };
      return newItems;
    });

    // Clear validation error while typing
    this.timeErrors.update(errors => {
      const newErrors = new Map(errors);
      newErrors.delete(index);
      return newErrors;
    });
  }

  /**
   * Handle time input blur - validate and sort
   */
  onTimeBlur(index: number, timeStr: string): void {
    if (timeStr && !this.validateTimeFormat(timeStr)) {
      // Set validation error
      this.timeErrors.update(errors => {
        const newErrors = new Map(errors);
        newErrors.set(index, 'Invalid format. Use: 9:00 AM or 2:30 PM');
        return newErrors;
      });
    } else {
      // Clear error, check conflicts, and sort
      this.timeErrors.update(errors => {
        const newErrors = new Map(errors);
        newErrors.delete(index);
        return newErrors;
      });

      // Check for time conflicts
      this.checkTimeConflicts(index);

      // Sort after user finishes editing
      if (timeStr) {
        this.sortByTime();
      }
    }
  }

  /**
   * Handle end time input blur - validate and check conflicts
   */
  onEndTimeBlur(index: number, timeStr: string): void {
    if (timeStr && !this.validateTimeFormat(timeStr)) {
      // Set validation error
      this.timeErrors.update(errors => {
        const newErrors = new Map(errors);
        newErrors.set(index, 'Invalid format. Use: 9:00 AM or 2:30 PM');
        return newErrors;
      });
    } else {
      // Clear error and check conflicts
      this.timeErrors.update(errors => {
        const newErrors = new Map(errors);
        newErrors.delete(index);
        return newErrors;
      });

      // Check for time conflicts
      this.checkTimeConflicts(index);
    }
  }

  /**
   * Check for time conflicts with other events
   */
  private checkTimeConflicts(index: number): void {
    const items = this.scheduleItems();
    const currentItem = items[index];

    if (!currentItem.event_time || !currentItem.end_time) {
      return; // Skip if either time is empty
    }

    const currentStart = this.parseTime(currentItem.event_time);
    const currentEnd = this.parseTime(currentItem.end_time);

    // Check if end time is before start time
    if (currentEnd <= currentStart) {
      this.timeErrors.update(errors => {
        const newErrors = new Map(errors);
        newErrors.set(index, 'End time must be after start time');
        return newErrors;
      });
      return;
    }

    // Check for conflicts with other events
    for (let i = 0; i < items.length; i++) {
      if (i === index) continue; // Skip self

      const otherItem = items[i];
      if (!otherItem.event_time || !otherItem.end_time) continue;

      const otherStart = this.parseTime(otherItem.event_time);
      const otherEnd = this.parseTime(otherItem.end_time);

      // Check for overlap: events overlap if one starts before the other ends
      const hasOverlap = (currentStart < otherEnd && currentEnd > otherStart);

      if (hasOverlap) {
        this.timeErrors.update(errors => {
          const newErrors = new Map(errors);
          newErrors.set(index, `Time conflict with "${otherItem.event_name || 'event ' + (i + 1)}"`);
          return newErrors;
        });
        return;
      }
    }
  }

  /**
   * Get time error for specific index
   */
  getTimeError(index: number): string | undefined {
    return this.timeErrors().get(index);
  }

  /**
   * Update event name
   */
  onEventNameChange(index: number, newName: string): void {
    this.scheduleItems.update(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], event_name: newName };
      return newItems;
    });
  }

  /**
   * Update event icon
   */
  onEventIconChange(index: number, newIcon: string): void {
    this.scheduleItems.update(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], event_icon: newIcon };
      return newItems;
    });
  }

  /**
   * Update event description
   */
  onEventDescriptionChange(index: number, newDescription: string): void {
    this.scheduleItems.update(items => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], event_description: newDescription };
      return newItems;
    });
  }

  /**
   * Check if schedule has validation errors
   */
  hasValidationErrors(): boolean {
    return this.timeErrors().size > 0;
  }

  /**
   * Validate all times before save
   */
  validateAllTimes(): boolean {
    let hasErrors = false;
    const newErrors = new Map<number, string>();

    this.scheduleItems().forEach((item, index) => {
      if (item.event_time && !this.validateTimeFormat(item.event_time)) {
        newErrors.set(index, 'Invalid format. Use: 9:00 AM or 2:30 PM');
        hasErrors = true;
      }
    });

    this.timeErrors.set(newErrors);
    return !hasErrors;
  }

  /**
   * Save entire schedule
   */
  saveSchedule(): void {
    // Validate all times first
    if (!this.validateAllTimes()) {
      this.error.set('Please fix invalid time formats before saving');
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    // Ensure all items have display_order set correctly
    const itemsToSave = this.scheduleItems().map((item, index) => ({
      ...item,
      display_order: index + 1
    }));

    this.apiService.saveSchedule(itemsToSave).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.scheduleItems.set(response.data);
          this.successMessage.set('Schedule saved successfully!');

          // Clear success message after 3 seconds
          setTimeout(() => this.successMessage.set(null), 3000);
        } else {
          this.error.set(response.message || 'Failed to save schedule');
        }
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set('Error saving schedule: ' + err.message);
        this.saving.set(false);
      }
    });
  }
}
