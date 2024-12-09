import styles from '../styles/adminboard.module.css';
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
    const fetchData = () => {
      fetch("http://localhost:5000/api/heroes")
        .then((response) => response.json())
        .then((data) => {
          const sortedHeroes = data.sort((a, b) => b.nub - a.nub).slice(0, 10);
          setFavorites(sortedHeroes);
        })
        .catch((error) => console.error("Error fetching heroes:", error));
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getHeroImage = (heroName) => {
    const hero = heroesstate.find((hero) => hero.localized_name === heroName);
    return hero ? `${baseUrl}${hero.img}` : "";
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <h1>TOP 10 FAVORITES HERO</h1>
      </div>
      <div className={styles.content}>
        {favorites.map((hero) => (
            <div className={styles.card}>
                <p className={styles.score}>{hero.nub}</p>
                <div>
                <img
                    src={getHeroImage(hero.name)}
                    alt={hero.name}
                />
                <p>{hero.name}</p>
                <p className={styles.lastUpdate}>Last update: {hero.time.slice(0,10)}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
