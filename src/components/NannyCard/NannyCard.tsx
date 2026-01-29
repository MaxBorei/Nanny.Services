import { useState } from "react";
import type { Review } from "../../types/Nannies";
import Modal from "../Modal/Modal";
import css from "./NannyCard.module.css";
import AppointmentForm from "../AppointmentForm/AppointmentForm";
import { useAuthUser } from "../../lib/authApi";

type NannyCardProps = {
  avatarUrl: string;
  isOnline?: boolean;

  role?: string;
  name: string;

  location: string;
  rating: number;
  pricePerHour: number;

  age: number;
  experienceYears: number;
  kidsAgeRange: string;

  characters: string[];
  education: string;

  about: string;

  reviews: Review[];
  isExpanded: boolean;
  onToggleReadMore: () => void;

  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const getInitials = (fullName: string): string => {
  const firstName = fullName.trim().split(/\s+/)[0];
  return firstName ? firstName[0].toUpperCase() : "?";
};

export function NannyCard({
  avatarUrl,
  isOnline = false,

  role = "Nanny",
  name,

  location,
  rating,
  pricePerHour,

  age,
  experienceYears,
  kidsAgeRange,

  characters,
  education,

  about,

  reviews,
  isExpanded,
  onToggleReadMore,

  isFavorite = false,
  onToggleFavorite,
}: NannyCardProps) {
  const [isAppointment, setIsAppointment] = useState(false);

  const openModal = () => setIsAppointment(true);
  const closeModal = () => setIsAppointment(false);
  const { user } = useAuthUser();
  return (
    <section className={css.card} aria-label={`${role}: ${name}`}>
      <div className={css.avatar}>
        <img className={css.avatarImg} src={avatarUrl} alt={name} />
        {isOnline && <span className={css.onlineDot} aria-hidden="true" />}
      </div>

      <div className={css.body}>
        <header className={css.header}>
          <div className={css.title}>
            <span className={css.role}>{role}</span>
            <h3 className={css.name}>{name}</h3>
          </div>

          <div className={css.meta_favorite}>
            <div className={css.meta}>
              <div className={css.metaItem}>
                <span className={css.icon} aria-hidden="true">
                  <svg className={css.ctaIcon} width="16" height="16">
                    <use href="/vite.svg#icon-map" />
                  </svg>
                </span>
                <span className={css.metaText}>{location}</span>
              </div>

              <div className={css.metaItem}>
                <span className={css.icon} aria-hidden="true">
                  <svg className={css.ctaIcon_star} width="16" height="16">
                    <use href="/vite.svg#icon-Star" />
                  </svg>
                </span>
                <span className={css.metaText}>
                  Rating: {rating.toFixed(1)}
                </span>
              </div>

              <div className={css.metaItem}>
                <span className={css.metaText}>
                  Price / 1 hour: <b className={css.price}>{pricePerHour}$</b>
                </span>
              </div>
            </div>

            <button
              type="button"
              className={css.favBtn}
              aria-pressed={isFavorite}
              aria-label={
                user
                  ? isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                  : "Login required"
              }
              disabled={!user}
              onClick={() => onToggleFavorite?.()}
            >
              <svg
                className={`${css.favIcon} ${
                  isFavorite ? css.favIconFilled : css.favIconOutline
                }`}
                aria-hidden="true"
              >
                <use href="/vite.svg#icon-heard" />
              </svg>
            </button>
          </div>
        </header>

        <ul className={css.chips} aria-label="Profile details">
          <li className={css.chip}>
            <span className={css.chipLabel}>Age:</span>
            <span className={css.chipValue}>{age}</span>
          </li>

          <li className={css.chip}>
            <span className={css.chipLabel}>Experience:</span>
            <span className={css.chipValue}>{experienceYears} years</span>
          </li>

          <li className={css.chip}>
            <span className={css.chipLabel}>Kids Age:</span>
            <span className={css.chipValue}>{kidsAgeRange}</span>
          </li>

          <li
            className={`${css.chip} ${css.chipWide}`}
            title={characters.join(", ")}
          >
            <span className={css.chipLabel}>Characters:</span>
            <span className={`${css.chipValue} ${css.chipTruncate}`}>
              {characters.join(", ")}
            </span>
          </li>

          <li className={`${css.chip} ${css.chipWide}`} title={education}>
            <span className={css.chipLabel}>Education:</span>
            <span className={`${css.chipValue} ${css.chipTruncate}`}>
              {education}
            </span>
          </li>
        </ul>

        <p className={css.about}>{about}</p>

        {!isExpanded && (
          <button
            type="button"
            className={css.readMore}
            onClick={onToggleReadMore}
          >
            Read more
          </button>
        )}

        {isExpanded && (
          <>
            {reviews.length > 0 && (
              <ul className={css.reviews} aria-label="Reviews">
                {reviews.map((r) => (
                  <li
                    key={`${r.reviewer}-${r.comment}`}
                    className={css.reviewItem}
                  >
                    <div className={css.reviewRow}>
                      <div className={css.reviewAvatar} aria-hidden="true">
                        {getInitials(r.reviewer)}
                      </div>

                      <div className={css.reviewContent}>
                        <div className={css.reviewHeader}>
                          <span className={css.reviewName}>{r.reviewer}</span>
                          <span className={css.reviewRating}>
                            <svg
                              className={css.ctaIcon_star}
                              width="16"
                              height="16"
                              aria-hidden="true"
                            >
                              <use href="/vite.svg#icon-Star" />
                            </svg>
                            {r.rating.toFixed(1)}
                          </span>
                        </div>

                        <p className={css.reviewComment}>{r.comment}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className={css.appointmentBtn}
              disabled={!user}
              aria-label={user ? "Make an appointment" : "Login required"}
              onClick={openModal}
            >
              Make an appointment
            </button>

            <Modal isOpen={isAppointment} onClose={closeModal}>
              <AppointmentForm
                nannyName={name}
                avatar_url={avatarUrl}
                onClose={closeModal}
              />
            </Modal>
          </>
        )}
      </div>
    </section>
  );
}
