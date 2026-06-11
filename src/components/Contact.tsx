import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageSquareShare } from "lucide-react";
import { PersonalInfo } from "../types";

interface ContactProps {
  personalInfo: PersonalInfo;
  accentColor: string;
  lang: "ar" | "en";
}

export default function Contact({ personalInfo, accentColor, lang }: ContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = {
    badge: lang === "ar" ? "تواصل آمن وسريع" : "Get In Touch",
    heading: lang === "ar" ? "ابدأ محادثة معي اليوم" : "Let's build something epic",
    desc: lang === "ar" ? "يمكنك ملء النموذج أدناه أو استخدام قنوات التواصل المباشرة المتاحة." : "Fill out the contact form or drop a line via standard hotlines listed below.",
    channelsHeading: lang === "ar" ? "قنوات التواصل المباشرة" : "Direct Channels",
    emailCard: lang === "ar" ? "البريد الإلكتروني المباشر" : "Direct Email Inbox",
    phoneCard: lang === "ar" ? "الهاتف والتواصل السريع" : "Hotline / Phone",
    addressCard: lang === "ar" ? "العنوان الحالي" : "Current Location",
    notAvailable: lang === "ar" ? "غير متوفر" : "Not Provided",
    officeLoc: lang === "ar" ? (personalInfo.location_ar || personalInfo.location) : (personalInfo.location_en || personalInfo.location),
    disclaimer: lang === "ar"
      ? "* سأقوم بمطالعة صندوق البريد الخاص بي والرد على جميع الرسائل الواردة خلال 24-48 ساعة عمل."
      : "* I read my emails daily and will revert back to all requests within 24-48 busy working hours.",
    formHeading: lang === "ar" ? "أرسل رسالة فورية" : "Send an Instant Message",
    fieldName: lang === "ar" ? "الاسم الكامل" : "Your Name",
    placeholderName: lang === "ar" ? "محمد أحمد مثلاً" : "e.g. John Doe",
    fieldEmail: lang === "ar" ? "البريد الإلكتروني" : "Email Address",
    placeholderEmail: lang === "ar" ? "name@example.com" : "john@example.com",
    fieldSubject: lang === "ar" ? "عنوان الرسالة (موضوع الرسالة)" : "Message Subject (Optional)",
    placeholderSubject: lang === "ar" ? "طلب استشارة / تفاصيل مشروع جديد" : "e.g. Digital Design / Consultation query",
    fieldMsg: lang === "ar" ? "نص الرسالة" : "Your Message",
    placeholderMsg: lang === "ar" 
      ? "اكتب هنا تفاصيل مشروعك أو فكرتك بالتفصيل وسأجيبك فوراً..." 
      : "Type details about your project, timelines, scope or guidelines here...",
    errFill: lang === "ar" 
      ? "الرجاء تعبئة جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة)." 
      : "Please fill out all required fields (Name, Email, and Message).",
    successSent: lang === "ar" 
      ? "تم إرسال رسالتك بنجاح! شكراً للتواصل معي وسأقوم بالرد عليك في أقرب وقت." 
      : "Message delivered successfully! Thank you for holding on, I'll be in touch as soon as possible.",
    errResponse: lang === "ar" 
      ? "عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً." 
      : "Sorry, something went wrong. Let's try sending that again later.",
    errNetwork: lang === "ar" 
      ? "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً." 
      : "Network connectivity failed. Please inspect your connection and retry again.",
    btnSending: lang === "ar" ? "جاري إرسال الرسالة..." : "Sending message...",
    btnSend: lang === "ar" ? "إرسال الرسالة الآن" : "Send Message Now"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      setError(t.errFill);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: name,
          senderEmail: email,
          subject,
          content,
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess(t.successSent);
        setName("");
        setEmail("");
        setSubject("");
        setContent("");
      } else {
        setError(result.error || t.errResponse);
      }
    } catch (err) {
      setError(t.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      title: t.emailCard,
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: <Mail className="h-5 w-5" style={{ color: accentColor }} />,
    },
    {
      title: t.phoneCard,
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
      icon: <Phone className="h-5 w-5" style={{ color: accentColor }} />,
    },
    {
      title: t.addressCard,
      value: t.officeLoc,
      href: null,
      icon: <MapPin className="h-5 w-5" style={{ color: accentColor }} />,
    },
  ];

  return (
    <section 
      id="contact" 
      dir={lang === "ar" ? "rtl" : "ltr"} 
      className="py-24 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 relative transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="space-y-4 font-sans">
            <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-1.5">
              <MessageSquareShare className="h-3.5 w-3.5" style={{ color: accentColor }} />
              {t.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{t.heading}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">{t.desc}</p>
            <div className="w-16 h-1 mx-auto rounded-full mt-2" style={{ backgroundColor: accentColor }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Quick Contacts Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl flex-1 justify-center flex flex-col space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">{t.channelsHeading}</h3>
              
              <div className="space-y-4">
                {contactCards.map((card, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
                  >
                    <div className="p-3 bg-slate-100 dark:bg-slate-850 rounded-xl flex-shrink-0 text-white flex items-center justify-center shadow-sm">
                      {card.icon}
                    </div>
                    <div className="rtl:text-right ltr:text-left">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{card.title}</p>
                      {card.href ? (
                        <a href={card.href} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 hover:underline break-all">
                          {card.value || t.notAvailable}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 break-all">
                          {card.value || t.notAvailable}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-405 dark:text-slate-500 font-bold leading-relaxed">
                  {t.disclaimer}
                </p>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">{t.formHeading}</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2 rtl:text-right ltr:text-left">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.fieldName} <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.placeholderName}
                      required
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all text-sm rtl:text-right ltr:text-left shadow-sm"
                    />
                  </div>

                  <div className="space-y-2 rtl:text-right ltr:text-left">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.fieldEmail} <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.placeholderEmail}
                      required
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all text-sm text-left dir-ltr shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2 rtl:text-right ltr:text-left">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.fieldSubject}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t.placeholderSubject}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all text-sm rtl:text-right ltr:text-left shadow-sm"
                  />
                </div>

                <div className="space-y-2 rtl:text-right ltr:text-left">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.fieldMsg} <span className="text-rose-500">*</span></label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t.placeholderMsg}
                    rows={5}
                    required
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-all text-sm rtl:text-right ltr:text-left leading-relaxed resize-none shadow-sm"
                  />
                </div>

                {/* Submitting Status Toggles */}
                {error && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 flex items-start gap-3 text-xs leading-relaxed text-right">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 text-xs leading-relaxed text-right">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="pt-2 rtl:text-right ltr:text-left">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl hover:brightness-110 disabled:opacity-50 select-none cursor-pointer focus:outline-none"
                    style={{ backgroundColor: accentColor }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.btnSending}
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 rtl:rotate-180" />
                        {t.btnSend}
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
