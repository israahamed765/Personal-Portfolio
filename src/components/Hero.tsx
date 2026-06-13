import React from "react";
import { Download, MessageSquare, ArrowRight, Github, Linkedin, Twitter, Phone } from "lucide-react";
import { PersonalInfo } from "../types";

interface HeroProps {
  personalInfo: PersonalInfo;
  accentColor: string;
  lang: "ar" | "en";
}

export default function Hero({ personalInfo, accentColor, lang }: HeroProps) {
  const bgAccent = personalInfo.avatarBgColor || "#fed7aa";

  const t = {
    badge: lang === "ar" ? "متاح للمشاريع الجديدة والعمل الحر" : "Available for new projects & freelance work",
    welcome: lang === "ar" ? "أهلاً بك، أنا" : "Welcome, I'm",
    name: lang === "ar" ? (personalInfo.name_ar || personalInfo.name) : (personalInfo.name_en || personalInfo.name),
    title: lang === "ar" ? (personalInfo.title_ar || personalInfo.title) : (personalInfo.title_en || personalInfo.title),
    bio: lang === "ar" ? (personalInfo.bio_ar || personalInfo.bio) : (personalInfo.bio_en || personalInfo.bio),
    contact: lang === "ar" ? "تواصل معي" : "Contact Me",
    downloadCV: lang === "ar" ? "تحميل السيرة الذاتية" : "Download CV / Resume",
    noCV: lang === "ar" ? "السيرة الذاتية (غير مضافة)" : "Resume (Not Uploaded)",
    cvAlert: lang === "ar" ? "يرجى رفع السيرة الذاتية أولاً من لوحة تحكم المسؤول." : "Please upload your resume in the admin dashboard first.",
    socials: lang === "ar" ? "روابطي الاجتماعية:" : "Social Profiles:",
    interactive: lang === "ar" ? "موقع تفاعلي" : "Interactive Space",
    flexible: lang === "ar" ? "تصميم وإدارة مرنة" : "Highly Flexible Layout",
    role: lang === "ar" ? "مهندس برمجيات" : "Software Engineer",
    technologies: lang === "ar" ? "لغات وتقنيات التطوير" : "Dev stack & languages"
  };

  return (
    <section
      id="hero"
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen pt-32 pb-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300"
    >
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]" style={{ backgroundColor: `${accentColor}15` }} />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-550/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 rtl:text-right ltr:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-350 dark:border-slate-700/50 text-xs sm:text-sm font-bold tracking-wide text-slate-805 dark:text-slate-200">
              <span className="w-2h-2 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
              {t.welcome} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to left, #0f172a, ${accentColor})` }}>
                {t.name}
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
              {t.title}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 rtl:justify-start ltr:justify-start">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ backgroundColor: accentColor }}
              >
                <MessageSquare className="h-4 w-4" />
                {t.contact}
                <ArrowRight className={`h-4 w-4 mr-1 ${lang === "ar" ? "rotate-180" : ""}`} />
              </a>

              {personalInfo.cvUrl ? (
                <a
                  href={personalInfo.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-200 dark:hover:text-white font-bold text-sm transition-all duration-300 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  {t.downloadCV}
                </a>
              ) : (
                <button
                  onClick={() => alert(t.cvAlert)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-200/50 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm transition-all duration-300"
                >
                  <Download className="h-4 w-4" />
                  {t.noCV}
                </button>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-6 justify-start border-t border-slate-200 dark:border-slate-800/80 max-w-md">
              <span className="text-xs text-slate-500 font-bold font-mono">{t.socials}</span>
              <div className="flex gap-3">
                {personalInfo.githubUrl && (
                  <a href={personalInfo.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all shadow-sm">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {personalInfo.linkedinUrl && (
                  <a href={personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all shadow-sm">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {personalInfo.twitterUrl && (
                  <a href={personalInfo.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all shadow-sm">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {personalInfo.whatsappUrl && (
                  <a href={personalInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all shadow-sm">
                    <Phone className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile Picture / Background Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-85 sm:h-85 lg:w-96 lg:h-96 group">
              
              {/* Outer Glowing Border */}
              <div 
                className="absolute inset-0 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 scale-95"
                style={{ backgroundColor: accentColor }}
              />

              {/* Decorative Frame Line */}
              <div 
                className="absolute -inset-2.5 rounded-3xl border-2 border-dashed opacity-40 group-hover:opacity-60 transition-all duration-500 rotate-3 group-hover:rotate-6 scale-95"
                style={{ borderColor: accentColor }}
              />

              {/* Image Frame Container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl p-2.5 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                {personalInfo.avatarUrl ? (
                  <img
                    src={personalInfo.avatarUrl}
                    alt={t.name}
                    className="w-full h-full object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  // Default Illustration Box
                  <div
                    className="w-full h-full rounded-2xl flex flex-col items-center justify-center relative p-8 transition-colors duration-500"
                    style={{ backgroundColor: bgAccent }}
                  >
                    <svg className="w-40 h-40 text-slate-950/20 absolute -bottom-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    
                    {/* Developer code graphics mockup */}
                    <div className="bg-slate-950/80 p-5 rounded-2xl shadow-xl border border-white/5 backdrop-blur-md w-full max-w-[280px] z-10 text-right text-xs font-mono text-emerald-400 space-y-2">
                      <p className="text-slate-500 text-[10px]">// {t.technologies}</p>
                      <p><span className="text-purple-400">const</span> designer = &#123;</p>
                      <p className="mr-3">name: <span className="text-amber-300">"{t.name}"</span>,</p>
                      <p className="mr-3">role: <span className="text-amber-300">"{t.role}"</span>,</p>
                      <p className="mr-3">active: <span className="text-teal-400">true</span></p>
                      <p>&#125;;</p>
                    </div>
                    
                    <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 blur-sm" />
                    <div className="absolute bottom-16 right-6 w-8 h-8 rounded-full bg-black/10 blur-sm" />
                  </div>
                )}
              </div>

              {/* Float Mini Card Accent */}
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-[200px]">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{t.interactive}</p>
                  <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{t.flexible}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
