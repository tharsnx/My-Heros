import React from "react";
import { useState, useEffect } from 'react';
import HeroImage from "./heroImage";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  const [heroes, setHeroes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // เรียก API ของ Express.js
    fetch('http://localhost:5000/api/heroes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setHeroes(data))  // ตั้งค่า heroes ใน state
      .catch((error) => setError('Error fetching heroes: ' + error.message));  // จัดการ error
  }, []);  // ทำงานเมื่อ component mount ครั้งแรก

  return (
    <div>
      <h1>List of Dota 2 Heroes!!</h1>
      {error && <p>{error}</p>} {/* แสดงข้อความ error ถ้ามี */}
      <ul>
        {heroes.map((hero) => (
          <li key={hero.id}>
            <strong>{hero.localized_name}</strong> ({hero.name})
          </li>
        ))}
      </ul>
    </div>
  );
}