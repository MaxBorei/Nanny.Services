import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { NannyCard } from "../../components/NannyCard/NannyCard";

const LS_KEY = "favorite_nannies";

export default function Nannies() {
  const nannyId = "maria-kovalenko"; // ❗ уникальный id карточки

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isFavorite = favorites.includes(nannyId);

  return (
    <>
      <Header variant="solid" />

      <NannyCard
        avatarUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"
        isOnline
        name="Maria Kovalenko"
        location="Lviv, Ukraine"
        rating={4.5}
        pricePerHour={16}
        age={32}
        experienceYears={7}
        kidsAgeRange="6 months to 8 years old"
        characters={[
          "Compassionate",
          "Knowledgeable",
          "Adaptive",
          "Trustworthy",
        ]}
        education="Master's in Child Psychology, CPR Certified"
        about="I have a passion for teaching and mentoring children..."
        onReadMore={() => console.log("read more")}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(nannyId)}
      />
    </>
  );
}
