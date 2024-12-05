import React from "react";
import styles from "../styles/heros.module.css";

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

export default function Heros({ heroesstate }) {
  const baseUrl = "https://cdn.cloudflare.steamstatic.com";

  return (
    <>
      <div className={styles.pageContainer}>
        <h3>CHOOSE YOUR</h3>
        <h1 className={styles.text}>HERO</h1>
        <h3>
          With many heroes, you’ll find the perfect match for your playstyle on
          your way to victory.
        </h3>

        <div className={styles.filter}>dddd</div>
        <div className={styles.content}>
          {heroesstate.map((hero) => (
            <div className={styles.card} key={hero.id}>
              <div>
                <img src={`${baseUrl}${hero.img}`} alt={hero.localized_name} />
                <p>{hero.localized_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
