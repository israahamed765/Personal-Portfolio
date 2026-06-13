import { useState, useEffect, lazy, Suspense } from "react";
import defaultPortfolio from "./data/portfolio-default.json";
import { PortfolioData } from "./types";

// Dynamic component lazy loading for pristine performance
const Navbar = lazy(() => import("./components/Navbar"));
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const Contact = lazy(() => import("./components/Contact"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolio as PortfolioData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState<"ar" | "en">(encodeURI(localStorage.getItem("portfolio_lang") || "ar") as "ar" | "en");

  // Sync language attribute to document roots
  useEffect(() => {
    localStorage.setItem("portfolio_lang", lang);
    const root = window.document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // Sync light mode to document roots
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
  }, []);

  // Initialize and load active data
  useEffect(() => {
    // 1. Check if they were already logged in as admin during this browser session
    const isSessionAuth = sessionStorage.getItem("portfolio_admin") === "true";
    if (isSessionAuth) {
      setIsAdminLoggedIn(true);
    }

    // 2. Load cached copy from local storage to allow zero-latency instant render
    const localCopy = localStorage.getItem("portfolio_local_data");
    if (localCopy) {
      try {
        setPortfolioData(JSON.parse(localCopy));
      } catch (e) {
        console.error("Stale local storage model:", e);
      }
    }

    // 3. Fetch latest active configuration from Express live database JSON
    fetchLatestPortfolio();
  }, []);

  // 4. Periodically poll for updates across devices (only when admin panel is NOT open to avoid interrupting active changes)
  useEffect(() => {
    if (isAdminOpen) return;
    
    const interval = setInterval(() => {
      fetchLatestPortfolio();
    }, 6000); // Poll once every 6 seconds.
    
    return () => clearInterval(interval);
  }, [isAdminOpen]);

  const fetchLatestPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (response.ok) {
        const latestData = await response.json();
        setPortfolioData(latestData);
        // Refresh local storage cache
        localStorage.setItem("portfolio_local_data", JSON.stringify(latestData));
      }
    } catch (error) {
      console.warn("[Client] Live server offline/rebooting; using local storage/default cache.", error);
    } finally {
      setLoading(false);
    }
  };

  // Save updated portfolio data to backend
  const handleSavePortfolio = async (updatedData: PortfolioData): Promise<boolean> => {
    try {
      // Immediately write to local state and local storage cache for instant UI feedback
      setPortfolioData(updatedData);
      localStorage.setItem("portfolio_local_data", JSON.stringify(updatedData));

      // Push to the server
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to commit settings to backend database:", e);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("portfolio_admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center">
        <span className="w-10 h-10 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-450 font-sans tracking-wide">جاري تحميل معرض الأعمال...</p>
      </div>
    );
  }

  const { personalInfo, skills, projects } = portfolioData;
  const accentColor = personalInfo.accentColor || "#f97316";

  return (
    <div className="relative min-h-screen overflow-x-hidden text-right select-none select-text selection:bg-orange-500/30 selection:text-orange-200 bg-white text-slate-800 transition-colors duration-300">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20" />

      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <span className="w-10 h-10 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-xs text-slate-500 font-sans font-semibold">تجهيز المعرض الرقمي...</p>
        </div>
      }>
        {/* Navigation Header */}
        <Navbar
          onAdminClick={() => setIsAdminOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleLogout}
          accentColor={accentColor}
          lang={lang}
          setLang={setLang}
          avatarUrl={personalInfo.avatarUrl}
        />

        {/* Hero Overview */}
        <Hero personalInfo={personalInfo} accentColor={accentColor} lang={lang} />

        {/* About Profile Summary */}
        <About personalInfo={personalInfo} accentColor={accentColor} lang={lang} />

        {/* Skills Proficiency Grid */}
        <Skills skills={skills} accentColor={accentColor} lang={lang} />

        {/* Projects Grid Showcase */}
        <Projects projects={projects} accentColor={accentColor} lang={lang} />

        {/* Contact Guest Form */}
        <Contact personalInfo={personalInfo} accentColor={accentColor} lang={lang} />

        {/* Footer Copyright */}
        <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-505 font-mono transition-colors duration-300 font-semibold">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p dir={lang === "ar" ? "rtl" : "ltr"} className="font-sans">
              {lang === "ar" 
                ? `طُوِّر بكل شغف بواسطة إسراء حمد © ${new Date().getFullYear()}` 
                : `Developed with absolute passion by Israa Hamad © ${new Date().getFullYear()}`}
            </p>
            <div className="flex gap-4">
              <a href="#hero" className="hover:text-slate-900 transition-colors">{lang === "ar" ? "الرئيسية" : "Home"}</a>
              <a href="#about" className="hover:text-slate-900 transition-colors">{lang === "ar" ? "عني" : "About"}</a>
              <a href="#projects" className="hover:text-slate-900 transition-colors">{lang === "ar" ? "المشاريع" : "Projects"}</a>
            </div>
          </div>
        </footer>

        {/* Password-Protected Administration Sidebar Modal */}
        {isAdminOpen && (
          <AdminPanel
            portfolioData={portfolioData}
            onSave={handleSavePortfolio}
            onClose={() => setIsAdminOpen(false)}
            onLogout={handleLogout}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}
      </Suspense>

    </div>
  );
}
