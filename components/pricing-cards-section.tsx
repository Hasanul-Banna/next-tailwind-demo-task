"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { IOSDatePickerModal } from "@/components/ios-date-picker-modal";

const pricingOptions = [
  { weeks: "1 WEEK", price: "$35", days: 5, totalDays: "5 days", weeksNum: 1 },
  {
    weeks: "2 WEEKS",
    price: "$70",
    days: 10,
    totalDays: "10 days",
    weeksNum: 2,
  },
  {
    weeks: "3 WEEKS",
    price: "$105",
    days: 15,
    totalDays: "15 days",
    weeksNum: 3,
  },
  {
    weeks: "4 WEEKS",
    price: "$140",
    days: 20,
    totalDays: "20 days",
    weeksNum: 4,
  },
];

function calculateEndDate(startDate: Date, weeks: number): Date {
  const daysPerWeek = 5; // Mon-Fri only
  const totalDays = weeks * daysPerWeek;

  const endDate = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < totalDays - 1) {
    endDate.setDate(endDate.getDate() + 1);

    // Skip Saturday (6) and Sunday (0)
    const dayOfWeek = endDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return endDate;
}

export function PricingCardsSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showDateCard, setShowDateCard] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const selectedOption =
    selectedIndex !== null ? pricingOptions[selectedIndex] : null;

  const handlePlanSelect = (index: number) => {
    setSelectedIndex(index);
    setShowDateCard(true);
    // Reset dates when changing plan
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && selectedOption) {
      const calculatedEndDate = calculateEndDate(date, selectedOption.weeksNum);
      setEndDate(calculatedEndDate);
    } else {
      setEndDate(undefined);
    }
  };

  const handleStartDateClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = (date: Date) => {
    handleStartDateChange(date);
    setIsModalOpen(false);
  };

  const isNextEnabled =
    selectedIndex !== null && startDate !== undefined && endDate !== undefined;

  return (
    <>
      <section className="relative w-full px-6 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16 lg:px-16 lg:py-20 xl:px-16 xl:py-[60px] min-[1440px]:px-20 min-[1440px]:py-[60px] overflow-hidden bg-gradient-to-b from-[rgba(93,6,233,0.02)] to-[rgba(28,29,246,0.13)]">
        {/* Decorative star at top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 star-pulse">
          <Image
            src="/starSmall.svg"
            alt="Star decoration"
            width={64}
            height={64}
            priority
            suppressHydrationWarning
          />
        </div>

        {/* Decorative shark mascot bottom left */}
        <div className="absolute opacity-100 w-[211px] h-[228px] bottom-0 left-[67px]">
          <Image src="/shark.svg" alt="Shark mascot" width={211} height={228} suppressHydrationWarning />
        </div>

        {/* Decorative star right side */}
        <div className="absolute top-2/3 right-12 -translate-y-1/2 w-16 h-16">
          <Image
            src="/starBig.svg"
            alt="Star decoration"
            width={64}
            height={64}
            suppressHydrationWarning
          />
        </div>

        <div className="relative max-w-[1280px] mx-auto">
          {/* Back Navigation */}
          <button className="flex items-center gap-2 mb-6 text-[#555555] opacity-80 hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-['Public_Sans'] text-[15px] font-light leading-[15px]">
              Regular aftercare program
            </span>
          </button>

          {/* Heading Section */}
          <div className="mb-12">
            <h1 className="font-['Public_Sans'] text-[32px] font-medium text-[#070012] leading-[32px] mb-2">
              How many weeks you like to continue?
            </h1>
            <p className="font-['Public_Sans'] text-[15px] font-light text-[#555555] leading-[15px]">
              Based on your selection Mon, Tue, Thu, Fri, Sat
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {pricingOptions.map((option, index) => (
              <Card
                key={index}
                className={`relative p-6 rounded-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 w-full 2xl:w-[307.5px] 2xl:h-[199px] border-2 border-transparent bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.06)] hover:border-[#6366F1] hover:shadow-[0px_8px_30px_rgba(99,102,241,0.15)]`}
                onClick={() => handlePlanSelect(index)}
                role="radio"
                aria-checked={selectedIndex === index}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePlanSelect(index);
                  }
                  if (
                    e.key === "ArrowRight" &&
                    index < pricingOptions.length - 1
                  ) {
                    handlePlanSelect(index + 1);
                  }
                  if (e.key === "ArrowLeft" && index > 0) {
                    handlePlanSelect(index - 1);
                  }
                }}
              >
                {/* Radio Button */}
                <div className="absolute top-6 right-6">
                  <div
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all ${
                      selectedIndex === index
                        ? "bg-[#852DFE] border-[#852DFE]"
                        : "bg-white border border-[#DDDDDD]"
                    }`}
                  >
                    {selectedIndex === index && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>

                {/* Calendar Illustration */}
                <div className="flex justify-center">
                  <div className="w-[100px] h-[100px] relative">
                    <Image
                      src={`/cartoon-calendar-schedule-week.svg`}
                      alt={`${option.weeks} calendar illustration`}
                      width={100}
                      height={100}
                      className="object-contain calendar-float"
                      priority
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="text-center">
                  <h3 className="font-['Public_Sans'] text-[15px] font-medium text-[#070012] uppercase leading-[12px] mb-2">
                    {option.weeks}
                  </h3>
                  <p className="font-['Public_Sans'] text-[13px] font-light text-[#555555] leading-[15px]">
                    {option.price} for {option.totalDays}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {showDateCard && selectedOption && (
            <div className="mb-8 date-card-slide-in">
              <Card className="bg-white rounded-2xl p-10 shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
                {/* Header */}
                <div className="text-center mb-10">
                  <h2 className="font-['Public_Sans'] text-2xl font-bold text-[#1A1A1A] mb-2">
                    {selectedOption.weeks}
                  </h2>
                  <p className="font-['Public_Sans'] text-base font-normal text-[#666666]">
                    ({selectedOption.weeksNum} Weeks X 5 Days) ={" "}
                    {selectedOption.days} Days
                  </p>
                </div>

                {/* Date Input Fields */}
                <div
                  className={`grid gap-6 ${
                    startDate ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {/* Start Date Input */}
                  <fieldset className="relative">
                    {startDate && (
                      <legend
                        className="font-['Public_Sans'] text-sm font-medium text-[#374151] px-1 ml-3 bg-white z-[100] relative"
                        style={{ marginBottom: "-10px" }}
                      >
                        Start date
                      </legend>
                    )}
                    <button
                      onClick={handleStartDateClick}
                      className={`w-full h-14 px-5 rounded-sm border-2 flex items-center justify-between transition-all ${
                        startDate
                          ? "border-[#6366F1] bg-[#F8F9FF]"
                          : "border-[#E5E7EB] bg-white hover:border-[#6366F1]"
                      } focus:outline-none focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10`}
                      aria-label="Select start date"
                      aria-describedby="start-date-helper"
                    >
                      <span
                        className={`font-['Public_Sans'] text-base ${
                          startDate
                            ? "font-medium text-[#1A1A1A]"
                            : "font-normal text-[#9CA3AF]"
                        }`}
                      >
                        {isHydrated && startDate
                          ? format(startDate, "MM/dd/yyyy")
                          : "Start date"}
                      </span>
                      <Image
                        src="/calenderIcon.svg"
                        alt="Calendar"
                        width={20}
                        height={20}
                      />
                    </button>
                  </fieldset>

                  {/* End Date Input (Read-only) - Only shown when date is selected */}
                  {startDate && (
                    <fieldset className="relative">
                      <legend
                        className="font-['Public_Sans'] text-sm font-medium text-[#374151] px-1 ml-3 bg-white z-[100] relative"
                        style={{ marginBottom: "-10px" }}
                      >
                        End date
                      </legend>
                      <div
                        className="w-full h-14 px-5 rounded-sm border-2 border-[#E5E7EB] bg-[#F3F4F6] flex items-center justify-between cursor-not-allowed opacity-70"
                        aria-label="End date (automatically calculated)"
                        aria-readonly="true"
                      >
                        <span className="font-['Public_Sans'] text-base font-medium text-[#6B7280]">
                          {isHydrated && endDate
                            ? format(endDate, "MM/dd/yyyy")
                            : "End date"}
                        </span>
                        <Image
                          src="/calenderIcon.svg"
                          alt="Calendar"
                          width={20}
                          height={20}
                        />
                      </div>
                    </fieldset>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Bottom Section */}
        </div>

        {selectedOption && (
          <IOSDatePickerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleModalConfirm}
            selectedWeeks={selectedOption.weeksNum}
            initialDate={startDate}
          />
        )}
      </section>
      {/* Selected Summary section*/}
      <div className="bg-white border-t border-[#E5E7EB] px-6 sm:px-8 md:px-12 lg:px-[80px] py-6 sm:py-8 md:py-[32px] rounded-lg flex flex-row items-center justify-between gap-4 sm:gap-6 flex-wrap">
        <div className="font-['Public_Sans'] text-sm sm:text-base md:text-lg font-bold text-[#1A1A1A] uppercase text-left">
          {selectedOption
            ? `${
                selectedOption.price
              } FOR ${selectedOption.totalDays.toUpperCase()} (1 ACTIVITY PER DAY)`
            : "PLEASE SELECT A PRICING OPTION"}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-end">
          <Button variant="ghost" className="font-semibold h-[40px] sm:h-[48px] text-sm sm:text-base">
            BACK
          </Button>
          <Button
            disabled={!isNextEnabled}
            className="h-[40px] sm:h-[48px] text-sm sm:text-base"
            aria-label="Proceed to next step"
            aria-disabled={!isNextEnabled}
          >
            NEXT
          </Button>
        </div>
      </div>
    </>
  );
}
