import { useEffect, useMemo, useState } from "react";
// import Header from "../../components/Header/Header";
import { NannyCard } from "../../components/NannyCard/NannyCard";
import Loader from "../../components/Loader/Loader";
import ErrorView from "../../components/ErrorView/ErrorView";
import type { Nanny, NannyFromApi } from "../../types/Nannies";
import Filters from "../../components/Filters/Filters";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import type { SortValue } from "../../types/Sort";
import Header from "../../components/Header/Header";
import Container from "../../components/Container/Container";

const LS_KEY = "favorite_nannies";
const API_URL = import.meta.env.VITE_FIREBASE_API_URL;

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

  const [sort, setSort] = useState<SortValue>("a-z");
  const ITEMS_PER_PAGE = 3;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [sort]);

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

        const list: Nanny[] = Object.entries(data || {}).map(([id, n]) => ({
          id,
          name: n.name,
          avatarUrl: n.avatar_url,
          birthday: n.birthday,
          experience: n.experience,
          experienceYears: parseExperienceYears(n.experience) ?? 0,
          reviews: n.reviews ?? [],
          education: n.education,
          kidsAgeRange: n.kids_age,
          pricePerHour: n.price_per_hour,
          location: n.location,
          about: n.about,
          characters: n.characters ?? [],
          rating: n.rating,
          age: calcAge(n.birthday) ?? 0,
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

  const cards = useMemo(() => {
    const arr = [...nannies];

    arr.sort((a, b) => {
      switch (sort) {
        case "a-z":
          return a.name.localeCompare(b.name);

        case "z-a":
          return b.name.localeCompare(a.name);

        case "price-low":
          return a.pricePerHour - b.pricePerHour;

        case "price-high":
          return b.pricePerHour - a.pricePerHour;

        case "rating-low":
          return a.rating - b.rating;

        case "rating-high":
          return b.rating - a.rating;

        case "all":
        default:
          return 0;
      }
    });

    return arr;
  }, [nannies, sort]);

  return (
    <>
      <Header variant="solid" />
      <Container>
        {loading && <Loader />}
        {error && <ErrorView />}
        <Filters value={sort} onChange={setSort} />
        {!loading &&
          !error &&
          cards.slice(0, visibleCount).map((n) => {
            const isFavorite = favorites.includes(n.id);
            const isExpanded = expandedId === n.id;
            return (
              <NannyCard
                key={n.id}
                avatarUrl={n.avatarUrl}
                isOnline={true}
                name={n.name}
                location={n.location}
                rating={n.rating}
                pricePerHour={n.pricePerHour}
                age={calcAge(n.birthday) ?? 0}
                experienceYears={parseExperienceYears(n.experience) ?? 0}
                kidsAgeRange={n.kidsAgeRange}
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
        {!loading && !error && visibleCount < cards.length && (
          <LoadMoreButton
            onClick={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
          />
        )}
      </Container>
    </>
  );
}
