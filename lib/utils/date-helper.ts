// =============================================
// DATE HELPER UTILITY - TypeScript Version
// =============================================

import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';

/**
 * Date range object with string and Date representations
 */
export interface DateRange {
  from: string; // YYYY-MM-DD format
  to: string; // YYYY-MM-DD format
  fromDate: Date; // Date object
  toDate: Date; // Date object
}

/**
 * Check-in data payload for API
 */
export interface CheckInData {
  check_in: string; // ISO string
}

/**
 * Check-out data payload for API
 */
export interface CheckOutData {
  attendance_id: string;
  check_out: string; // ISO string
}

/**
 * Attendance query parameters for API
 */
export interface AttendanceQuery {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

/**
 * Comprehensive display formatting options
 */
export interface DisplayFormat {
  // Combined formats
  date: string; // "Jun 10, 2025"
  time: string; // "9:30 AM"
  full: string; // "6/10/2025, 9:30:00 AM"
  dayName: string; // "Tuesday"

  // Individual components
  year: string; // "2025"
  month: string; // "June"
  monthShort: string; // "Jun"
  monthNumber: string; // "06"
  day: string; // "10"
  dayShort: string; // "Tue"

  // Time components
  hour12: string; // "9"
  hour24: string; // "21"
  minute: string; // "30"
  second: string; // "45"
  ampm: string; // "AM"

  // Common patterns
  dateOnly: string; // "2025-06-10"
  timeOnly: string; // "21:30:45"
  datetime: string; // "2025-06-10 21:30:45"
  relative: string; // "Today", "Yesterday", "2 days ago"
}

/**
 * Input types that can be converted to Date
 */
export type DateInput = Date | string | number | undefined;

export class DateHelper {
  // =============================================
  // CORE DATE FORMATTING METHODS
  // =============================================

  /**
   * Convert any date to local YYYY-MM-DD format
   * Preserves the calendar day in the user's time zone.
   * @param date - Input date
   * @returns Date in YYYY-MM-DD format based on local time
   */
  static toLocalDateOnly(date: DateInput): string {
    if (!date) return '';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', date);
      return '';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Convert any date to YYYY-MM-DD format (UTC based)
   * @param date - Input date
   * @returns Date in YYYY-MM-DD format
   */
  static toDateString(date: DateInput): string {
    if (!date) return '';

    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', date);
      return '';
    }

    // Convert to YYYY-MM-DD format using UTC to avoid timezone issues
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Convert any date to ISO string (for backend storage)
   * @param date - Input date
   * @returns ISO string in UTC
   */
  static toISOString(date: DateInput): string {
    if (!date) return '';

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided:', date);
      return '';
    }

    return dateObj.toISOString();
  }

  /**
   * Get current date in YYYY-MM-DD format
   * @returns Today's date
   */
  static today(): string {
    return this.toDateString(new Date());
  }

  /**
   * Get current timestamp as ISO string
   * @returns Current timestamp
   */
  static now(): string {
    return new Date().toISOString();
  }

  // =============================================
  // MONTH RANGE METHODS
  // =============================================

  /**
   * Get month's first and last day
   * @param date - Any date in the target month
   * @returns Month range object
   */
  static getMonthRange(date: DateInput): DateRange {
    const dateObj = new Date(date || new Date());
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    // Create dates in UTC to avoid timezone issues
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0)); // Last day of month

    return {
      from: this.toDateString(firstDay),
      to: this.toDateString(lastDay),
      fromDate: firstDay,
      toDate: lastDay,
    };
  }

  /**
   * Get current month range
   * @returns Current month's range
   */
  static getCurrentMonthRange(): DateRange {
    return this.getMonthRange(new Date());
  }

  /**
   * Get previous month range
   * @param date - Reference date
   * @returns Previous month's range
   */
  static getPreviousMonthRange(date: DateInput = new Date()): DateRange {
    // Get the first and last date of the previous month
    const prevMonthStart = startOfMonth(subMonths(date, 1));
    const prevMonthEnd = endOfMonth(subMonths(date, 1));

    const formattedStart = format(prevMonthStart, 'yyyy-MM-dd');
    const formattedEnd = format(prevMonthEnd, 'yyyy-MM-dd');
    // const dateObj = new Date(date || new Date());
    // dateObj.setMonth(dateObj.getMonth() - 1);
    return {
      from: formattedStart,
      to: formattedEnd,
      fromDate: prevMonthStart,
      toDate: prevMonthEnd,
    } as DateRange;
  }

  /**
   * Get next month range
   * @param date - Reference date
   * @returns Next month's range
   */
  static getNextMonthRange(date: DateInput = new Date()): DateRange {
    const dateObj = new Date(date || new Date());
    dateObj.setMonth(dateObj.getMonth() + 1);
    return this.getMonthRange(dateObj);
  }

  // =============================================
  // WEEK RANGE METHODS
  // =============================================

  /**
   * Get week range (Sunday to Saturday)
   * @param date - Any date in the target week
   * @returns Week range
   */
  static getWeekRange(date: DateInput): DateRange {
    const dateObj = new Date(date || new Date());
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate Sunday of this week
    const sunday = new Date(dateObj);
    sunday.setDate(dateObj.getDate() - dayOfWeek);

    // Calculate Saturday of this week
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    return {
      from: this.toDateString(sunday),
      to: this.toDateString(saturday),
      fromDate: sunday,
      toDate: saturday,
    };
  }

  // =============================================
  // DATE MANIPULATION METHODS
  // =============================================

  /**
   * Add/subtract days from a date
   * @param date - Base date
   * @param days - Days to add (positive) or subtract (negative)
   * @returns New date in YYYY-MM-DD format
   */
  static addDays(date: DateInput, days: number): string {
    const dateObj = new Date(date || new Date());
    dateObj.setDate(dateObj.getDate() + days);
    return this.toDateString(dateObj);
  }

  /**
   * Add/subtract months from a date
   * @param date - Base date
   * @param months - Months to add (positive) or subtract (negative)
   * @returns New date in YYYY-MM-DD format
   */
  static addMonths(date: DateInput, months: number): string {
    const dateObj = new Date(date || new Date());
    dateObj.setMonth(dateObj.getMonth() + months);
    return this.toDateString(dateObj);
  }

  /**
   * Add/subtract years from a date
   * @param date - Base date
   * @param years - Years to add (positive) or subtract (negative)
   * @returns New date in YYYY-MM-DD format
   */
  static addYears(date: DateInput, years: number): string {
    const dateObj = new Date(date || new Date());
    dateObj.setFullYear(dateObj.getFullYear() + years);
    return this.toDateString(dateObj);
  }

  // =============================================
  // VALIDATION METHODS
  // =============================================

  /**
   * Check if date is today
   * @param date - Date to check
   * @returns True if date is today
   */
  static isToday(date: DateInput): boolean {
    return this.toDateString(date) === this.today();
  }

  /**
   * Check if date is in the past
   * @param date - Date to check
   * @returns True if date is in the past
   */
  static isPast(date: DateInput): boolean {
    return this.toDateString(date) < this.today();
  }

  /**
   * Check if date is in the future
   * @param date - Date to check
   * @returns True if date is in the future
   */
  static isFuture(date: DateInput): boolean {
    return this.toDateString(date) > this.today();
  }

  /**
   * Check if two dates are the same day
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are the same day
   */
  static isSameDay(date1: DateInput, date2: DateInput): boolean {
    return this.toDateString(date1) === this.toDateString(date2);
  }

  /**
   * Check if date is valid
   * @param date - Date to check
   * @returns True if date is valid
   */
  static isValid(date: DateInput): boolean {
    if (!date) return false;
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }

  // =============================================
  // ENHANCED DISPLAY FORMATTING METHODS
  // =============================================

  /**
   * Get relative time description
   * @param date - Date to compare
   * @returns Relative description like "Today", "Yesterday", "2 days ago"
   */
  static getRelativeTime(date: DateInput): string {
    if (!date) return '';

    const dateObj = new Date(date);
    const today = new Date();
    const diffTime = today.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === -1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays < -1 && diffDays >= -7) return `In ${Math.abs(diffDays)} days`;
    if (diffDays > 7 && diffDays <= 30)
      return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < -7 && diffDays >= -30)
      return `In ${Math.floor(Math.abs(diffDays) / 7)} weeks`;

    return this.formatForDisplay(date).date;
  }

  /**
   * Comprehensive date formatting with all possible variations
   * @param date - Date to format
   * @param timezone - User's timezone (optional)
   * @returns Complete display format object
   */
  static formatForDisplay(date: DateInput, timezone?: string): DisplayFormat {
    if (!date) {
      return {
        date: '',
        time: '',
        full: '',
        dayName: '',
        year: '',
        month: '',
        monthShort: '',
        monthNumber: '',
        day: '',
        dayShort: '',
        hour12: '',
        hour24: '',
        minute: '',
        second: '',
        ampm: '',
        dateOnly: '',
        timeOnly: '',
        datetime: '',
        relative: '',
      };
    }

    const dateObj = new Date(date);
    const userTimezone =
      timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Basic formats
    const basicDate = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const basicTime = dateObj.toLocaleTimeString('en-US', {
      timeZone: userTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const fullDateTime = dateObj.toLocaleString('en-US', {
      timeZone: userTimezone,
    });

    // Individual components
    const year = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
    });

    const month = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      month: 'long',
    });

    const monthShort = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      month: 'short',
    });

    const monthNumber = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      month: '2-digit',
    });

    const day = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      day: '2-digit',
    });

    const dayName = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      weekday: 'long',
    });

    const dayShort = dateObj.toLocaleDateString('en-US', {
      timeZone: userTimezone,
      weekday: 'short',
    });

    // Time components
    const hour12 = dateObj
      .toLocaleTimeString('en-US', {
        timeZone: userTimezone,
        hour: 'numeric',
        hour12: true,
      })
      .replace(/\s?(AM|PM)/, '');

    const hour24 = dateObj.toLocaleTimeString('en-US', {
      timeZone: userTimezone,
      hour: '2-digit',
      hour12: false,
    });

    const minute = dateObj.toLocaleTimeString('en-US', {
      timeZone: userTimezone,
      minute: '2-digit',
    });

    const second = dateObj.toLocaleTimeString('en-US', {
      timeZone: userTimezone,
      second: '2-digit',
    });

    const ampm = dateObj
      .toLocaleTimeString('en-US', {
        timeZone: userTimezone,
        hour12: true,
      })
      .replace(/.*\s/, '');

    // Custom formats
    const dateOnly = this.toDateString(dateObj);
    const timeOnly = `${hour24}:${minute}:${second}`;
    const datetime = `${dateOnly} ${timeOnly}`;
    const relative = this.getRelativeTime(dateObj);

    return {
      // Combined formats
      date: basicDate,
      time: basicTime,
      full: fullDateTime,
      dayName,

      // Individual components
      year,
      month,
      monthShort,
      monthNumber,
      day,
      dayShort,

      // Time components
      hour12: hour12,
      hour24: hour24.split(':')[0],
      minute: minute,
      second: second,
      ampm,

      // Custom patterns
      dateOnly,
      timeOnly,
      datetime,
      relative,
    };
  }

  /**
   * Format only the year
   * @param date - Date to format
   * @param timezone - User's timezone (optional)
   * @returns Year as string (e.g., "2025")
   */
  static formatYear(date: DateInput, timezone?: string): string {
    return this.formatForDisplay(date, timezone).year;
  }

  /**
   * Format only the month
   * @param date - Date to format
   * @param short - Use short format (Jun) vs long (June)
   * @param timezone - User's timezone (optional)
   * @returns Month as string
   */
  static formatMonth(
    date: DateInput,
    short: boolean = false,
    timezone?: string
  ): string {
    const format = this.formatForDisplay(date, timezone);
    return short ? format.monthShort : format.month;
  }

  /**
   * Format only the day
   * @param date - Date to format
   * @param timezone - User's timezone (optional)
   * @returns Day as string (e.g., "10")
   */
  static formatDay(date: DateInput, timezone?: string): string {
    return this.formatForDisplay(date, timezone).day;
  }

  /**
   * Format only the day name
   * @param date - Date to format
   * @param short - Use short format (Tue) vs long (Tuesday)
   * @param timezone - User's timezone (optional)
   * @returns Day name as string
   */
  static formatDayName(
    date: DateInput,
    short: boolean = false,
    timezone?: string
  ): string {
    const format = this.formatForDisplay(date, timezone);
    return short ? format.dayShort : format.dayName;
  }

  /**
   * Format only the time
   * @param date - Date to format
   * @param format24h - Use 24-hour format
   * @param timezone - User's timezone (optional)
   * @returns Time as string
   */
  static formatTime(
    date: DateInput,
    format24h: boolean = false,
    timezone?: string
  ): string {
    const format = this.formatForDisplay(date, timezone);
    return format24h ? format.timeOnly : format.time;
  }

  // =============================================
  // BACKEND COMMUNICATION HELPERS
  // =============================================

  /**
   * Prepare date for check-in API call
   * @returns Check-in payload
   */
  static prepareCheckInData(): CheckInData {
    return {
      check_in: this.now(),
    };
  }

  /**
   * Prepare date for check-out API call
   * @param attendanceId - Attendance record ID
   * @returns Check-out payload
   */
  static prepareCheckOutData(attendanceId: string): CheckOutData {
    return {
      attendance_id: attendanceId,
      check_out: this.now(),
    };
  }

  /**
   * Prepare date range for attendance API call
   * @param date - Reference date for month
   * @returns API parameters
   */
  static prepareAttendanceQuery(date: DateInput = new Date()): AttendanceQuery {
    const range = this.getMonthRange(date);
    return {
      from: range.from,
      to: range.to,
    };
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  /**
   * Get start of day in UTC
   * @param date - Input date
   * @returns Start of day as Date object
   */
  static startOfDay(date: DateInput): Date {
    const dateObj = new Date(date || new Date());
    return new Date(
      Date.UTC(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
  }

  /**
   * Get end of day in UTC
   * @param date - Input date
   * @returns End of day as Date object
   */
  static endOfDay(date: DateInput): Date {
    const dateObj = new Date(date || new Date());
    return new Date(
      Date.UTC(
        dateObj.getUTCFullYear(),
        dateObj.getUTCMonth(),
        dateObj.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
  }

  /**
   * Parse date string to Date object
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(`${dateString}T00:00:00.000Z`);
  }

  /**
   * Get difference between two dates in days
   * @param date1 - First date
   * @param date2 - Second date
   * @returns Difference in days (positive if date1 > date2)
   */
  static diffInDays(date1: DateInput, date2: DateInput): number {
    if (!date1 || !date2) return 0;

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d1.getTime() - d2.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get age from birthdate
   * @param birthDate - Birth date
   * @returns Age in years
   */
  static getAge(birthDate: DateInput): number {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  static toUTCISOStringAtMidnight(date: string | Date): string {
    const inputDate =
      typeof date === 'string'
        ? new Date(date)
        : new Date(this.toDateString(date));

    const utcDate = new Date(
      Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      )
    );

    return utcDate.toISOString(); // Always returns in UTC
  }
}

export default DateHelper;
