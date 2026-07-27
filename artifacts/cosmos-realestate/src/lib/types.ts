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

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
  leadStatus: string; // new | contacted | qualified | closed
  notes: string;
  readAt: string | null;
  createdAt: string;
}
