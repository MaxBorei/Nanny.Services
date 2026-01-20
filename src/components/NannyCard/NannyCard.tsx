import css from "./NannyCard.module.css";

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

  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onReadMore?: () => void;
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

  isFavorite = false,
  onToggleFavorite,
  onReadMore,
}: NannyCardProps) {
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
                  <svg
                    className={css.ctaIcon}
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <use href="/vite.svg#icon-map" />
                  </svg>
                </span>
                <span className={css.metaText}>{location}</span>
              </div>
              <div className={css.metaItem}>
                <span className={css.icon} aria-hidden="true">
                  <svg
                    className={css.ctaIcon_star}
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
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
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              onClick={onToggleFavorite}
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

        <button type="button" className={css.readMore} onClick={onReadMore}>
          Read more
        </button>
      </div>
    </section>
  );
}
