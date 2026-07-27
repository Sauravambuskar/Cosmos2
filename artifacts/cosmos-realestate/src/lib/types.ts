export interface Property {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  transactionType: string;
  price: string;
  priceValue: number;
  area: number;
  bhk: number | null;
  location: string;
  address: string;
  images: string[];
  amenities: string[];
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  status: string;
  units: string;
  highlights: string;
  image: string;
  brochureUrl: string;
  videoUrl: string;
  area: string;
  amenities: string[];
  gallery: string[];
  rera: string;
  possession: string;
  priceRange: string;
  developer: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
  leadStatus: string;
  notes: string;
  readAt: string | null;
  createdAt: string;
}
