"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface IOSDatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (date: Date) => void
  selectedWeeks: number
  initialDate?: Date
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const ITEM_HEIGHT = 44

export function IOSDatePickerModal({
  isOpen,
  onClose,
  onConfirm,
  selectedWeeks,
  initialDate,
}: IOSDatePickerModalProps) {
  const today = initialDate || new Date()
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [isClosing, setIsClosing] = useState(false)

  const dayRef = useRef<HTMLDivElement>(null)
  const monthRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLDivElement>(null)

  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        document.body.style.overflow = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  const handleScroll = (type: "day" | "month" | "year") => {
    const ref = type === "day" ? dayRef : type === "month" ? monthRef : yearRef
    if (!ref.current) return

    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    const element = ref.current
    const scrollTop = element.scrollTop
    const maxDays = getDaysInMonth(selectedMonth, selectedYear)

    // Calculate the index based on scroll position
    const index = Math.round(scrollTop / ITEM_HEIGHT)

    // Update state based on type
    if (type === "day") {
      const isCurrentMonthYear = selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
      const minDay = isCurrentMonthYear ? today.getDate() : 1
      const newDay = Math.max(minDay, Math.min(maxDays, index + minDay))
      if (newDay !== selectedDay) {
        setSelectedDay(newDay)
      }
    } else if (type === "month") {
      const isCurrentYear = selectedYear === today.getFullYear()
      const minMonth = isCurrentYear ? today.getMonth() : 0
      const newMonth = Math.max(minMonth, Math.min(11, index + minMonth))
      if (newMonth !== selectedMonth) {
        setSelectedMonth(newMonth)
      }
    } else if (type === "year") {
      const minYear = today.getFullYear()
      const newYear = Math.max(minYear, Math.min(minYear + 5, minYear + index))
      if (newYear !== selectedYear) {
        setSelectedYear(newYear)
      }
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!ref.current) return
      const targetScroll = index * ITEM_HEIGHT
      ref.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      })
    }, 100)
  }

  useEffect(() => {
    if (!isOpen) return

    const initializeScroll = () => {
      if (dayRef.current) {
        const isCurrentMonthYear = selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
        const minDay = isCurrentMonthYear ? today.getDate() : 1
        dayRef.current.scrollTop = (selectedDay - minDay) * ITEM_HEIGHT
      }
      if (monthRef.current) {
        const isCurrentYear = selectedYear === today.getFullYear()
        const minMonth = isCurrentYear ? today.getMonth() : 0
        monthRef.current.scrollTop = (selectedMonth - minMonth) * ITEM_HEIGHT
      }
      if (yearRef.current) {
        yearRef.current.scrollTop = (selectedYear - today.getFullYear()) * ITEM_HEIGHT
      }
    }

    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      requestAnimationFrame(initializeScroll)
    })
  }, [isOpen])

  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth, selectedYear)
    const isCurrentMonthYear = selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
    const minDay = isCurrentMonthYear ? today.getDate() : 1
    
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays)
      if (dayRef.current) {
        dayRef.current.scrollTop = (maxDays - minDay) * ITEM_HEIGHT
      }
    } else if (selectedDay < minDay) {
      setSelectedDay(minDay)
      if (dayRef.current) {
        dayRef.current.scrollTop = 0
      }
    }
  }, [selectedMonth, selectedYear])

  const handleCancel = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleConfirmClick = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay)
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onConfirm(selectedDate)
    }, 200)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const handleItemClick = (value: number, type: "day" | "month" | "year") => {
    const ref = type === "day" ? dayRef : type === "month" ? monthRef : yearRef
    if (!ref.current) return

    let index: number
    if (type === "day") {
      const isCurrentMonthYear = selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
      const minDay = isCurrentMonthYear ? today.getDate() : 1
      index = value - minDay
    } else if (type === "month") {
      const isCurrentYear = selectedYear === today.getFullYear()
      const minMonth = isCurrentYear ? today.getMonth() : 0
      index = value - minMonth
    } else {
      index = value - today.getFullYear()
    }

    ref.current.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: "smooth",
    })
  }

  if (!isOpen && !isClosing) return null

  const maxDays = getDaysInMonth(selectedMonth, selectedYear)
  const isCurrentMonthYear = selectedMonth === today.getMonth() && selectedYear === today.getFullYear()
  const minDay = isCurrentMonthYear ? today.getDate() : 1
  const days = Array.from({ length: maxDays - minDay + 1 }, (_, i) => i + minDay)
  
  const isCurrentYear = selectedYear === today.getFullYear()
  const minMonth = isCurrentYear ? today.getMonth() : 0
  const availableMonths = MONTHS.slice(minMonth)

  const formatDate = () => {
    return `${MONTHS[selectedMonth]} ${selectedDay}, ${selectedYear}`
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isClosing ? "animate-fadeOut" : "animate-fadeIn"
        }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className={`relative w-[95vw] md:w-[90vw] lg:w-[505px] bg-white rounded-[20px] shadow-[0px_20px_60px_rgba(0,0,0,0.3)] ${isClosing ? "animate-modalOut" : "animate-modalIn"
          }`}
      >
        <div className="px-4 pt-5 pb-4 md:px-8 md:pt-8 md:pb-6 border-[#E5E7EB]">
          <h2 id="modal-title" className="font-['Public_Sans'] text-lg md:text-2xl font-bold text-[#1A1A1A] text-center">
            Please select your start date
          </h2>
        </div>

        <div className="relative px-4 py-6 h-[240px] md:px-6 md:py-10 md:h-[280px] overflow-hidden max-w-[269px] mx-auto" role="group" aria-label="Date picker">
          <div className="absolute top-10 left-0 right-0 h-[60px] bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-[44px] border-t border-b border-[#E5E7EB] pointer-events-none z-5" />

          <div className="flex justify-center items-center gap-4 h-full">
            {/* Day Wheel */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <div
                ref={dayRef}
                className="w-full h-[220px] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
                onScroll={() => handleScroll("day")}
                style={{ scrollSnapType: "y mandatory" }}
              >
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                {days.map((day) => {
                  const isSelected = day === selectedDay
                  const distance = Math.abs(day - selectedDay)
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-center cursor-pointer transition-all duration-150 snap-center ${isSelected
                        ? "text-[20px] font-semibold text-[#1A1A1A]"
                        : distance === 1
                          ? "text-[18px] font-medium text-[#6B7280] opacity-70"
                          : distance === 2
                            ? "text-[16px] font-normal text-[#9CA3AF] opacity-40"
                            : "text-[14px] font-normal text-[#D1D5DB] opacity-20"
                        }`}
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      onClick={() => handleItemClick(day, "day")}
                    >
                      {day}
                    </div>
                  )
                })}
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
              </div>
            </div>

            {/* Month Wheel */}
            <div className="flex flex-col items-center flex-1 max-w-[140px]">
              <div
                ref={monthRef}
                className="w-full h-[220px] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
                onScroll={() => handleScroll("month")}
                style={{ scrollSnapType: "y mandatory" }}
              >
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                {availableMonths.map((month, idx) => {
                  const monthIndex = minMonth + idx
                  const isSelected = monthIndex === selectedMonth
                  const distance = Math.abs(monthIndex - selectedMonth)
                  return (
                    <div
                      key={month}
                      className={`flex items-center justify-center cursor-pointer transition-all duration-150 snap-center ${isSelected
                        ? "text-[20px] font-semibold text-[#1A1A1A]"
                        : distance === 1
                          ? "text-[18px] font-medium text-[#6B7280] opacity-70"
                          : distance === 2
                            ? "text-[16px] font-normal text-[#9CA3AF] opacity-40"
                            : "text-[14px] font-normal text-[#D1D5DB] opacity-20"
                        }`}
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      onClick={() => handleItemClick(monthIndex, "month")}
                    >
                      {month}
                    </div>
                  )
                })}
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
              </div>
            </div>

            {/* Year Wheel */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <div
                ref={yearRef}
                className="w-full h-[220px] overflow-y-auto snap-y snap-mandatory scrollbar-hide"
                onScroll={() => handleScroll("year")}
                style={{ scrollSnapType: "y mandatory" }}
              >
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
                {Array.from({ length: 6 }, (_, i) => today.getFullYear() + i).map((year) => {
                  const isSelected = year === selectedYear
                  const distance = Math.abs(year - selectedYear)
                  return (
                    <div
                      key={year}
                      className={`flex items-center justify-center cursor-pointer transition-all duration-150 snap-center ${isSelected
                        ? "text-[20px] font-semibold text-[#1A1A1A]"
                        : distance === 1
                          ? "text-[18px] font-medium text-[#6B7280] opacity-70"
                          : distance === 2
                            ? "text-[16px] font-normal text-[#9CA3AF] opacity-40"
                            : "text-[14px] font-normal text-[#D1D5DB] opacity-20"
                        }`}
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      onClick={() => handleItemClick(year, "year")}
                    >
                      {year}
                    </div>
                  )
                })}
                <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F9FAFB] px-4 py-3 md:px-8 md:py-5 border-t border-b border-[#E5E7EB]">
          <p className="font-['Public_Sans'] text-xs md:text-sm text-[#6B7280] leading-[18px] md:leading-[22px] text-center">
            <span className="font-bold text-[#1A1A1A]">NB:</span> You've chosen a {selectedWeeks}-week schedule starting
            on {formatDate()}, with sessions on Mon, Tue, Thu, Fri, and Sat. We'll automatically set your end date, and
            you can renew whenever you like — no worries!
          </p>
        </div>

        <div className="h-auto p-4 md:h-[96px] md:p-[24px] flex flex-col gap-3 md:flex-row md:gap-0">
          <Button
            onClick={handleCancel}
            variant="ghost"
            className="btn-app-cancel w-full h-[44px] md:w-[225px] md:h-[48px] order-2 md:order-1">
            CANCEL
          </Button>
          <Button onClick={handleConfirmClick} className="btn-app-primary w-full h-[44px] md:w-[225px] md:h-[48px] order-1 md:order-2">
            CONFIRM
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 200ms ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 150ms ease-in forwards;
        }

        .animate-modalIn {
          animation: modalIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-modalOut {
          animation: modalOut 200ms ease-in forwards;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}
