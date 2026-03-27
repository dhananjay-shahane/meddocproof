"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn, getInitials } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Home,
  Users,
  Activity,
  Heart,
  PlaneTakeoff,
  BriefcaseMedical,
  Plane,
  ClipboardList,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  FolderOpen,
  FolderClosed,
  Stethoscope,
  Phone,
  PlusCircle,
} from "lucide-react";

const certificateDropdown = {
  label: "Certificates",
  items: [
    {
      category: "Leave Certificates",
      links: [
        { href: "/certificates/sick-leave", label: "Sick Leave Certificate", icon: FileText },
        { href: "/certificates/work-from-home", label: "Work From Home Certificate", icon: Home },
        { href: "/certificates/caretaker", label: "Caretaker Certificate", icon: Users },
        { href: "/certificates/recovery", label: "Recovery Certificate", icon: Activity },
      ],
    },
    {
      category: "Fitness & Work Status",
      links: [
        { href: "/certificates/fitness", label: "Fitness Certificate", icon: Heart },
        { href: "/certificates/fit-to-fly", label: "Fit-to-Fly Certificate", icon: PlaneTakeoff },
        { href: "/certificates/unfit-to-work", label: "Unfit To Work Certificate", icon: BriefcaseMedical },
        { href: "/certificates/unfit-to-travel", label: "Unfit To Travel Certificate", icon: Plane },
      ],
    },
    {
      category: "Medical Records",
      links: [
        { href: "/certificates/medical-diagnosis", label: "Medical Diagnosis Certificate", icon: ClipboardList },
      ],
    },
  ],
};

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Certificates", href: "#", isDropdown: true },
  { name: "Doctor Consultation", href: "/doctor-consultation" },
  { name: "About", href: "/about" },
  { name: "Sample Certificates", href: "/sample-certificates" },
  { name: "Contact Us", href: "/contact" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Leave Certificates"]);
  const [expandedDesktopCategory, setExpandedDesktopCategory] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsProfileOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const userName = user && "fullName" in user ? (user.fullName as string) : "User";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-sm",
          isScrolled
            ? "bg-white/95 shadow-lg border-gray-200"
            : "bg-white/90 border-gray-100"
        )}
      >
        <div className="mx-auto max-w-[90rem] px-4 md:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6" ref={dropdownRef}>
              {NAV_LINKS.map((link) =>
                link.isDropdown ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setExpandedDesktopCategory(null);
                    }}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap",
                        activeDropdown === link.name ||
                          certificateDropdown.items.some((group) =>
                            group.links.some((l) => isActive(l.href))
                          )
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      )}
                    >
                      {link.name}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeDropdown === link.name && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 pt-3"
                        >
                          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 min-w-64 flex">
                            {/* Categories List */}
                            <div className="space-y-1 pr-2 border-r border-gray-200">
                              {certificateDropdown.items.map((group, groupIndex) => {
                                const categoryIcons = {
                                  "Leave Certificates": FolderOpen,
                                  "Fitness & Work Status": Heart,
                                  "Medical Records": ClipboardList,
                                };
                                const CategoryIcon = categoryIcons[group.category as keyof typeof categoryIcons] || FolderClosed;
                                const isHovered = expandedDesktopCategory === group.category;
                                
                                return (
                                  <div
                                    key={groupIndex}
                                    className={cn(
                                      "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 min-w-48",
                                      isHovered
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                    )}
                                    onMouseEnter={() => setExpandedDesktopCategory(group.category)}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        isHovered ? "bg-blue-100" : "bg-gray-100"
                                      )}>
                                        <CategoryIcon className={cn("w-4 h-4", isHovered ? "text-blue-600" : "text-gray-600")} />
                                      </div>
                                      <span className="text-sm font-medium">{group.category}</span>
                                    </div>
                                    <ChevronRight className={cn(
                                      "w-4 h-4 transition-transform",
                                      isHovered && "translate-x-0.5"
                                    )} />
                                  </div>
                                );
                              })}
                              
                              {/* Apply CTA */}
                              <div className="pt-3 mt-2 border-t border-gray-200">
                                <Link
                                  href="/certificates/apply"
                                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    setExpandedDesktopCategory(null);
                                  }}
                                >
                                  <PlusCircle className="w-4 h-4" />
                                  Apply for Certificate
                                </Link>
                              </div>
                            </div>
                            
                            {/* Flyout Submenu */}
                            <AnimatePresence mode="wait">
                              {expandedDesktopCategory && (
                                <motion.div
                                  key={expandedDesktopCategory}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className="pl-4 min-w-56"
                                >
                                  <div className="space-y-1">
                                    {certificateDropdown.items
                                      .find((g) => g.category === expandedDesktopCategory)
                                      ?.links.map((item, itemIndex) => (
                                        <Link
                                          key={itemIndex}
                                          href={item.href}
                                          className={cn(
                                            "flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl transition-all duration-200",
                                            isActive(item.href)
                                              ? "bg-blue-600 text-white shadow-sm"
                                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1"
                                          )}
                                          onClick={() => {
                                            setActiveDropdown(null);
                                            setExpandedDesktopCategory(null);
                                          }}
                                        >
                                          <item.icon className="h-4 w-4 shrink-0" />
                                          <span>{item.label.replace(" Certificate", "")}</span>
                                        </Link>
                                      ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors whitespace-nowrap",
                      isActive(link.href)
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    )}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop Auth / Profile */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
              ) : isAuthenticated && user?.type === "user" ? (
                <>
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(userName)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-30 truncate">
                        {userName}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-gray-500 transition-transform",
                          isProfileOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {userName}
                          </p>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FileText className="w-4 h-4" /> My Certificates
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                        </div>

                        <div className="border-t border-gray-200 py-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/certificates/apply"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Apply
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2 rounded-lg hover:shadow-md transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile Menu — Side Drawer (outside header to avoid backdrop-filter containing block issue) */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-[9999] lg:hidden shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Logo />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-blue-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Profile Section (if logged in) */}
            {isAuthenticated && user?.type === "user" && (
              <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 text-lg font-bold">
                    {getInitials(userName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{userName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="p-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive("/")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  Home
                </Link>

                {/* Quick Actions for Logged In Users */}
                {isAuthenticated && user?.type === "user" && (
                  <>
                    <div className="pt-4 pb-2">
                      <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Actions
                      </p>
                    </div>
                    <Link
                      href="/certificates/apply"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-teal-500 text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="w-5 h-5" />
                      Apply for Certificate
                    </Link>
                    <div className="pt-4 pb-2">
                      <p className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                        My Account
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive("/profile")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FileText className="w-5 h-5" />
                      My Certificates
                    </Link>
                    <Link
                      href="/profile"
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive("/profile")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                  </>
                )}

                {/* Certificate Categories — Accordion */}
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                    Certificates
                  </p>
                </div>

                {certificateDropdown.items.map((group, groupIndex) => {
                  const isExpanded = expandedCategories.includes(group.category);
                  const itemCount = group.links.length;

                  return (
                    <div key={groupIndex} className="mb-1">
                      <button
                        onClick={() => toggleCategory(group.category)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <FolderOpen className="w-4 h-4 text-primary" />
                          ) : (
                            <FolderClosed className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span>{group.category}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {itemCount}
                          </span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          isExpanded
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="pl-4 space-y-1 mt-1">
                          {group.links.map((link, linkIndex) => (
                            <Link
                              key={linkIndex}
                              href={link.href}
                              className={cn(
                                "flex items-center gap-3 px-6 py-2.5 rounded-lg text-sm transition-colors",
                                isActive(link.href)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted"
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  isActive(link.href)
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                                )}
                              />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Other Links */}
                <div className="pt-4 border-t mt-4 space-y-1">
                  <Link
                    href="/doctor-consultation"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive("/doctor-consultation")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Stethoscope className="w-5 h-5" />
                    Doctor Consultation
                  </Link>
                  <Link
                    href="/about"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive("/about")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Activity className="w-5 h-5" />
                    About Us
                  </Link>
                  <Link
                    href="/faq"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive("/faq")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="w-5 h-5" />
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive("/contact")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="w-5 h-5" />
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="mt-6 pt-6 border-t">
                {isAuthenticated && user?.type === "user" ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-foreground border hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium text-primary-foreground bg-linear-to-r from-primary to-primary/90 hover:shadow-md transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
