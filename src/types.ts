export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  aboutText: string;
  avatarUrl: string; // URL or Base64 data string
  cvUrl: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  whatsappUrl: string;
  accentColor: string; // Hex color string, default is #f97316 (orange)
  avatarBgColor?: string; // Hex background accent behind avatar, default is #fed7aa
  // Bilingual extensions
  name_ar?: string;
  name_en?: string;
  title_ar?: string;
  title_en?: string;
  bio_ar?: string;
  bio_en?: string;
  aboutText_ar?: string;
  aboutText_en?: string;
  location_ar?: string;
  location_en?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
  category: "frontend" | "backend" | "design" | "other";
  iconName?: string; // Lucide icon identifier
  // Bilingual extensions
  name_ar?: string;
  name_en?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // URL or Base64 data string
  demoUrl: string;
  githubUrl: string;
  techTags: string[];
  // Bilingual extensions
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  projects: Project[];
}
