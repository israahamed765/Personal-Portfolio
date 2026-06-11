import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, ShieldAlert, Key, Save, Eye, EyeOff, LayoutGrid, User, BookOpen, 
  FolderGit, Mail, Plus, Trash2, ArrowLeft, Download, Upload, LogOut, Check,
  Sliders, Cpu, Palette, Terminal, GitBranch, Globe, Server, Smartphone, ExternalLink, HelpCircle,
  Menu, X, Sun, Moon
} from "lucide-react";
import { PortfolioData, PersonalInfo, Skill, Project, Message } from "../types";

// Standard predefined icon sets for ease of assignment
const SKILL_ICONS = [
  { name: "Code", label: "مطور كود" },
  { name: "Layers", label: "مستويات" },
  { name: "Laptop", label: "حاسوب محمول" },
  { name: "Cpu", label: "معالج" },
  { name: "Database", label: "قواعد بيانات" },
  { name: "Palette", label: "لوحة ألوان" },
  { name: "GitBranch", label: "مستودعات" },
  { name: "Globe", label: "إنترنت" },
  { name: "Server", label: "خوادم" },
  { name: "Smartphone", label: "جوال" },
  { name: "Terminal", label: "طرفية الأوامر" }
];

interface AdminPanelProps {
  portfolioData: PortfolioData;
  onSave: (updatedData: PortfolioData) => Promise<boolean>;
  onClose: () => void;
  onLogout: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  theme: "dark" | "light";
  setTheme: (val: "dark" | "light") => void;
}

export default function AdminPanel({
  portfolioData,
  onSave,
  onClose,
  onLogout,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  theme,
  setTheme
}: AdminPanelProps) {
  // Password Authentication State
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "skills" | "projects" | "inbox" | "backup">("hero");

  // Local Editable States (Cloned from portfolioData)
  const [personal, setPersonal] = useState<PersonalInfo>(portfolioData.personalInfo);
  const [skills, setSkills] = useState<Skill[]>(portfolioData.skills);
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [messages, setMessages] = useState<Message[]>([]);

  // Sub-State Helpers for Adding Skills & Projects
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({
    name: "",
    name_ar: "",
    name_en: "",
    level: 80,
    category: "frontend",
    iconName: "Code"
  });

  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    title: "",
    title_ar: "",
    title_en: "",
    description: "",
    description_ar: "",
    description_en: "",
    imageUrl: "",
    demoUrl: "",
    githubUrl: "",
    techTags: []
  });
  const [techInput, setTechInput] = useState("");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  // Load guestbook messages if authenticated
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadMessages();
    }
  }, [isAdminLoggedIn]);

  const loadMessages = async () => {
    setMsgLoading(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setMsgLoading(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "ISRAA059") {
      setIsAdminLoggedIn(true);
      setAuthError(null);
      // Save session
      sessionStorage.setItem("portfolio_admin", "true");
    } else {
      setAuthError("كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.");
    }
  };

  // Safe file reader to convert any images of user selection into Base64 format
  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("حجم الصورة كبير جداً! يرجى اختيار صورة أصغر من 8 ميجابايت.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onComplete(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply Changes to Parent Store & Backend
  const handleSaveAll = async (updatedPersonal = personal, updatedSkills = skills, updatedProjects = projects) => {
    // Show saving state immediately
    setSaveStatus("saving");
    
    const payload: PortfolioData = {
      personalInfo: updatedPersonal,
      skills: updatedSkills,
      projects: updatedProjects
    };

    try {
      const success = await onSave(payload);
      if (success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Server persistence error:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  // Skill Modifiers
  const handleAddSkill = () => {
    const skillNameAr = newSkill.name_ar?.trim() || newSkill.name?.trim() || "";
    if (!skillNameAr) return;
    const added: Skill = {
      ...newSkill,
      id: "skill_" + Date.now().toString(),
      name: skillNameAr,
      name_ar: skillNameAr,
      name_en: newSkill.name_en?.trim() || skillNameAr
    };
    const updated = [...skills, added];
    setSkills(updated);
    setNewSkill({ name: "", name_ar: "", name_en: "", level: 80, category: "frontend", iconName: "Code" });
    handleSaveAll(personal, updated, projects);
  };

  const handleDeleteSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    handleSaveAll(personal, updated, projects);
  };

  // Project Modifiers
  const handleAddProject = () => {
    const titleVal = newProject.title_ar?.trim() || newProject.title?.trim() || "";
    const descVal = newProject.description_ar?.trim() || newProject.description?.trim() || "";
    if (!titleVal || !descVal) return;
    const tags = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const added: Project = {
      ...newProject,
      id: "proj_" + Date.now().toString(),
      title: titleVal,
      title_ar: titleVal,
      title_en: newProject.title_en?.trim() || titleVal,
      description: descVal,
      description_ar: descVal,
      description_en: newProject.description_en?.trim() || descVal,
      techTags: tags
    };

    const updated = [...projects, added];
    setProjects(updated);
    setNewProject({
      title: "",
      title_ar: "",
      title_en: "",
      description: "",
      description_ar: "",
      description_en: "",
      imageUrl: "",
      demoUrl: "",
      githubUrl: "",
      techTags: []
    });
    setTechInput("");
    handleSaveAll(personal, skills, updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    handleSaveAll(personal, skills, updated);
  };

  // Message Actions
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الرسالة نهائياً؟")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      alert("فشل حذف الرسالة.");
    }
  };

  // Export Data to Local JSON File
  const handleExportData = () => {
    const dataStr = JSON.stringify(
      { personalInfo: personal, skills, projects },
      null,
      2
    );
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Import Backup of JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo && parsed.skills && parsed.projects) {
          setPersonal(parsed.personalInfo);
          setSkills(parsed.skills);
          setProjects(parsed.projects);
          alert("تم استيراد نسخة الداتا بنجاح! جاري الحفظ والتطبيق على الخادم...");
          await handleSaveAll(parsed.personalInfo, parsed.skills, parsed.projects);
        } else {
          alert("تنسيق ملف النسخة غير مطابق لمعايير لوحة التحكم السليمة.");
        }
      } catch (err) {
        alert("فشل في قراءة ملف الـ JSON المرفوع.");
      }
    };
    reader.readAsText(file);
  };

  // Lock Screen View
  if (!isAdminLoggedIn) {
    return (
      <div dir="rtl" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex items-center justify-center p-4">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl text-right"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-slate-500 hover:text-white rounded-xl transition-colors hover:bg-slate-800/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-2 mt-4">
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-inner">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">منصة الإدارة المحمية</h2>
            <p className="text-xs text-slate-400">يرجى كتابة كلمة المرور الخاصة بك لتنشيط لوحة التعديل.</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 flex items-center justify-between pb-1">
                <span>كلمة المرور الإشرافية</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-center font-mono placeholder-slate-800 text-slate-200 focus:outline-none focus:border-slate-700 transition-all text-sm tracking-widest"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
                <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold bg-orange-500 hover:bg-orange-600 font-sans text-sm text-slate-950 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Key className="h-4 w-4" />
              فك قفل الإدارة
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row text-right transition-colors duration-300">
      
      {/* Dynamic Floating Save Toast Notification */}
      <AnimatePresence>
        {saveStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[150] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-sans text-sm font-bold border ${
              saveStatus === "saving"
                ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                : saveStatus === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {saveStatus === "saving" && (
              <>
                <span className="w-4 h-4 border-2 border-amber-600 dark:border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>جاري المزامنة وحفظ التعديلات بأمان...</span>
              </>
            )}
            {saveStatus === "success" && (
              <>
                <Check className="h-5 w-5 stroke-[3] text-emerald-600 dark:text-emerald-400" />
                <span>تم الحفظ والتحديث بنجاح! 🎉</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <span>حدث خطأ أثناء الحفظ! يرجى إعادة المحاولة.</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Navigation Bar (Visible only on Mobile) */}
      <div className="flex sm:hidden items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-20 shadow-sm transition-colors duration-300 w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white">لوحة الإدارة</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick theme control */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
          
          <button
            onClick={() => {
              handleSaveAll();
            }}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all select-none cursor-pointer focus:outline-none"
            style={{ backgroundColor: personal.accentColor }}
          >
            <Save className="h-3.5 w-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Slider Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black z-40 sm:hidden"
            />
            
            {/* Mobile Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 p-5 flex flex-col justify-between shadow-2xl sm:hidden text-right animate-none"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="text-right">
                      <h3 className="text-sm font-black text-slate-850 dark:text-white">إدارة المهندس</h3>
                      <p className="text-[9px] text-slate-500 font-mono">ISRAA059 ACTIVE</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Tab links */}
                <div className="space-y-1">
                  {[
                    { id: "hero", label: "الواجهة الأساسية", icon: <LayoutGrid className="h-4 w-4" /> },
                    { id: "about", label: "نبذة وتواصل", icon: <User className="h-4 w-4" /> },
                    { id: "skills", label: "تعديل المهارات", icon: <BookOpen className="h-4 w-4" /> },
                    { id: "projects", label: "لوحة المشاريع", icon: <FolderGit className="h-4 w-4" /> },
                    { id: "inbox", label: "صندوق الرسائل", icon: <Mail className="h-4 w-4" /> },
                    { id: "backup", label: "نسخ احتياطي", icon: <Download className="h-4 w-4" /> },
                  ].map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setIsMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                          active 
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white border-r-3"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850"
                        }`}
                        style={{ borderRightColor: active ? personal.accentColor : "transparent" }}
                      >
                        <span style={{ color: active ? personal.accentColor : "" }}>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {tab.id === "inbox" && messages.length > 0 ? (
                          <span className="mr-auto bg-orange-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                            {messages.length}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                {/* Theme toggle option inside Mobile Drawer */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">المظهر النشط</span>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber-500" />
                        <span>مظهر فاتح</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-slate-655" />
                        <span>مظهر داكن</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleSaveAll();
                    setIsMobileNavOpen(false);
                  }}
                  disabled={saveStatus === "saving"}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer focus:outline-none"
                  style={{ backgroundColor: personal.accentColor }}
                >
                  <Save className="h-4 w-4" />
                  {saveStatus === "saving" ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    عرض الموقع
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-450 border border-rose-500/20 rounded-lg transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    خروج
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar Navigation (Visible on wider screens) */}
      <div className="hidden sm:flex sm:w-64 bg-white dark:bg-slate-900 flex-col justify-between p-4 flex-shrink-0 z-10 shadow-xl transition-colors duration-300">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Check className="h-4.5 w-4.5" />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-black text-slate-800 dark:text-white font-sans">إدارة المهندس</h3>
                <p className="text-[9px] text-slate-500 font-mono">ISRAA059 ACTIVE</p>
              </div>
            </div>

            {/* Live Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all shadow-sm"
              title={theme === "dark" ? "تفعيل المظهر الفاتح" : "تفعيل المظهر الداكن"}
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-slate-650" />}
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-1">
            {[
              { id: "hero", label: "الواجهة الأساسية", icon: <LayoutGrid className="h-4 w-4" /> },
              { id: "about", label: "نبذة وتواصل", icon: <User className="h-4 w-4" /> },
              { id: "skills", label: "تعديل المهارات", icon: <BookOpen className="h-4 w-4" /> },
              { id: "projects", label: "لوحة المشاريع", icon: <FolderGit className="h-4 w-4" /> },
              { id: "inbox", label: "صندوق الرسائل", icon: <Mail className="h-4 w-4" /> },
              { id: "backup", label: "نسخ احتياطي", icon: <Download className="h-4 w-4" /> },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all flex-shrink-0 focus:outline-none ${
                    active 
                      ? "bg-slate-100 dark:bg-slate-800 border-r-3 text-slate-950 dark:text-white shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                  style={{ borderRightColor: active ? personal.accentColor : "transparent" }}
                >
                  <span style={{ color: active ? personal.accentColor : "" }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.id === "inbox" && messages.length > 0 ? (
                    <span className="mr-auto bg-orange-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                      {messages.length}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <button
            onClick={() => {
              handleSaveAll();
            }}
            disabled={saveStatus === "saving"}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all select-none cursor-pointer focus:outline-none"
            style={{ backgroundColor: personal.accentColor }}
          >
            <Save className="h-4 w-4" />
            {saveStatus === "saving" ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
            >
              عرض الموقع
            </button>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              خروج
            </button>
          </div>
        </div>

      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto p-4 sm:p-8 flex flex-col transition-colors duration-300">
        
        {/* Status indicator bar in top-workspace */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">لوحة تحكم إشرافية</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تعديل كامل نصوص وقوالب معرض الأعمال، وبطاقات المهارات والمشاريع.</p>
          </div>

          <div className="flex items-center gap-2.5">
            {saveStatus === "success" && (
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold animate-fade-in">
                <Check className="h-4 w-4" />
                تم حفظ التعديلات بنجاح!
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold animate-fade-in">
                <ShieldAlert className="h-4 w-4" />
                خطأ أثناء الحفظ!
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* HERO TAB */}
            {activeTab === "hero" && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-right"
              >
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>عناوين وكلمات الترحيب الكبرى</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">الاسم الشخصي بالعربية</label>
                      <input
                        type="text"
                        value={personal.name_ar || personal.name || ""}
                        onChange={(e) => setPersonal({ ...personal, name_ar: e.target.value, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">الاسم الشخصي بالإنجليزية</label>
                      <input
                        type="text"
                        value={personal.name_en || ""}
                        onChange={(e) => setPersonal({ ...personal, name_en: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">المسمى المهني بالعربية</label>
                      <input
                        type="text"
                        value={personal.title_ar || personal.title || ""}
                        onChange={(e) => setPersonal({ ...personal, title_ar: e.target.value, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">المسمى المهني بالإنجليزية</label>
                      <input
                        type="text"
                        value={personal.title_en || ""}
                        onChange={(e) => setPersonal({ ...personal, title_en: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">نبذة الهيدر القصيرة بالعربية (Bio)</label>
                      <textarea
                        value={personal.bio_ar || personal.bio || ""}
                        onChange={(e) => setPersonal({ ...personal, bio_ar: e.target.value, bio: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm leading-relaxed resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">نبذة الهيدر القصيرة بالإنجليزية (Bio)</label>
                      <textarea
                        value={personal.bio_en || ""}
                        onChange={(e) => setPersonal({ ...personal, bio_en: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Photo & Back Accent controls */}
                  <div className="md:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>صورة الهيدر والوجهة واللون</h3>
                    
                    <div className="space-y-4">
                      {/* Image Source Toggle */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400">رابط صورة الهيدر (URL)</label>
                        <input
                          type="text"
                          value={personal.avatarUrl}
                          onChange={(e) => setPersonal({ ...personal, avatarUrl: e.target.value })}
                          placeholder="رابط صورة مباشر أو كود Base64"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none text-xs font-mono"
                        />
                      </div>

                      {/* Pick Image File Box */}
                      <div className="p-4 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 transition-all bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                        <div>
                          <p className="text-xs font-bold text-slate-300">اسحب وأفلت الصورة هنا أو اختر من جهازك</p>
                          <p className="text-[10px] text-slate-500 mt-1">اضغط على زر الاختيار أو اسحب الملف مباشرة لتحميله فوراً.</p>
                        </div>
                        <label className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer select-none">
                          اختر الملف المفضل
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, (base64) => setPersonal({ ...personal, avatarUrl: base64 }))}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 flex items-center justify-between">
                            <span>لون برواز الهيدر الشخصي</span>
                            <span className="text-[10px] text-slate-500 font-mono" dir="ltr">{personal.avatarBgColor}</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={personal.avatarBgColor || "#fed7aa"}
                              onChange={(e) => setPersonal({ ...personal, avatarBgColor: e.target.value })}
                              className="w-10 h-10 bg-transparent border-0 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={personal.avatarBgColor || ""}
                              onChange={(e) => setPersonal({ ...personal, avatarBgColor: e.target.value })}
                              placeholder="#fed7aa"
                              dir="ltr"
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 text-slate-300 text-xs text-center font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 flex items-center justify-between">
                            <span>لون براند الموقع العام (Accent)</span>
                            <span className="text-[10px] text-slate-500 font-mono" dir="ltr">{personal.accentColor}</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={personal.accentColor || "#f97316"}
                              onChange={(e) => setPersonal({ ...personal, accentColor: e.target.value })}
                              className="w-10 h-10 bg-transparent border-0 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={personal.accentColor}
                              onChange={(e) => setPersonal({ ...personal, accentColor: e.target.value })}
                              placeholder="#f97316"
                              dir="ltr"
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 text-slate-300 text-xs text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Preview headshot */}
                  <div className="md:col-span-5 bg-slate-900 border border-slate-850 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">معاينة صورة الهيدر الحالية</h3>
                    
                    <div className="relative w-44 h-44 rounded-3xl overflow-hidden border border-slate-800 p-2 shadow-xl bg-slate-950 flex items-center justify-center">
                      {personal.avatarUrl ? (
                        <img src={personal.avatarUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <div 
                          className="w-full h-full rounded-2xl flex items-center justify-center transition-colors duration-500"
                          style={{ backgroundColor: personal.avatarBgColor || "#fed7aa" }}
                        >
                          <User className="h-16 w-16 text-slate-950/20" />
                        </div>
                      )}
                    </div>
                    {personal.avatarUrl ? (
                      <button 
                        onClick={() => setPersonal({ ...personal, avatarUrl: "" })}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
                      >
                        إرجاع للون الخلفية البرتقالي الافتراضي
                      </button>
                    ) : (
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px]">الخلفية ملونة باللون البرتقالي أو الدرجة التي قمت باختيارها في اليسار.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-right"
              >
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-5">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>عني والنبذة التفصيلية المهنية</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">القصة والمسيرة المهنية بالعربية</label>
                      <textarea
                        value={personal.aboutText_ar || personal.aboutText || ""}
                        onChange={(e) => setPersonal({ ...personal, aboutText_ar: e.target.value, aboutText: e.target.value })}
                        rows={8}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm leading-relaxed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">القصة والمسيرة المهنية بالإنجليزية</label>
                      <textarea
                        value={personal.aboutText_en || ""}
                        onChange={(e) => setPersonal({ ...personal, aboutText_en: e.target.value })}
                        rows={8}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-slate-700 text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Contact endpoints */}
                  <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>بيانات الاتصال والسيرة</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">البريد الإلكتروني المباشر</label>
                        <input
                          type="email"
                          value={personal.email}
                          onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">رقم الهاتف الجوال</label>
                        <input
                          type="text"
                          value={personal.phone}
                          onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs text-right"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">المدينة والعنوان بالعربية</label>
                          <input
                            type="text"
                            value={personal.location_ar || personal.location || ""}
                            onChange={(e) => setPersonal({ ...personal, location_ar: e.target.value, location: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">المدينة والعنوان بالإنجليزية</label>
                          <input
                            type="text"
                            value={personal.location_en || ""}
                            onChange={(e) => setPersonal({ ...personal, location_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs"
                          />
                        </div>
                      </div>

                      {/* CV File Upload */}
                      <div className="space-y-1 pt-2">
                        <label className="text-[11px] font-bold text-slate-400">رابط ملف السيرة الذاتية PDF</label>
                        <input
                          type="text"
                          value={personal.cvUrl}
                          onChange={(e) => setPersonal({ ...personal, cvUrl: e.target.value })}
                          placeholder="ألصق رابط السيرة الـ PDF أو اختر ملف من الأسفل"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-xs font-mono"
                        />
                        <div className="mt-2 flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/30">
                          <span className="text-[10px] text-slate-500">رفع سيرة ذاتية PDF:</span>
                          <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded cursor-pointer select-none">
                            اختر ملف PDF
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleImageFileChange(e, (base64) => setPersonal({ ...personal, cvUrl: base64 }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social URLs */}
                  <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>عناوين الشبكات الاجتماعية</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">رابط Github</label>
                        <input
                          type="url"
                          value={personal.githubUrl}
                          onChange={(e) => setPersonal({ ...personal, githubUrl: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 text-xs text-left font-mono dir-ltr"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">رابط Linkedin</label>
                        <input
                          type="url"
                          value={personal.linkedinUrl}
                          onChange={(e) => setPersonal({ ...personal, linkedinUrl: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 text-xs text-left font-mono dir-ltr"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">رابط Twitter/X</label>
                        <input
                          type="url"
                          value={personal.twitterUrl}
                          onChange={(e) => setPersonal({ ...personal, twitterUrl: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 text-xs text-left font-mono dir-ltr"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">رابط واتساب (مباشر)</label>
                        <input
                          type="url"
                          value={personal.whatsappUrl}
                          onChange={(e) => setPersonal({ ...personal, whatsappUrl: e.target.value })}
                          placeholder="https://wa.me/9665..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 text-xs text-left font-mono dir-ltr"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-right"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Skill adder form */}
                  <div className="md:col-span-5 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>إضافة مهارة جديدة</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">عنوان المهارة بالعربية</label>
                          <input
                            type="text"
                            value={newSkill.name_ar || ""}
                            onChange={(e) => setNewSkill({ ...newSkill, name_ar: e.target.value, name: e.target.value })}
                            placeholder="تطوير واجهات المستخدم"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">عنوان المهارة بالإنجليزية</label>
                          <input
                            type="text"
                            value={newSkill.name_en || ""}
                            onChange={(e) => setNewSkill({ ...newSkill, name_en: e.target.value })}
                            placeholder="Front-End Development"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">نسبة التمكن والإتقان ({newSkill.level}%)</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={newSkill.level}
                          onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                          className="w-full accent-orange-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">تصنيف المهارة</label>
                        <select
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 text-xs"
                        >
                          <option value="frontend">تطوير واجهات المستخدم (Frontend)</option>
                          <option value="backend">خوادم وقواعد بيانات (Backend)</option>
                          <option value="design">التصميم وتجربة المستخدم (UI/UX)</option>
                          <option value="other">أدوات وأنظمة ومسارات أخرى</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 flex items-center justify-between">
                          <span>أيقونة المهارة الدلالية</span>
                          <span className="text-[10px] text-slate-500 font-mono">{newSkill.iconName}</span>
                        </label>
                        {/* Dynamic Icons Palette Select */}
                        <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
                          {SKILL_ICONS.map((ico) => {
                            const active = newSkill.iconName === ico.name;
                            return (
                              <button
                                key={ico.name}
                                type="button"
                                onClick={() => setNewSkill({ ...newSkill, iconName: ico.name })}
                                className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                  active 
                                    ? "bg-slate-800 text-white border border-slate-600" 
                                    : "text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <span style={{ color: active ? personal.accentColor : "" }}>
                                  Pick
                                </span>
                                <span className="text-[9px] truncate max-w-full font-mono">{ico.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={handleAddSkill}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider select-none cursor-pointer focus:outline-none"
                        style={{ backgroundColor: personal.accentColor }}
                      >
                        <Plus className="h-4 w-4" />
                        إضافة المهارة الآن
                      </button>
                    </div>
                  </div>

                  {/* Skills lists */}
                  <div className="md:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 flex flex-col">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>قائمة مهاراتك ({skills.length})</h3>
                    
                    <div className="flex-1 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {skills.length > 0 ? (
                        skills.map((skill) => (
                          <div 
                            key={skill.id} 
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800"
                          >
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-100">{skill.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                المستوى: {skill.level}% | التصنيف: {skill.category === "frontend" ? "واجهات" : skill.category === "backend" ? "خوادم" : skill.category === "design" ? "تصميم" : "أخرى"}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="p-2 text-rose-500 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-sm text-slate-500">لا توجد مهارات مسجلة حالياً.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-right"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Create project panel */}
                  <div className="lg:col-span-5 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>إدراج مشروع جديد</h3>
                    
                    <div className="space-y-3.5">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">اسم المشروع بالعربية</label>
                          <input
                            type="text"
                            value={newProject.title_ar || ""}
                            onChange={(e) => setNewProject({ ...newProject, title_ar: e.target.value, title: e.target.value })}
                            placeholder="مثال: منصة إدارة المهام الذكية"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">اسم المشروع بالإنجليزية</label>
                          <input
                            type="text"
                            value={newProject.title_en || ""}
                            onChange={(e) => setNewProject({ ...newProject, title_en: e.target.value })}
                            placeholder="e.g. Smart Task Manager"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">وصف المشروع بالعربية</label>
                          <textarea
                            value={newProject.description_ar || ""}
                            onChange={(e) => setNewProject({ ...newProject, description_ar: e.target.value, description: e.target.value })}
                            rows={3}
                            placeholder="اكتب وصفاً مفصلاً للمشروع باللغة العربية..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">وصف المشروع بالإنجليزية</label>
                          <textarea
                            value={newProject.description_en || ""}
                            onChange={(e) => setNewProject({ ...newProject, description_en: e.target.value })}
                            rows={3}
                            placeholder="Write a clear English description for the project..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs leading-relaxed"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">رابط صورة المعاينة (URL) أو ارفع صورة</label>
                        <input
                          type="text"
                          value={newProject.imageUrl}
                          onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                          placeholder="ألصق رابط صورة إلكتروني مباشر أو استخدم الزر أدناه"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono"
                        />
                        <div className="mt-1.5 flex flex-col sm:flex-row items-center justify-between p-2.5 rounded-xl bg-slate-950/45 border border-slate-800/80 gap-2">
                          <span className="text-[10px] text-slate-500">اسحب وأفلت لقطة شاشة للمشروع أو اختر صورة:</span>
                          <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] font-bold rounded cursor-pointer select-none">
                            اختر لقطة شاشة
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, (base64) => setNewProject({ ...newProject, imageUrl: base64 }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pb-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">رابط المعاينة المباشر (Demo)</label>
                          <input
                            type="url"
                            value={newProject.demoUrl}
                            onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono dir-ltr"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">رابط مستودع الكود (GitHub)</label>
                          <input
                            type="url"
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            placeholder="https://github..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono dir-ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">التقنيات المستخدمة (مفصولة بفواصل)</label>
                        <input
                          type="text"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          placeholder="React, Tailwind, Node.js, Typescript"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs"
                        />
                        <p className="text-[9px] text-slate-500 mt-0.5">* أدخل أسماء الفريم ورك والمكتبات مفصولة بفاصلة إنجليزية (,)</p>
                      </div>

                      <button
                        onClick={handleAddProject}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white uppercase tracking-wider select-none cursor-pointer focus:outline-none"
                        style={{ backgroundColor: personal.accentColor }}
                      >
                        <Plus className="h-4 w-4" />
                        إدراج المشروع لقائمتي
                      </button>
                    </div>
                  </div>

                  {/* Projects manager list */}
                  <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-3xl flex flex-col h-[585px]">
                    <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3" style={{ color: personal.accentColor }}>بطاقات المشاريع النشطة ({projects.length})</h3>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {projects.length > 0 ? (
                        projects.map((proj) => (
                          <div 
                            key={proj.id} 
                            className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-800/80 gap-4"
                          >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              {/* mini image */}
                              <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-800">
                                {proj.imageUrl ? (
                                  <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono bg-slate-900">
                                    MOCK
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-slate-100">{proj.title}</p>
                                <div className="flex flex-wrap gap-1 mt-1 leading-none">
                                  {proj.techTags.map((t, i) => (
                                    <span key={i} className="text-[10px] bg-slate-805 text-slate-500 font-mono">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-2 text-rose-500 hover:text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-sm text-slate-500">لم تدرج مشاريع بعد.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* INBOX/MESSAGES TAB */}
            {activeTab === "inbox" && (
              <motion.div
                key="inbox"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-right"
              >
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl min-h-[460px] flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
                    <h3 className="text-lg font-bold text-white" style={{ color: personal.accentColor }}>صندوق الوارد لرسائل الزوار</h3>
                    <button 
                      onClick={loadMessages}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-300 border border-slate-800 hover:bg-slate-800 rounded-xl transition-all"
                    >
                      تحديث الرسائل
                    </button>
                  </div>

                  {msgLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                      <span className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-2" />
                      <p className="text-xs text-slate-500">جاري جلب الرسائل الأخيرة من الخادم...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[480px] pr-1">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className="p-5 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all text-right relative group"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-3 mb-3">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: personal.accentColor }} />
                                {msg.senderName}
                              </h4>
                              <p className="text-[10px] text-slate-400 select-all font-mono">
                                البريد: {msg.senderEmail} | الموضوع: <span className="text-slate-300">{msg.subject}</span>
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(msg.timestamp).toLocaleString("ar-SA", { hour12: true })}
                            </span>
                          </div>

                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-all">
                            {msg.content}
                          </p>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="absolute top-4 left-4 p-2 text-rose-500 hover:text-white hover:bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-rose-500/20"
                            title="حذف الرسالة"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-slate-600">
                      <Mail className="h-12 w-12 mb-3 opacity-30" />
                      <p className="text-sm font-bold">صندوق الوارد فارغ تماماً حالياً.</p>
                      <p className="text-xs mt-1">عندما يقوم الزوار بملء نموذج "اتصل بي" على الموقع، ستظهر رسائلهم هنا مباشرة.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* BACKUP & RESTORE TAB */}
            {activeTab === "backup" && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-right"
              >
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white" style={{ color: personal.accentColor }}>إدارة وحماية نسخة البيانات الخارجية (Backup)</h3>
                    <p className="text-xs text-slate-500 mt-1">تتيح لك هذه الأداة حيازة وتصدير نسخة احتياطية من كامل قاعدة كود موقعك (JSON) والاحتفاظ بها على جهازك الشخصي، أو استعادتها وتطبيقها بنقرة واحدة.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Export */}
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <Download className="h-4.5 w-4.5 text-orange-400" />
                          تنزيل وتصدير كامل البيانات
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">تصدير ملف JSON متكامل يحمل الاسم، العناوين، الألوان، المهارات، والمشاريع بصورها المشفرة.</p>
                      </div>

                      <button
                        onClick={handleExportData}
                        className="py-3.5 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:text-white text-slate-200 transition-all flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none"
                      >
                        تنزيل ملف النسخة الاحتياطية (.json)
                      </button>
                    </div>

                    {/* Import */}
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">
                          <Upload className="h-4.5 w-4.5 text-rose-400" />
                          رفع واستيراد نسخة سابقة
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">استبدال داتا الموقع النشطة برفع ملف JSON مسحوب سلفاً من لوحة تحكم الإدارة لترميمه فوراً.</p>
                      </div>

                      <div className="flex items-center justify-center">
                        <label className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all flex items-center justify-center gap-2 select-none cursor-pointer text-center">
                          اختيار ملف وإجراء الترميم الآمن
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 text-orange-400 hover:text-orange-300 text-xs leading-relaxed flex items-start gap-2.5">
                    <HelpCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">ملاحظة أمان السيرفرات السحابية:</p>
                      <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">نظرًا لأن نظام الاستضافة السحابي قد يعفي الذاكرة التخزينية أو يحدث نفسه دورياً، ننصح المسؤول بتحميل نسخة احتياطية من داتا المعرض وحفظها محلياً على جهاز الكومبيوتر عند إتمام التعديلات الرائعة على المشاريع لمزيد من الاستقرار الدائم.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
