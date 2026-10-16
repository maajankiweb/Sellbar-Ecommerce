export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'gadgets' | 'recommerce' | 'tips' | 'sellbar-updates';
  tags: string[];
  author: string;
  readTime: string;
  imageUrl: string;
  publishedAt: string;
  isPublished: boolean;
}

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'art_1',
    slug: 'top-flagship-smartphones-buy-refurbished-2026',
    title: 'Top Flagship Smartphones to Buy Refurbished in 2026 with 1-Year Warranty',
    excerpt: 'Explore why devices like iPhone 15 Pro and Galaxy S24 Ultra offer 95% of the new experience at 45% lower prices.',
    content: 'Buying a refurbished smartphone no longer means taking risks. With certified hardware quality testing, new batteries, and 12-month warranties, recommerce is the smartest way to own premium technology...',
    category: 'gadgets',
    tags: ['Smartphones', 'Apple', 'Samsung', 'Refurbished Deals'],
    author: 'Rahul Kumar (Tech Lead)',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    publishedAt: '2026-09-10T10:00:00Z',
    isPublished: true,
  },
  {
    id: 'art_2',
    slug: 'sellbar-quality-inspection-guide',
    title: 'Inside Sellbar: How Our Quality Inspection Works',
    excerpt: 'A behind-the-scenes look at how every pre-owned device is tested for display, motherboard, camera sensors, and battery health.',
    content: 'Every phone that arrives at our West Champaran inspection center goes through multi-stage diagnostics including touch responsiveness, biometric sensors, thermal performance, and complete data erasure before resale...',
    category: 'recommerce',
    tags: ['Quality Check', 'Certification', 'Warranty'],
    author: 'Sellbar Tech Team',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
    publishedAt: '2026-09-12T14:30:00Z',
    isPublished: true,
  },
  {
    id: 'art_3',
    slug: 'west-champaran-doorstep-sell-service-launch',
    title: 'Doorstep Device Buyback Expands Across West Champaran',
    excerpt: 'Residents of Bettiah, Bagaha, Narkatiaganj, and Ramnagar can now schedule 2-hour doorstep pickups with instant UPI payment.',
    content: 'We are excited to expand our localized express doorstep service to 6 key hubs in West Champaran. Customers can generate an instant quote on sellbar.in and have an executive inspect the device at their home...',
    category: 'sellbar-updates',
    tags: ['West Champaran', 'Doorstep Pickup', 'Instant UPI'],
    author: 'Sellbar Operations',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800',
    publishedAt: '2026-09-14T09:00:00Z',
    isPublished: true,
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __Sellbar_NEWS__: NewsArticle[] | undefined;
}

if (!global.__Sellbar_NEWS__) {
  global.__Sellbar_NEWS__ = [...INITIAL_ARTICLES];
}

export function getAllArticles(category?: string): NewsArticle[] {
  let list = global.__Sellbar_NEWS__ || [];
  if (category && category !== 'all') {
    list = list.filter((a) => a.category === category);
  }
  return list;
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return (global.__Sellbar_NEWS__ || []).find((a) => a.slug === slug);
}

export function createArticle(article: Omit<NewsArticle, 'id' | 'publishedAt'>): NewsArticle {
  const newArticle: NewsArticle = {
    ...article,
    id: 'art_' + Date.now(),
    publishedAt: new Date().toISOString(),
  };

  global.__Sellbar_NEWS__!.unshift(newArticle);
  return newArticle;
}

export function deleteArticle(id: string): boolean {
  const initial = (global.__Sellbar_NEWS__ || []).length;
  global.__Sellbar_NEWS__ = (global.__Sellbar_NEWS__ || []).filter((a) => a.id !== id);
  return (global.__Sellbar_NEWS__ || []).length < initial;
}
