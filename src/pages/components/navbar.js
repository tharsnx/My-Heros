import Link from "next/link";
import styles from "../../styles/navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <img src="/Image/png-transparent-dota-2-dota-2-logo-removebg-preview.png" alt="Dota 2 Logo" style={{ height: '50px', marginRight: '10px' }}/>
        <h1 style={{ margin: 0 }}>DOTA 2</h1>
      </div>

      <Link href="/" className={styles.link}>
        Home
      </Link>
      <Link href="/heros" className={styles.link}>
        Heroes
      </Link>
      <Link href="/myfavorit" className={styles.link}>
        My Favorite
      </Link>
      <a className={styles.download}href="https://store.steampowered.com/app/570/Dota_2/" target="_blank" rel="noopener noreferrer" >
        <p>PLAY FOR FREE</p>
      </a>

    </nav>
  );
}
