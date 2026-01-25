import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import { NannyCard } from "../../components/NannyCard/NannyCard";
import Loader from "../../components/Loader/Loader";
import ErrorView from "../../components/ErrorView/ErrorView";
import type { Nanny, NannyFromApi } from "../../types/Nannies";
import { mapNannyFromApi } from "../../utils/mapNannyFromApi";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import css from "./Favorites.module.css";
import { Link } from "react-router-dom";

const LS_KEY = "favorite_nannies";
const API_URL = import.meta.env.VITE_FIREBASE_API_URL;

type NanniesResponse = Record<string, NannyFromApi>;

const ITEMS_PER_PAGE = 3;

export default function Favorites() {
  const [nannies, setNannies] = useState<Nanny[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
  }, []);

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

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [favorites.length]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
    setExpandedId((prev) => (prev === id ? null : prev));
  };

  return (
    <>
      <Header variant="solid" />

      {loading && <Loader />}
      {error && <ErrorView />}

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
        favoriteCards
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
              isFavorite
              onToggleFavorite={() => toggleFavorite(n.id)}
              onToggleReadMore={() =>
                setExpandedId((prev) => (prev === n.id ? null : n.id))
              }
            />
          ))}

      {!loading && !error && visibleCount < favoriteCards.length && (
        <LoadMoreButton
          onClick={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
        />
      )}
    </>
  );
}
