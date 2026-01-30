import { useEffect, useMemo, useState } from "react";
// import Header from "../../components/Header/Header";
import { NannyCard } from "../../components/NannyCard/NannyCard";
import Loader from "../../components/Loader/Loader";
import ErrorView from "../../components/ErrorView/ErrorView";
import type { Nanny, NannyFromApi } from "../../types/Nannies";
import { mapNannyFromApi } from "../../utils/mapNannyFromApi";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import css from "./Favorites.module.css";
import { Link } from "react-router-dom";
import Filters from "../../components/Filters/Filters";
import type { SortValue } from "../../types/Sort";
import Header from "../../components/Header/Header";
import Container from "../../components/Container/Container";
import { useAuthUser } from "../../lib/authApi";

const getLSKey = (uid: string) => `favorites:${uid}`;
const API_URL = import.meta.env.VITE_FIREBASE_API_URL;

type NanniesResponse = Record<string, NannyFromApi>;

const ITEMS_PER_PAGE = 3;

export default function Favorites() {
  const [nannies, setNannies] = useState<Nanny[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortValue>("a-z");
  const { user } = useAuthUser();
  const uid = user?.uid;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (!uid) {
      setFavorites([]); // logout -> очищаем
      return;
    }

    try {
      setFavorites(JSON.parse(localStorage.getItem(getLSKey(uid)) || "[]"));
    } catch {
      setFavorites([]);
    }
  }, [uid]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();

        const data = (await res.json()) as NanniesResponse;

        const list = Object.entries(data || {}).map(([id, nanny]) =>
          mapNannyFromApi(id, nanny),
        );

        setNannies(list);
      } catch {
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const favoriteCards = useMemo(
    () => nannies.filter((n) => favorites.includes(n.id)),
    [nannies, favorites],
  );

  const sortedFavorites = useMemo(() => {
    const arr = [...favoriteCards];

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
  }, [favoriteCards, sort]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [favorites.length, sort]);

  const toggleFavorite = (id: string) => {
    if (!uid) return;

    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(getLSKey(uid), JSON.stringify(next));
      return next;
    });

    setExpandedId((prev) => (prev === id ? null : prev));
  };

  return (
    <>
      <Header variant="solid" />
      <Container>
        {loading && <Loader />}
        {error && <ErrorView />}
        {!loading && !error && sortedFavorites.length > 0 && (
          <Filters value={sort} onChange={setSort} />
        )}
        {!loading && !error && favoriteCards.length === 0 && (
          <div className={css.empty}>
            <h2 className={css.emptyTitle}>No favorites yet</h2>
            <p className={css.emptyText}>
              Tap the heart on a nanny card to add it here.
            </p>
            <Link className={css.emptyBtn} to="/nannies">
              Browse nannies
            </Link>
          </div>
        )}
        {!loading &&
          !error &&
          sortedFavorites
            .slice(0, visibleCount)
            .map((n) => (
              <NannyCard
                key={n.id}
                avatarUrl={n.avatarUrl}
                isOnline
                name={n.name}
                location={n.location}
                rating={n.rating}
                pricePerHour={n.pricePerHour}
                age={n.age}
                experienceYears={n.experienceYears}
                kidsAgeRange={n.kidsAgeRange}
                characters={n.characters}
                education={n.education}
                about={n.about}
                reviews={n.reviews ?? []}
                isExpanded={expandedId === n.id}
                isFavorite={favorites.includes(n.id)}
                onToggleFavorite={() => toggleFavorite(n.id)}
                onToggleReadMore={() =>
                  setExpandedId((prev) => (prev === n.id ? null : n.id))
                }
              />
            ))}
        {!loading && !error && visibleCount < sortedFavorites.length && (
          <LoadMoreButton
            onClick={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
          />
        )}
      </Container>
    </>
  );
}
