import React from "react";
import { User, Mail, Phone, MapPin, Award, BookOpen, Briefcase, Smile } from "lucide-react";
import { PersonalInfo } from "../types";

interface AboutProps {
  personalInfo: PersonalInfo;
  accentColor: string;
  lang: "ar" | "en";
}

export default function About({ personalInfo, accentColor, lang }: AboutProps) {
  const t = {
    badge: lang === "ar" ? "من أنا؟" : "About Me",
    sectionTitle: lang === "ar" ? "نبذة تعريفية عن مسيرتي" : "A brief introduction about my career",
    contactHeading: lang === "ar" ? "معلومات التواصل الأساسية" : "Primary Contact Information",
    emailLabel: lang === "ar" ? "البريد الإلكتروني" : "Email Address",
    phoneLabel: lang === "ar" ? "الهاتف الجوال" : "Phone Number",
    locationLabel: lang === "ar" ? "الموقع الجغرافي" : "Office Location",
    quote: lang === "ar" 
      ? "الجودة في الأداء، والواجهات السلسة هي هدفي الأسمى في كل سطر كود أكتبه للمشاريع." 
      : "Excellent performance, stunning layouts, and intuitive experiences are my ultimate goals with every single line of code.",
    careerHeading: lang === "ar" ? "مسيرتي المهنية وشغفي بالتطوير" : "My Career Path & Passion for Engineering",
    tag1: lang === "ar" ? "#برمجيات" : "#Software",
    tag2: lang === "ar" ? "#هندسة_الويب" : "#WebEngine",
    tag3: lang === "ar" ? "#مواقع_متجاوبة" : "#Responsive",
    tag4: lang === "ar" ? "#تجربة_المستخدم" : "#UI_UX",
    notAvailable: lang === "ar" ? "غير متوفر" : "Not Provided",
    location: lang === "ar" ? (personalInfo.location_ar || personalInfo.location) : (personalInfo.location_en || personalInfo.location),
    aboutText: lang === "ar" ? (personalInfo.aboutText_ar || personalInfo.aboutText) : (personalInfo.aboutText_en || personalInfo.aboutText),

    card1Title: lang === "ar" ? "الخبرة المهنية" : "Experience",
    card1Value: lang === "ar" ? "تطوير تطبيقات متكاملة" : "Full-stack apps",
    card2Title: lang === "ar" ? "التعليم والدراسة" : "Education & Training",
    card2Value: lang === "ar" ? "بكالوريوس هندسة حاسبات" : "Bachelor of Software Engineering",
    card3Title: lang === "ar" ? "مشاريع منجزة" : "Finished Projects",
    card3Value: lang === "ar" ? "أكثر من ٢٠ مشروعاً" : "20+ Interactive releases"
  };

  const infoCards = [
    {
      id: "info1",
      icon: <Award className="h-6 w-6" style={{ color: accentColor }} />,
      title: t.card1Title,
      value: t.card1Value,
    },
    {
      id: "info2",
      icon: <BookOpen className="h-6 w-6" style={{ color: accentColor }} />,
      title: t.card2Title,
      value: t.card2Value,
    },
    {
      id: "info3",
      icon: <Briefcase className="h-6 w-6" style={{ color: accentColor }} />,
      title: t.card3Title,
      value: t.card3Value,
    },
  ];

  const contactDetails = [
    { label: t.emailLabel, value: personalInfo.email, icon: <Mail className="h-5 w-5 text-slate-400" /> },
    { label: t.phoneLabel, value: personalInfo.phone, icon: <Phone className="h-5 w-5 text-slate-400" /> },
    { label: t.locationLabel, value: t.location, icon: <MapPin className="h-5 w-5 text-slate-400" /> },
  ];

  return (
    <section 
      id="about" 
      dir={lang === "ar" ? "rtl" : "ltr"} 
      className="py-24 bg-white dark:bg-slate-900/50 relative border-t border-slate-200 dark:border-slate-900 border-b border-slate-100 dark:border-slate-950 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" style={{ color: accentColor }} />
              {t.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{t.sectionTitle}</h2>
            <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: accentColor }} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Statistics/Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-xl rounded-full" style={{ backgroundColor: accentColor }} />
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <Smile className="h-5 w-5" style={{ color: accentColor }} />
                {t.contactHeading}
              </h3>

              <div className="space-y-5">
                {contactDetails.map((detail, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl flex-shrink-0 shadow-sm border border-slate-100 dark:border-0">
                      {detail.icon}
                    </div>
                    <div className="rtl:text-right ltr:text-left">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{detail.label}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 select-all break-all">{detail.value || t.notAvailable}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accent colored quote/banner */}
              <div 
                className={`bg-slate-100/50 dark:bg-slate-850 p-4 rounded-2xl mt-6 rtl:text-right ltr:text-left text-slate-600 dark:text-slate-305 text-sm leading-relaxed ${
                  lang === "ar" ? "border-r-4 border-l-0" : "border-l-4 border-r-0"
                }`} 
                style={{ 
                  borderLeftColor: lang === "en" ? accentColor : "transparent", 
                  borderRightColor: lang === "ar" ? accentColor : "transparent" 
                }}
              >
                "{t.quote}"
              </div>
            </div>

            {/* Quick stats badges row */}
            <div className="grid grid-cols-3 gap-3">
              {infoCards.map((card) => (
                <div key={card.id} className="bg-slate-50/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 p-4 rounded-2xl text-center flex flex-col items-center justify-center space-y-2">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/50 dark:border-0">
                    {card.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">{card.title}</p>
                  <p className="text-[10px] text-slate-505 dark:text-slate-400 font-bold leading-tight">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Biography Paragraphs */}
          <div className="lg:col-span-7 space-y-6 rtl:text-right ltr:text-left">
            <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t.careerHeading}</h3>
              
              <div className="text-slate-750 dark:text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">
                {t.aboutText}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2.5">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-xl">{t.tag1}</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-xl">{t.tag2}</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-xl">{t.tag3}</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-xl">{t.tag4}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
