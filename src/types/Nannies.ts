export type Review = {
  reviewer: string;
  rating: number;
  comment: string;
};

export type NannyFromApi = {
  name: string;
  avatar_url: string;
  birthday: string;
  experience: string;
  reviews?: Review[];
  education: string;
  kids_age: string;
  price_per_hour: number;
  location: string;
  about: string;
  characters: string[];
  rating: number;
};

export type Nanny = {
  id: string;
  name: string;
  avatarUrl: string;
  birthday: string;
  experience: string;
  experienceYears: number;
  reviews?: Review[];
  education: string;
  kidsAgeRange: string;
  pricePerHour: number;
  location: string;
  about: string;
  characters: string[];
  rating: number;
  age: number;
};
