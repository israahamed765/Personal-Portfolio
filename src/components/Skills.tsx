import React, { useState } from "react";
import * as Icons from "lucide-react";
import { Sliders, Cpu, Palette, Terminal, Award } from "lucide-react";
import { Skill } from "../types";

interface SkillsProps {
  skills: Skill[];
  accentColor: string;
  lang: "ar" | "en";
}

export default function Skills({ skills, accentColor, lang }: SkillsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "frontend" | "backend" | "design" | "other">("all");

  const categories = [
    { key: "all", label: lang === "ar" ? "الكل" : "All", icon: <Award className="h-4 w-4" /> },
    { key: "frontend", label: lang === "ar" ? "تطوير واجهات المستخدم" : "Front-End UI", icon: <Sliders className="h-4 w-4" /> },
    { key: "backend", label: lang === "ar" ? "الخوادم وقواعد البيانات" : "Backend & Caching", icon: <Cpu className="h-4 w-4" /> },
    { key: "design", label: lang === "ar" ? "التصميم وتجربة المستخدم" : "Design / UX Research", icon: <Palette className="h-4 w-4" /> },
    { key: "other", label: lang === "ar" ? "أدوات وأنظمة أخرى" : "DevOps & Tooling", icon: <Terminal className="h-4 w-4" /> },
  ];

  const t = {
    badge: lang === "ar" ? "مهاراتي وتقنياتي" : "My Tech Stack",
    heading: lang === "ar" ? "القدرات والخبرات التقنية" : "Abilities & Expertise Profiles",
    desc: lang === "ar" ? "أدوات ولغات برمجية أستخدمها يومياً لبناء منتجات رقمية فائقة الجودة." : "Tools, frameworks, and programming languages I specialize in to build exquisite products.",
    noSkills: lang === "ar" ? "لا توجد مهارات مضافة في هذا القسم حالياً." : "No skills added to this category yet."
  };

  const filteredSkills = activeTab === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeTab);

  const getDynamicIcon = (iconName?: string) => {
    if (!iconName) return <Icons.Code className="h-5 w-5" />;
    const LucideIcon = (Icons as any)[iconName];
    if (LucideIcon) return <LucideIcon className="h-5 w-5" />;
    return <Icons.Code className="h-5 w-5" />;
  };

  return (
    <section 
      id="skills" 
      dir={lang === "ar" ? "rtl" : "ltr"} 
      className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700/60 inline-flex items-center gap-1.5 font-sans">
              <Sliders className="h-3.5 w-3.5" style={{ color: accentColor }} />
              {t.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{t.heading}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">{t.desc}</p>
            <div className="w-16 h-1 mx-auto rounded-full mt-2" style={{ backgroundColor: accentColor }} />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer focus:outline-none ${
                  isActive
                    ? "text-white shadow-lg shadow-orange-500/10"
                    : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
                }`}
                style={{ 
                  backgroundColor: isActive ? accentColor : "",
                  borderColor: isActive ? accentColor : ""
                }}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => {
              const skillName = lang === "ar" ? (skill.name_ar || skill.name) : (skill.name_en || skill.name);
              return (
                <div
                  key={skill.id || index}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all shadow-sm dark:shadow-md group"
                >
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform"
                        style={{ color: accentColor }}
                      >
                        {getDynamicIcon(skill.iconName)}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">{skillName}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: accentColor }}>
                      {skill.level}%
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        backgroundColor: accentColor,
                        width: `${skill.level}%`
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-10 bg-slate-100/50 dark:bg-slate-905/25 rounded-2xl border border-slate-200/50 dark:border-slate-850/50">
              <p className="text-slate-400 dark:text-slate-500 text-sm">{t.noSkills}</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
