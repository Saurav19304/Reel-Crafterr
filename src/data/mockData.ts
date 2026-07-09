export interface StorySlide {
  id: string;
  type: 'image';
  url: string;
  caption: string;
}

export interface Highlight {
  id: string;
  title: string;
  cover: string;
  emoji?: string;
  gradient?: string;
  slides: StorySlide[];
}

export interface Reel {
  id: string;
  title: string;
  category: 'Wedding' | 'Automotive' | 'Decor' | 'Travel' | 'Event';
  cover: string;
  likes: string;
  comments: string;
  views: string;
  duration: string;
  description: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export const HIGHLIGHTS: Highlight[] = [
  {
    id: 'h-weding',
    title: 'wedding',
    cover: '/assets/images/wedding.png',
    emoji: '💍',
    gradient: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
    slides: [
      { id: 'h-w-1', type: 'image', url: '/assets/images/logo.png', caption: 'Wedding details & cinematic frames coming soon! 🎬' }
    ]
  },
  {
    id: 'h-haldi',
    title: 'haldi decor',
    cover: '/assets/images/haldi.png',
    emoji: '💛',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    slides: [
      { id: 'h-h-1', type: 'image', url: '/assets/images/logo.png', caption: 'Vibrant splash moments & decor highlights! ✨' }
    ]
  },
  {
    id: 'h-car',
    title: 'car shoot',
    cover: '/assets/images/car.png',
    emoji: '🏎️',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    slides: [
      { id: 'h-c-1', type: 'image', url: '/assets/images/logo.png', caption: 'Dynamic rolling shots and pure exhaust notes!' }
    ]
  },
  {
    id: 'h-decor',
    title: 'decor shoot',
    cover: '/assets/images/decor.png',
    emoji: '🏮',
    gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
    slides: [
      { id: 'h-d-1', type: 'image', url: '/assets/images/logo.png', caption: 'Warm banquets and ambient lighting setups!' }
    ]
  },
  {
    id: 'h-woork',
    title: 'gear & work',
    cover: '/assets/images/wedding.png',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    slides: [
      { id: 'h-wo-1', type: 'image', url: '/assets/images/logo.png', caption: 'Gear Setup: iPhone + Gimbal + ND Filters 📱' }
    ]
  }
];

export const REELS: Reel[] = [
  {
    id: 'r-1',
    title: 'The Eternal Vows - Golden Hour Wedding',
    category: 'Wedding',
    cover: '/assets/images/wedding.png',
    likes: '12.4K',
    comments: '184',
    views: '150K',
    duration: '0:30',
    description: 'A magical wedding entry shot on iPhone, color graded in DaVinci Resolve. Captured with native 4K ProRes.'
  },
  {
    id: 'r-2',
    title: 'Beast Unleashed - Dark Knight Drift',
    category: 'Automotive',
    cover: '/assets/images/car.png',
    likes: '24.1K',
    comments: '439',
    views: '420K',
    duration: '0:15',
    description: 'Dynamic sunset rolling shots of a customized sports car. Speed ramp edits combined with precision sound design.'
  },
  {
    id: 'r-3',
    title: 'Sunshine & Marigolds - Haldi Splash',
    category: 'Decor',
    cover: '/assets/images/haldi.png',
    likes: '8.9K',
    comments: '92',
    views: '95K',
    duration: '0:22',
    description: 'Vibrant yellow tones, water droplets captured in 240fps slow-motion, and emotional family moments in Jaipur.'
  },
  {
    id: 'r-4',
    title: 'Warm Fairy Glow - Luxury Banquet Setup',
    category: 'Decor',
    cover: '/assets/images/decor.png',
    likes: '5.2K',
    comments: '46',
    views: '60K',
    duration: '0:28',
    description: 'Exploring details of premium banquet decor. Shot with active stabilization and focus pulls to highlight textures.'
  }
];

export const STATS: Stat[] = [
  { id: 's-1', value: '1.5k+', label: 'Instagram Community', description: 'Active and growing creators & clients' },
  { id: 's-2', value: '50+', label: 'Cinematic Shoots', description: 'Weddings, automotive and corporate shoots' },
  { id: 's-3', value: '100%', label: 'iPhone Rig', description: 'Fully dynamic 4K ProRes capabilities' },
  { id: 's-4', value: '24h', label: 'Turnaround Option', description: 'Fast delivery for social-ready highlights' }
];

export const SERVICES: Service[] = [
  {
    id: 'ser-1',
    title: 'Automotive Showcases',
    description: 'High-energy, dynamic tracking shots capturing pure exhaust notes, speed-ramp edits, and professional color grading.',
    icon: '🏎️',
    tags: ['Gimbal Tracking', 'Speed Ramping', 'iPhone']
  },
  {
    id: 'ser-2',
    title: 'Luxury Decor & Real Estate',
    description: 'Smooth, ambient, architectural pacing highlighting premium venue designs, flower installations, and banquet aesthetics.',
    icon: '📸',
    tags: ['Focus Pulls', 'Detail Close-ups', 'Ambient Lighting']
  },
  {
    id: 'ser-3',
    title: 'Brand & Commercial Reels',
    description: 'High-conversion, social-first marketing content tailored to grow your community and build brand authority.',
    icon: '🎬',
    tags: ['Social-First', 'Viral Pacing', 'Pro Sound Design']
  },
  {
    id: 'ser-4',
    title: 'Premium Weddings',
    description: 'Cinematic, emotional, luxury storytelling preserving your magical ceremonial moments in gorgeous 4K ProRes.',
    icon: '💍',
    tags: ['Slow Motion', 'Color Graded', 'Audio Design']
  }
];
