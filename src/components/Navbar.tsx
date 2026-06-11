import React, { useState, useEffect } from "react";
import { ShieldCheck, Menu, X, Code2, Sun, Moon, Languages } from "lucide-react";

interface NavbarProps {
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  accentColor: string;
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export default function Navbar({
  onAdminClick,
  isAdminLoggedIn,
  onLogout,
  accentColor,
  lang,
  setLang,
  theme,
  setTheme
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = {
    home: lang === "ar" ? "الرئيسية" : "Home",
    about: lang === "ar" ? "عني" : "About",
    skills: lang === "ar" ? "المهارات" : "Skills",
    projects: lang === "ar" ? "المشاريع" : "Projects",
    contact: lang === "ar" ? "اتصل بي" : "Contact",
    adminEntry: lang === "ar" ? "دخول المسؤول" : "Admin Panel",
    adminActive: lang === "ar" ? "المدير نشط" : "Admin Active",
    logout: lang === "ar" ? "تسجيل الخروج" : "Logout",
    logoFirst: lang === "ar" ? "معرض" : "My",
    logoSecond: lang === "ar" ? "الأعمال" : "Portfolio"
  };

  const navItems = [
    { name: t.home, href: "#hero" },
    { name: t.about, href: "#about" },
    { name: t.skills, href: "#skills" },
    { name: t.projects, href: "#projects" },
    { name: t.contact, href: "#contact" },
  ];

  const handleLangToggle = () => {
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <nav
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div 
              className="p-2 rounded-xl text-white flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300"
              style={{ backgroundColor: accentColor || "#f97316" }}
            >
              <Code2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              {t.logoFirst} <span className="text-slate-500 dark:text-slate-450">{t.logoSecond}</span>
            </span>
          </div>

          {/* Nav Items - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-355 dark:hover:text-white font-semibold text-sm transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 relative group"
              >
                {item.name}
                <span 
                  className="absolute bottom-1 left-3 right-3 h-0.5 scale-x-0 transition-transform duration-300 group-hover:scale-x-100" 
                  style={{ backgroundColor: accentColor || "#f97316" }}
                />
              </a>
            ))}
          </div>

          {/* Theme, Language, Admin Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Switch */}
            <button
              onClick={handleLangToggle}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer focus:outline-none"
              title={lang === "ar" ? "English" : "العربية"}
            >
              <Languages className="h-4 w-4" />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-600" />}
            </button>

            {/* Logout State Indicator */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-250 dark:border-emerald-500/20 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.adminActive}
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20"
                >
                  {t.logout}
                </button>
              </div>
            ) : null}

            {/* Admin toggle panel button */}
            <button
              id="admin-settings-btn"
              onClick={onAdminClick}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 border-slate-200 hover:border-slate-300 dark:border-slate-800/80 dark:hover:border-slate-600 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
              style={{ borderColor: isAdminLoggedIn ? (accentColor || "#f97316") : "" }}
            >
              <ShieldCheck className="h-4 w-4" style={{ color: isAdminLoggedIn ? (accentColor || "#f97316") : "" }} />
              {t.adminEntry}
            </button>
          </div>

          {/* Hamburger Menu & Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleLangToggle}
              className="p-2 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-emerald-400" /> : <Moon className="h-4 w-4 text-orange-500" />}
            </button>
            <button
              onClick={onAdminClick}
              className="p-2 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-300"
            >
              <ShieldCheck className="h-5 w-5" style={{ color: isAdminLoggedIn ? (accentColor || "#f97316") : "" }} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-200 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 pt-2 pb-6 space-y-2 text-right">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-755 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {item.name}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 px-3">
            {isAdminLoggedIn ? (
              <div className="flex items-center justify-between">
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.adminActive}
                </span>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20"
                >
                  {t.logout}
                </button>
              </div>
            ) : null}
            <button
              onClick={() => {
                onAdminClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <ShieldCheck className="h-4 w-4" style={{ color: isAdminLoggedIn ? (accentColor || "#f97316") : "" }} />
              {t.adminEntry}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
