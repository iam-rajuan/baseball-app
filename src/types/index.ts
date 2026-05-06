export type AccessLevel = 'free' | 'premium';

export type SituationInstruction = {
  player: string;
  detail: string;
};

export type Situation = {
  id: string;
  title: string;
  category: string;
  shortLabel: string;
  featured: boolean;
  diagramVariant: 'infield' | 'outfield';
  instructions: SituationInstruction[];
  image?: string;
  imageUrl?: string;
};

export type DrillCategory = {
  id: string;
  name: string;
  subtitle: string;
  numberOfDrills: number;
  image: string;
  imageUrl?: string;
  coverUrl?: string;
  coverPhotoUrl?: string;
  iconUrl?: string;
  accessLevel: AccessLevel;
  accentIcon: string;
};

export type Drill = {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: string[];
  equipment: string[];
  focusPoints: Array<string | { title: string; description: string }>;
  listIcon?: string;
  accessLevel: AccessLevel;
  image: string;
  youtubeUrl?: string | null;
  imageUrl?: string;
  coverUrl?: string;
  coverPhotoUrl?: string;
};

export type LegalPages = {
  privacyPolicy: string[];
  privacyPolicyHtml?: string;
  terms: string[];
  termsHtml?: string;
  aboutUs: {
    headline: string;
    body: string;
    bodyHtml?: string;
    company: string[];
    contact: string[];
  };
};

export type AppSettings = {
  homeEyebrow: string;
  homeTitle: string;
  homePrimaryCta: string;
  homeSecondaryCta: string;
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  situationImageUri: string | null;
  situationImageUrl?: string;
};

export type UserProfile = {
  email: string;
  isPremium: boolean;
  version: string;
};
