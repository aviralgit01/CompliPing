'use client';

import * as React from 'react';
import { getMonth, getYear, setMonth, setYear, format } from 'date-fns';

import { CalendarIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Matcher } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Calendar } from './calendar';

interface DatePickerProps {
  label?: string;
  required?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  startYear?: number;
  endYear?: number;
  value?: Date;
  onDateChange?: (date: Date) => void;
  className?: string;
  popoverClassName?: string;
  calendarClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  align?: 'start' | 'end' | 'center';
  disabled?: Matcher | Matcher[];
}

export function DatePicker({
  label,
  required = false,
  iconLeft,
  iconRight,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  value,
  onDateChange,
  className,
  popoverClassName,
  calendarClassName,
  labelClassName,
  placeholder = 'Pick a date',
  align = 'start',
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value ?? undefined
  );

  // Separate state for calendar month view (independent of selected date)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => {
    return value ?? new Date(); // Default to current date for calendar view
  });

  const date: Date | undefined = value ?? internalDate;

  // Update internal date when value prop changes
  React.useEffect(() => {
    if (value) {
      setInternalDate(value);
      setCalendarMonth(value); // Also update calendar view
    }
  }, [value]);

  // Update calendar month when date is selected
  React.useEffect(() => {
    if (date) {
      setCalendarMonth(date);
    }
  }, [date]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse();

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    const newCalendarMonth = setMonth(calendarMonth, monthIndex);
    setCalendarMonth(newCalendarMonth);
  };

  const handleYearChange = (year: string) => {
    const newCalendarMonth = setYear(calendarMonth, parseInt(year));
    setCalendarMonth(newCalendarMonth);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      updateDate(selectedDate);
      setOpen(false);
    }
  };

  const handleCalendarMonthChange = (newMonth: Date) => {
    setCalendarMonth(newMonth);
  };

  const updateDate = (newDate: Date) => {
    if (!value) {
      setInternalDate(newDate);
    }
    onDateChange?.(newDate);
  };

  const inputId = `calendar-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={cn('flex flex-col px-0.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium transition-colors duration-200 text-neutral-700 mb-1',
            labelClassName
          )}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={inputId}
            className={cn(
              'flex h-10 w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition-all duration-200',
              'hover:border-neutral-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 !cursor-pointer ',
              !date ? 'text-neutral-500' : 'text-neutral-900'
            )}
            type='button'
            aria-haspopup='dialog'
            aria-expanded={open}
            aria-label={label || placeholder}
          >
            {iconLeft || <CalendarIcon className='h-4 w-4 text-neutral-400' />}
            <span className='flex-1 text-left'>
              {date ? format(date, 'MMM dd, yyyy') : placeholder}
            </span>
            {iconRight}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'w-auto p-0 shadow-lg border border-neutral-200 ',
            popoverClassName
          )}
          align={align}
          sideOffset={4}
          avoidCollisions={true}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          {/* Month/Year Selector Header */}
          <div className='flex justify-between gap-1 p-2 border-b border-neutral-100 bg-neutral-50/50'>
            <Select
              onValueChange={handleMonthChange}
              value={months[getMonth(calendarMonth)]}
            >
              <SelectTrigger className='w-32.5 h-9 text-sm'>
                <SelectValue placeholder='Month' />
              </SelectTrigger>
              <SelectContent className='max-h-54 overflow-auto'>
                {months.map(month => (
                  <SelectItem key={month} value={month} className='text-sm'>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYearChange}
              value={getYear(calendarMonth).toString()}
            >
              <SelectTrigger className='w-25 h-9 text-sm'>
                <SelectValue placeholder='Year' />
              </SelectTrigger>
              <SelectContent className='max-h-54'>
                {years.map(year => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className='text-sm'
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <div className={cn('p-2 pt-0 min-h-86.25', calendarClassName)}>
            <div className='bg-white border rounded-md'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={handleSelect}
                month={calendarMonth}
                onMonthChange={handleCalendarMonthChange}
                fromYear={startYear}
                toYear={endYear}
                disabled={disabled}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
