// pages/heroImage.js
// import { getHerostate } from './api/herostate';

const HeroImage = ({ heroesstate }) => {
  const baseUrl = "https://cdn.cloudflare.steamstatic.com";
  const heroData = {
    id: 145,
    name: "npc_dota_hero_kez",
    img: "/apps/dota2/images/dota_react/heroes/kez.png?",
    icon: "/apps/dota2/images/dota_react/heroes/icons/kez.png?"
  };

  const heroImage = `${baseUrl}${heroData.img}`;
  const heroIcon = `${baseUrl}${heroData.icon}`;

  return (
    <div>
      {/* แสดงรูปภาพของ hero */}
      <div style={{ margin: "10px 0" }}>
        <img src={heroImage} alt="Hero Image" />
        <img src={heroIcon} alt="Hero Icon" />
      </div>

      {/* แสดงข้อมูล heroState ที่ดึงมาจาก API */}
      <div>
        {heroesstate ? (
          <pre>{JSON.stringify(heroesstate, null, 2)}</pre> // แสดงข้อมูล JSON ของ heroState
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const response = await fetch('https://api.opendota.com/api/heroStats');
    const heroesstate = await response.json();
    console.log(heroesstate);
    console.log("////////");
    
    
    return{
        props:{
            heroesstate,
        },
    };
}

export default HeroImage;
