import Header from "../../components/Header/Header";
import { NannyCard } from "../../components/NannyCard/NannyCard";

export default function Nannies() {
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
        onToggleFavorite={() => console.log("fav")}
        isFavorite={false}
      />
    </>
  );
}
