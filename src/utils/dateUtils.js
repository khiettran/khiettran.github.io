import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  parseISO,
  differenceInDays,
  setMonth,
  setYear,
  startOfMonth,
  endOfMonth,
  isBefore,
  isSameDay,
  isAfter,
  addDays,
} from 'date-fns'

export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  return format(date, formatString)
}

export const getWeekDays = (startDate) => {
  const weekDays = []
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    weekDays.push({
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      formattedDate: format(date, 'yyyy-MM-dd'),
    })
  }

  return weekDays
}

export const getNextWeek = (date) => {
  return addWeeks(date, 1)
}

export const getPreviousWeek = (date) => {
  return subWeeks(date, 1)
}

export const calculateDuration = (startDate, endDate) => {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  return differenceInDays(end, start)
}

export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = typeof date === 'string' ? parseISO(date) : date
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  return checkDate >= start && checkDate <= end
}

export const getFormattedDateRange = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
}

export const changeMonth = (date, targetMonth) => {
  return setMonth(date, targetMonth)
}

export const changeYear = (date, targetYear) => {
  return setYear(date, targetYear)
}

export const getMonthDateRange = (date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return { start, end }
}

export const checkDateRangeOverlap = (startA, endA, startB, endB) => {
  const rangeAStartsBeforeRangeBEnds = isBefore(startA, endB) || isSameDay(startA, endB)
  const rangeAEndsAfterRangeBStarts = isAfter(endA, startB) || isSameDay(endA, startB)

  return rangeAStartsBeforeRangeBEnds && rangeAEndsAfterRangeBStarts
}
