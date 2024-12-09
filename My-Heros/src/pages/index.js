import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';
import styles from "../styles/home.module.css"

export default function Home() {

  return (
    <>
    <div className={styles.pageContainer}>
      <h1>WELCOME TO DOTA 2</h1>
    </div>
    </>
  );
}