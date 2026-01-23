import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import { NannyCard } from "../../components/NannyCard/NannyCard";

const LS_KEY = "favorite_nannies";
const API_URL =
  "https://nanny-services-f1f8e-default-rtdb.europe-west1.firebasedatabase.app/nannies.json";

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

export type Nanny = NannyFromApi & { id: string };
type NanniesResponse = Record<string, NannyFromApi>;

const calcAge = (isoDate: string): number | null => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
};

const parseExperienceYears = (experienceStr: string): number | null => {
  const n = Number.parseInt(experienceStr, 10);
  return Number.isFinite(n) ? n : null;
};

export default function Nannies() {
  const [nannies, setNannies] = useState<Nanny[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]") as string[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as NanniesResponse;

        const list: Nanny[] = Object.entries(data || {}).map(([id, nanny]) => ({
          id,
          ...nanny,
        }));

        setNannies(list);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message || "Failed to load nannies");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const cards = useMemo(() => nannies, [nannies]);

  return (
    <>
      <Header variant="solid" />

      {loading && <p style={{ padding: 16 }}>Loading…</p>}
      {error && <p style={{ padding: 16, color: "crimson" }}>{error}</p>}

      {!loading &&
        !error &&
        cards.map((n) => {
          const isFavorite = favorites.includes(n.id);
          const isExpanded = expandedId === n.id;

          return (
            <NannyCard
              key={n.id}
              avatarUrl={n.avatar_url}
              isOnline={true}
              name={n.name}
              location={n.location}
              rating={n.rating}
              pricePerHour={n.price_per_hour}
              age={calcAge(n.birthday) ?? 0}
              experienceYears={parseExperienceYears(n.experience) ?? 0}
              kidsAgeRange={n.kids_age}
              characters={(n.characters || []).map(
                (c) => c.charAt(0).toUpperCase() + c.slice(1),
              )}
              education={n.education}
              about={n.about}
              reviews={n.reviews ?? []}
              isExpanded={isExpanded}
              isFavorite={isFavorite}
              onToggleFavorite={() => toggleFavorite(n.id)}
              onToggleReadMore={() => toggleExpanded(n.id)}
            />
          );
        })}
    </>
  );
}
