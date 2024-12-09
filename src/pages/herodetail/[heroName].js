import styles from "../../styles/herodetail.module.css";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import '@fortawesome/fontawesome-free/css/all.min.css';

export async function getServerSideProps(context) {
  const { heroName } = context.query;
  const response = await fetch("https://api.opendota.com/api/heroStats");
  const heroesstate = await response.json();

  const heroData = heroesstate.find(
    (hero) => hero.localized_name.toLowerCase() === heroName.toLowerCase()
  );

  if (!heroData) {
    return {
      notFound: true,
    };
  }
  const currentIndex = heroesstate.indexOf(heroData);
  const pre = currentIndex > 0 ? heroesstate[currentIndex - 1] : null;
  const next =
    currentIndex < heroesstate.length - 1 ? heroesstate[currentIndex + 1] : null;

  return {
    props: {
      heroData,
      pre: pre ? pre : null,
      next: next ? next : null,
    },
  };
}



export default function HeroDetail({ heroData, pre, next }) {
  const baseUrl = "https://cdn.cloudflare.steamstatic.com";
  const [attribute, setAttribute] = useState('');
  const router = useRouter();
  const [isHeroFavorite,setFavorit] = useState(false);
  

  useEffect(() => {
    if (heroData.primary_attr === 'str') {
      setAttribute('strength');
    } else if (heroData.primary_attr === 'agi') {
      setAttribute('agility');
    } else if (heroData.primary_attr === 'int') {
      setAttribute('intelligence');
    } else {
      setAttribute('universal');
    }
    logFavorites();
    setFavorit(isFavorite(heroData.localized_name));
  }, [heroData.primary_attr]);

  const handleChangeHero = (heroName) => {
    router.push(`/herodetail/${heroName}`);
  };

  const isFavorite = (heroName) => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      return favorites.includes(heroName);
    }
    return false;
  };

  const logFavorites = () => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      console.log('Favorites:', favorites);
    }
  };
  
  const handleFavorit = async (heroName) => {
    if (typeof window === 'undefined') return;
  
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    if (favorites.includes(heroName)) {
      // ลบ heroName ออกจาก Favorites
      try {
        const response = await fetch('http://localhost:5000/api/deletenub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ heroName }),
        });
  
        if (response.ok) {
          const updatedFavorites = favorites.filter((name) => name !== heroName);
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
          console.error('Failed to decrement nub:', await response.json());
        }
      } catch (error) {
        console.error('Error while decrementing nub:', error.message);
      }
    } else {
      // เพิ่ม heroName เข้า Favorites
      try {
        const response = await fetch('http://localhost:5000/api/addnub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ heroName }),
        });
  
        if (response.ok) {
          favorites.push(heroName);
          localStorage.setItem('favorites', JSON.stringify(favorites));
        } else {
          console.error('Failed to increment nub:', await response.json());
        }
      } catch (error) {
        console.error('Error while incrementing nub:', error.message);
      }
    }
    logFavorites();
    setFavorit(isFavorite(heroName));
  };
  
  

  return (
    <>
    <div className={styles.favorit}>
        <i className={`fa-solid fa-bookmark ${styles.bookmark}`}></i>
        <i className={`fa-solid fa-heart ${styles.heart}`} onClick={() => handleFavorit(heroData.localized_name)} style={{ color: isHeroFavorite ? 'red' : 'gray' }}></i>
      </div>

    <div className={styles.content}>
      <div className={styles.heroName}>
        <div className={styles.attribute}>
          <img src={`../Image/hero_${attribute}.png`} alt={attribute} />
          <p>{attribute}</p>
        </div>
        <h1 className={styles.name}>{heroData.localized_name.toUpperCase()}</h1>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
          <div>
            <h1 style={{fontSize: '24px'}}>ATTACK TYPE</h1>
            <div style={{ display: 'flex' ,alignItems: 'center',marginTop:'-30px'}}>
              <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${heroData.attack_type.toLowerCase()}.svg`} alt={attribute} style={{width: '30px',height: '30px'}}/>
              <p style={{marginLeft:'20px',fontSize: '20px'}}>{heroData.attack_type.toUpperCase()}</p>
            </div>
          </div>
          <div style={{marginLeft:'20px'}}>
            <h1 style={{fontSize: '24px'}}>WINRATE</h1>
            <div style={{ display: 'flex' ,alignItems: 'center',marginTop:'-30px',marginBottom:'10px'}}>
              <p style={{fontSize: '22px'}}>Turbo Match: {(heroData.turbo_wins *100 /heroData.turbo_picks).toFixed(2)}%</p>
            </div>
            <div style={{ display: 'flex' ,alignItems: 'center',marginTop:'-30px',marginBottom:'10px'}}>
              <p style={{fontSize: '22px'}}>Public Match: {(heroData.pub_win *100 /heroData.pub_pick).toFixed(2)}%</p>
            </div>
            <div style={{ display: 'flex' ,alignItems: 'center',marginTop:'-30px'}}>
              <p style={{fontSize: '22px'}}>Ban Rate: {(heroData.pro_ban *100 /(heroData.pro_pick+heroData.pro_ban)).toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
      </div>
      <div className={styles.heroImage}>
        <img src={`${baseUrl}${heroData.img}`} alt={heroData.localized_name} />
      </div>
    </div>
    <div className={styles.stats} style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/*base of current Hero attribute*/}
      <div style={{width: '20vw', height: '40vh', color:'antiquewhite',margin:'10px'}}>
        <h3 style={{textAlign:'center',margin:'20px',fontSize: '24px'}}>ATTRIBUTE</h3>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`../Image/hero_strength.png`} alt="Hero Strength" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_str}</span>
            <span style={{ fontSize: '1.2em', marginLeft: '5px' }}>+ {heroData.str_gain.toFixed(1)}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`../Image/hero_agility.png`} alt="Hero Agility" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_agi}</span>
            <span style={{ fontSize: '1.2em', marginLeft: '5px' }}>+ {heroData.agi_gain.toFixed(1)}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`../Image/hero_intelligence.png`} alt="Hero Intelligence" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_int}</span>
            <span style={{ fontSize: '1.2em', marginLeft: '5px' }}>+ {heroData.int_gain.toFixed(1)}</span>
          </span>
        </div>
      </div>
      
      {/*base of current Hero attack*/}
      <div style={{width: '20vw', height: '40vh', color:'antiquewhite',margin:'10px'}}>
        <h3 style={{textAlign:'center',margin:'20px',fontSize: '24px'}}>ATTACK</h3>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_damage.png`} alt="" />
          <span style={{ fontSize: '1.5em', marginLeft: '10px',alignContent:'center'  }}>{(() => {
            const totalAttributeBonus = heroData.base_str + heroData.base_agi + heroData.base_int;
            if (heroData.primary_attr === "all") {return `${heroData.base_attack_min + totalAttributeBonus}-${heroData.base_attack_max + totalAttributeBonus}`;}
            const primaryAttrBonus = heroData[`base_${heroData.primary_attr}`];
            return `${heroData.base_attack_min + primaryAttrBonus}-${heroData.base_attack_max + primaryAttrBonus}`;})()}
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_attack_time.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.attack_rate}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_attack_range.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.attack_range}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_projectile_speed.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.projectile_speed}</span>
          </span>
        </div>
      </div>

      {/*base of current Hero defense*/}
      <div style={{width: '20vw', height: '40vh', color:'antiquewhite',margin:'10px'}}>
        <h3 style={{textAlign:'center',margin:'20px',fontSize: '24px'}}>DEFENSE</h3>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_armor.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{((0.06 / (1 + 0.06 * heroData.base_armor)) * 100).toFixed(1)}%</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_magic_resist.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_mr}%</span>
          </span>
        </div>
      </div>
      

      {/*base of current Hero Mobility*/}
      <div style={{width: '20vw', height: '40vh', color:'antiquewhite',margin:'10px'}}>
        <h3 style={{textAlign:'center',margin:'20px',fontSize: '24px'}}>MOBILITY</h3>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_movement_speed.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.move_speed}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_turn_rate.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.turn_rate? heroData.turn_rate.toFixed(1):0.6}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react//heroes/stats/icon_vision.png`} alt="" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.day_vision}/{heroData.night_vision}</span>
          </span>
        </div>
      </div>
    </div>
    <div className={`${styles.buttonContainer} ${pre && next ? styles.both : pre ? styles.left : styles.right}`}>
      {pre ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className={styles.preButton} onClick={() => handleChangeHero(pre.localized_name)}>{'<'}</button>
          <img className={styles.icon} src={`${baseUrl}${pre.icon}`} alt="Previous Hero" />
        </div>) : null}

      {next ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className={styles.icon} src={`${baseUrl}${next.icon}`} alt="Next Hero" />
          <button className={styles.nextButton} onClick={() => handleChangeHero(next.localized_name)}>{'>'}</button>
        </div>) : null}
    </div>
    </>
  );
}