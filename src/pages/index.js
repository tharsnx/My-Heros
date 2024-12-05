import React from "react";
import HeroImage from "./heroImage";

export async function getServerSideProps() {
  const response = await fetch('https://api.opendota.com/api/heroes');
  const heroes = await response.json();

  return {
    props: {
      heroes,
    },
  };
}

export default function Home({ heroes }) {
  return (
    <div>
      <h1>List of Dota 2 Heroes!!</h1>
      <ul>
        {heroes.map((hero) => (
          <li key={hero.id}>
            <strong>{hero.localized_name}</strong> ({hero.name})
          </li>
        ))}
      </ul>
      <HeroImage/>
    </div>
  );
}