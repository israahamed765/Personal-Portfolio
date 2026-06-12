import React from "react";
import { FolderGit2, ExternalLink, Github, Sparkles } from "lucide-react";
import { Project } from "../types";

interface ProjectsProps {
  projects: Project[];
  accentColor: string;
  lang: "ar" | "en";
}

export default function Projects({ projects, accentColor, lang }: ProjectsProps) {
  const t = {
    badge: lang === "ar" ? "معرض أعمالي" : "Project Showcase",
    heading: lang === "ar" ? "آخر المشاريع المنجزة" : "Latest Finished Projects",
    desc: lang === "ar" ? "مجموعة مختارة من البرمجيات والحلول الرقمية التي قمت بتطويرها مؤخراً." : "A hand-curated database of software products and web applications developed recently.",
    sourceActive: lang === "ar" ? "رمز المصدر قيد التشغيل" : "Source Code Active",
    completed: lang === "ar" ? "مكتمل" : "Ready",
    liveDemo: lang === "ar" ? "رابط المعاينة" : "Live Demo",
    noDemo: lang === "ar" ? "معاينة غير متوفرة" : "Demo Offline",
    repo: lang === "ar" ? "المستودع" : "Repository",
    privateRepo: lang === "ar" ? "مستودع مغلق" : "Private Repo",
    noProjectsHeading: lang === "ar" ? "لم يتم تسجيل مشاريع برمجية في المعرض بعد." : "No registered software projects found.",
    noProjectsDesc: lang === "ar" ? "يمكنك البدء بإضافة باقة مشاريعك من لوحة إشراف المسؤول." : "Log in to your administration dashboard to publish project layouts, cover photos or direct links."
  };

  return (
    <section 
      id="projects" 
      dir={lang === "ar" ? "rtl" : "ltr"} 
      className="py-12 sm:py-24 bg-white dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-950 relative transition-colors duration-300"
    >
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full blur-3xl -z-10" style={{ backgroundColor: `${accentColor}05` }} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="space-y-3 sm:space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-1.5 font-sans">
              <FolderGit2 className="h-3.5 w-3.5" style={{ color: accentColor }} />
              {t.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">{t.heading}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{t.desc}</p>
            <div className="w-16 h-1 mx-auto rounded-full mt-2" style={{ backgroundColor: accentColor }} />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {projects.length > 0 ? (
            projects.map((project, index) => {
              const projectTitle = lang === "ar" ? (project.title_ar || project.title) : (project.title_en || project.title);
              const projectDesc = lang === "ar" ? (project.description_ar || project.description) : (project.description_en || project.description);
              return (
                <div
                  key={project.id || index}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 flex flex-col group h-full"
                >
                  {/* Project Image Header */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950 flex-shrink-0">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={projectTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      // Elegant developer-themed placeholder when no custom screenshot is loaded
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 relative select-none"
                        style={{ background: `linear-gradient(135deg, ${accentColor}10, #1e293b, #0f172a)` }}
                      >
                        <Sparkles className="h-8 w-8 text-white/20 absolute top-4 right-4" />
                        <FolderGit2 className="h-10 w-10 sm:h-12 sm:w-12 text-white/10 mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: `${accentColor}30` }} />
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                          {t.sourceActive}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent opacity-80" />
                      </div>
                    )}
                    {/* Decorative Project Accent Banner */}
                    <div 
                      className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] sm:text-[10px] px-2.5 py-1 rounded-full font-bold shadow-xl border border-white/5 backdrop-blur-md text-white font-mono"
                      style={{ backgroundColor: `${accentColor}df` }}
                    >
                      {t.completed}
                    </div>
                  </div>

                  {/* Project Body */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow rtl:text-right ltr:text-left">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-200/90 transition-colors">
                      {projectTitle}
                    </h3>
                    
                    <p className="text-slate-505 dark:text-slate-400 text-[11px] sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-grow whitespace-pre-wrap font-medium">
                      {projectDesc}
                    </p>

                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4 sm:mb-6">
                      {project.techTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-[9px] sm:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 dark:border-slate-700/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-auto">
                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl shadow-lg transition-all hover:scale-[1.03] cursor-pointer"
                          style={{ backgroundColor: accentColor }}
                        >
                          <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {t.liveDemo}
                        </a>
                      ) : (
                        <span className="flex-1 text-center py-2 bg-slate-150 dark:bg-slate-800/40 text-slate-500 rounded-xl text-[10px] sm:text-[11px] font-bold border border-slate-250 dark:border-slate-800/50">
                          {t.noDemo}
                        </span>
                      )}

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all font-mono"
                        >
                          <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {t.repo}
                        </a>
                      ) : (
                        <span className="flex-1 text-center py-2 bg-slate-150 dark:bg-slate-800/20 text-slate-400 dark:text-slate-550 rounded-xl text-[10px] sm:text-[11px] font-bold font-mono border border-slate-250 dark:border-slate-800/10">
                          {t.privateRepo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-100/30 dark:bg-slate-900/20 rounded-3xl border border-slate-200/60 p-8">
              <FolderGit2 className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">{t.noProjectsHeading}</p>
              <p className="text-slate-500 text-xs mt-1">{t.noProjectsDesc}</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
