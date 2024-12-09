import styles from '../styles/myfavorit.module.css';
import { React, useState, useEffect } from "react";

export async function getServerSideProps() {
  const response = await fetch("https://api.opendota.com/api/heroStats");
  const heroesstate = await response.json();
  heroesstate.sort((a, b) => a.localized_name.localeCompare(b.localized_name));

  return {
    props: {
      heroesstate,
    },
  };
}

export default function Myfavorit({ heroesstate }) {
  const [favorites, setFavorites] = useState([]);
  const baseUrl = "https://cdn.cloudflare.steamstatic.com";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(storedFavorites);
    }
  }, []);

  const isFavorite = (heroName) => {
    return favorites.includes(heroName);
  };

  const handleUnfavorit = (heroName) => {
    if (typeof window !== "undefined") {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const updatedFavorites = storedFavorites.filter((name) => name !== heroName);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <h1>THIS IS YOUR FAVORITES</h1>
      </div>

      <div className={styles.content}>
        {heroesstate.filter((hero) => favorites.includes(hero.localized_name)).map((hero) => (
          <div className={styles.card} key={hero.id}>
            {isFavorite(hero.localized_name) ? (
              <i
                className={`fa-solid fa-bookmark ${styles.bookmark}`}
                onClick={() => handleUnfavorit(hero.localized_name)}
              ></i>
            ) : null}
            <div>
              <img src={`${baseUrl}${hero.img}`} alt={hero.localized_name} />
              <p>{hero.localized_name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
