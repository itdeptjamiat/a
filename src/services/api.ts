// Documentation-only typed contracts for backend API expected by the redesigned home screen

export interface PaginatedQuery {
  page?: number; // default 1
  limit?: number; // default 20
  sort?: 'newest' | 'popular' | 'recommended';
}

export interface MagazineDTO {
  _id: string;
  mid: number;
  name: string;
  image: string;
  file: string;
  type: 'pro' | 'free';
  fileType: string;
  magzineType: 'magzine' | 'article' | 'digest';
  isActive: boolean;
  category: string;
  downloads: number;
  description: string;
  rating: number;
  createdAt: string;
}

export interface ListResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta?: { page: number; limit: number; total: number };
}

export interface FeaturedResponse<T> {
  success: boolean;
  data: T | null;
}

// Endpoints the home screen expects (for backend contract)
export const HomeApiDocs = {
  featuredMagazine: {
    method: 'GET',
    url: '/home/featured-magazine',
    query: {} as Record<string, never>,
    response: {} as FeaturedResponse<MagazineDTO>,
  },
  recentlyPublishedMagazines: {
    method: 'GET',
    url: '/home/recent-magazines',
    query: {} as PaginatedQuery,
    response: {} as ListResponse<MagazineDTO>,
  },
  kidsDigests: {
    method: 'GET',
    url: '/home/kids-digests',
    query: {} as PaginatedQuery,
    response: {} as ListResponse<MagazineDTO>,
  },
  recommendedArticles: {
    method: 'GET',
    url: '/home/recommended-articles',
    query: {} as PaginatedQuery,
    response: {} as ListResponse<MagazineDTO>,
  },
  favoritesByOthersMagazines: {
    method: 'GET',
    url: '/home/favorites-magazines',
    query: {} as PaginatedQuery,
    response: {} as ListResponse<MagazineDTO>,
  },
};

// API service utilities
// This file contains API-related service functions

export const apiService = {
  // Placeholder for API service functions
}; 