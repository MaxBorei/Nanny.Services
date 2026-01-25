import type { Nanny, NannyFromApi } from "../types/Nannies";

export const calcAge = (isoDate: string): number => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
};

export const parseExperienceYears = (experience: string): number => {
  const n = Number.parseInt(experience, 10);
  return Number.isFinite(n) ? n : 0;
};

export const mapNannyFromApi = (id: string, n: NannyFromApi): Nanny => ({
  id,
  name: n.name,
  avatarUrl: n.avatar_url,
  birthday: n.birthday,
  experience: n.experience,
  experienceYears: parseExperienceYears(n.experience),
  reviews: n.reviews ?? [],
  education: n.education,
  kidsAgeRange: n.kids_age,
  pricePerHour: n.price_per_hour,
  location: n.location,
  about: n.about,
  characters: n.characters ?? [],
  rating: n.rating,
  age: calcAge(n.birthday),
});
