import styles from "../../styles/herodetail.module.css";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { heroName } = context.query;
  const response = await fetch("https://api.opendota.com/api/heroStats");
  const heroesstate = await response.json();

  const heroData = heroesstate.find(
    (hero) => hero.localized_name.toLowerCase() === heroName.toLowerCase()
  );
  console.log(heroData);
  

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
  }, [heroData.primary_attr]);

  const handleChangeHero = (heroName) => {
    router.push(`/herodetail/${heroName}`);
  };

  return (
    <>
    <div className={styles.content}>
      <div className={styles.heroName}>
        <div className={styles.attribute}>
          <img src={`../Image/hero_${attribute}.png`} alt={attribute} />
          <p>{attribute}</p>
        </div>
        <h1 className={styles.name}>{heroData.localized_name}</h1>
        <p style={{fontSize: '24px'}}>ATTACK TYPE</p>
        <div style={{ display: 'flex' ,alignItems: 'center',marginTop:'-30px'}}>
          <img src={`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/icons/${heroData.attack_type.toLowerCase()}.svg`} alt={attribute} style={{width: '30px',height: '30px'}}/>
          <p style={{marginLeft:'20px',fontSize: '20px'}}>{heroData.attack_type.toUpperCase()}</p>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img src={`${baseUrl}${heroData.img}`} alt={heroData.localized_name} />
      </div>
    </div>
    <div className={styles.stats} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{
          width: '20vw', 
          height: '40vh', 
          color:'antiquewhite',
          margin:'10px'
      }}>
        <h1 style={{textAlign:'center',margin:'20px'}}>ATTRIBUTE</h1>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`../Image/hero_strength.png`} alt="Hero Strength" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_str}</span>
            <span style={{ fontSize: '1.2em', marginLeft: '5px' }}>+ {heroData.str_gain}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`../Image/hero_agility.png`} alt="Hero Agility" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_agi}</span>
            <span style={{ fontSize: '1.2em', marginLeft: '5px' }}>+ {heroData.agi_gain}</span>
          </span>
        </div>
        <div style={{display:'flex',margin:'20px'}}>
          <img src={`../Image/hero_intelligence.png`} alt="Hero Intelligence" />
          <span style={{ marginLeft: '10px',alignContent:'center' }}>
            <span style={{ fontSize: '1.5em' }}>{heroData.base_int}</span>
            <span style={{ fontSize: '1.2em', marginLeft: '5px' }}>+ {heroData.int_gain}</span>
          </span>
        </div>
      </div>
      <div style={{ width: '20vw', height: '40vh', backgroundColor: 'red' }}></div>
      <div style={{ width: '20vw', height: '40vh', backgroundColor: 'green' }}></div>
      <div style={{ width: '20vw', height: '40vh', backgroundColor: 'black' }}></div>
    </div>


    <div className={styles.buttonContainer}>
      {pre ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className={styles.preButton} onClick={() => handleChangeHero(pre.localized_name)}>{'<'}</button>
          <img className={styles.icon} src={`${baseUrl}${pre.icon}`} alt="Previous Hero"/>
        </div>) : null}

      {next ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img className={styles.icon} src={`${baseUrl}${next.icon}`} alt="Next Hero"/>
          <button className={styles.nextButton} onClick={() => handleChangeHero(next.localized_name)}>{'>'}</button>
        </div>) : null}
    </div>
    </>
  );
}