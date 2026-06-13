import React, { useState, useEffect } from "react";
import { ShieldCheck, Menu, X, Code2, Languages } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  accentColor: string;
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
  avatarUrl?: string;
}

export default function Navbar({
  onAdminClick,
  isAdminLoggedIn,
  onLogout,
  accentColor,
  lang,
  setLang,
  avatarUrl
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

  return (
    <>
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
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Logo Avatar" 
                  className="h-10 w-10 rounded-xl object-cover border-2 shadow-lg transform hover:rotate-12 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  style={{ borderColor: accentColor || "#f97316" }}
                />
              ) : (
                <div 
                  className="p-2 rounded-xl text-white flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300"
                  style={{ backgroundColor: accentColor || "#f97316" }}
                >
                  <Code2 className="h-6 w-6" />
                </div>
              )}
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
                className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                {lang === "ar" ? "EN" : "عربي"}
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer pointer-events-auto"
              >
                <Menu className="h-5 w-5 pointer-events-none" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Advanced Mobile Sidebar Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] md:hidden flex overflow-hidden lg:hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
            {/* Backdrop Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer pointer-events-auto z-10"
            />

            {/* Sliding Drawer Cover Panel */}
            <motion.div
              initial={{ x: lang === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`absolute inset-y-0 w-[290px] max-w-[85vw] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between z-20 pointer-events-auto ${
                lang === "ar" ? "right-0 border-l" : "left-0 border-r"
              }`}
            >
              <div>
                {/* Header block with Logo and Close trigger */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6 font-sans">
                  <div className="flex items-center gap-2">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Logo Avatar" 
                        className="h-9 w-9 rounded-lg object-cover border shadow-sm"
                        referrerPolicy="no-referrer"
                        style={{ borderColor: accentColor || "#f97316" }}
                      />
                    ) : (
                      <div 
                        className="p-2 rounded-lg text-white flex items-center justify-center font-sans"
                        style={{ backgroundColor: accentColor || "#f97316" }}
                      >
                        <Code2 className="h-5 w-5" />
                      </div>
                    )}
                    <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                      {t.logoFirst} <span className="text-slate-450">{t.logoSecond}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/50 cursor-pointer pointer-events-auto z-30"
                  >
                    <X className="h-5 w-5 pointer-events-none" />
                  </button>
                </div>

                {/* Animated Navigation Items Links Stack */}
                <div className="space-y-1.5 font-sans">
                  {navItems.map((item, idx) => (
                    <motion.a
                      initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all text-right rtl:text-right ltr:text-left pointer-events-auto"
                    >
                      <span>{item.name}</span>
                      <span 
                        className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: accentColor || "#f97316" }}
                      />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Setting controls, Admin panel entries and custom states inside drawer footer */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80 font-sans">
                {/* Admin Status Block */}
                {isAdminLoggedIn && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <span className="text-xs text-emerald-650 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.adminActive}
                    </span>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-400 transition-colors bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
                    >
                      {t.logout}
                    </button>
                  </div>
                )}

                {/* Admin Dashboard Action Trigger */}
                <button
                  onClick={() => {
                    onAdminClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold px-4 py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer pointer-events-auto"
                  style={{ borderColor: isAdminLoggedIn ? (accentColor || "#f97316") : "" }}
                >
                  <ShieldCheck className="h-4 w-4" style={{ color: isAdminLoggedIn ? (accentColor || "#f97316") : "" }} />
                  {t.adminEntry}
                </button>

                {/* Quick Info / branding footer */}
                <p className="text-[10px] text-center font-mono text-slate-400 dark:text-slate-500 select-none">
                  © {new Date().getFullYear()} {t.logoFirst} {t.logoSecond}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
