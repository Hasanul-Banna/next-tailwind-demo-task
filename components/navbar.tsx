"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navItems = [
  { label: "HOME", href: "/" },
  { label: "PROGRAMS & SERVICES", href: "/programs" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Desktop Navbar */}
      <div className="hidden lg:flex h-[112px] px-20 py-8 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/superbaseLogo.svg"
            alt="Logo"
            width={140}
            height={45}
            priority
            className="h-[45px] w-[139.87px]"
            suppressHydrationWarning
          />
        </Link>

        {/* Right Side: Navigation and Actions */}
        <div className="flex items-center gap-12">
          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-public-sans font-semibold text-[15px] leading-[15px] tracking-[0%] uppercase hover:text-black transition-colors h-[15px] ${item.label === "PROGRAMS & SERVICES" ? "text-app-black" : "text-app-gray"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions with 48px gap */}
          <div className="flex items-center gap-6">
            <button
              aria-label="Shopping cart"
              className="w-6 h-6 text-app-gray hover:text-black transition-colors cursor-pointer"
            >
              <Image src="/bag-icon.svg" alt="Shopping bag" width={24} height={24} className="w-6 h-6" suppressHydrationWarning />
            </button>
            <Button className="btn-app-primary w-[108px] h-[48px]">
              SIGN IN
            </Button>
          </div>
        </div>
      </div>

      {/* Tablet/Mobile Navbar */}
      <div className="lg:hidden flex h-[80px] px-10 md:px-10 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/superbaseLogo.svg"
            alt="Logo"
            width={120}
            height={38}
            priority
            className="h-[38px] w-[120px]"
            suppressHydrationWarning
          />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button aria-label="Shopping cart" className="w-6 h-6 text-app-gray hover:text-black transition-colors">
            <Image src="/bag-icon.svg" alt="Shopping bag" width={24} height={24} className="w-6 h-6" suppressHydrationWarning />
          </button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="w-6 h-6 text-app-gray hover:text-black transition-colors">
                <Menu className="w-6 h-6" strokeWidth={2} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] px-5 py-8">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-public-sans font-semibold text-[15px] leading-[15px] tracking-[0%] uppercase hover:text-black transition-colors ${item.label === "PROGRAMS & SERVICES" ? "text-app-black" : "text-app-gray"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button className="btn-app-primary w-full h-[48px]">
                  SIGN IN
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
