import { React, useState, useEffect } from "react";
import styles from "../styles/heros.module.css";
import { useRouter } from "next/router";

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
  const [attribute, setAttribute] = useState("");
  const [name, setName] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleFilterClick = (filter) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (attribute === filter) {
        setAttribute("");
      } else {
        setAttribute(filter);
      }
    }, 400);
    console.log("Filter clicked:", filter, "Current attribute:", attribute); // For debugging
  };

  const handleCardClick = (heroName) => {
    router.push(`/herodetail/${heroName}`);
  };

  const isFavorite = (heroName) => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      return favorites.includes(heroName);
    }
    return false;
  };

  useEffect(() => {
    if (isTransitioning) {
      setTimeout(() => setIsTransitioning(false), 400);
    }
  }, [isTransitioning]);

  return (
    <>
      <div className={styles.pageContainer}>
        {/* Title of this page */}
        <h3>CHOOSE YOUR</h3>
        <h1 className={styles.text}>HERO</h1>
        <h3>With many heroes, you’ll find the perfect match for your playstyle onyour way to victory.</h3>

        {/* filter bar */}
        <div className={styles.filter}>
          <div className={styles.attributeContainer}>
            <pre>ATTRIBUTE:</pre>
            <img src="../Image/hero_strength.png" alt="Strength" onClick={() => handleFilterClick("str")}/>
            <img src="../Image/hero_agility.png" alt="Agility" onClick={() => handleFilterClick("agi")}/>
            <img src="../Image/hero_intelligence.png" alt="Intelligence" onClick={() => handleFilterClick("int")}/>
            <img src="../Image/hero_universal.png" alt="Universal" onClick={() => handleFilterClick("universal")}/>
          </div>

          {/*search*/}
          <div className={styles.search}>
            <input type="text"
            placeholder="Search Hero"
            value={name}
            onChange={(e) => setName(e.target.value)}></input>
          </div>
        </div>

        {/* show card */}
        <div
          className={`${styles.content} ${isTransitioning ? styles["fade-out"] : ""}`}>
          {heroesstate.filter((hero) => {
            if (attribute && attribute !== "universal" && hero.primary_attr !== attribute) {
              return false;
            }
            if (attribute === "universal" && hero.primary_attr !== "all") {
              return false;
            }
            if (name && !hero.localized_name.toLowerCase().includes(name.toLowerCase())) {
              return false;
            }
            return true;})
            .map((hero) => (
              <div className={styles.card} key={hero.id} onClick={() => handleCardClick(hero.localized_name)}>
                {isFavorite(hero.localized_name)? <i className={`fa-solid fa-bookmark ${styles.bookmark}`}></i>:null} 
                <div>
                  <img src={`${baseUrl}${hero.img}`} alt={hero.localized_name}/>
                  <p>{hero.localized_name}</p>
                </div>
              </div>))}
        </div>
      </div>
    </>
  );
}