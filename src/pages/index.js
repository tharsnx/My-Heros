import React from "react";
import { useState, useEffect } from 'react';
import HeroImage from "./heroImage";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';

export default function Home() {
  const [heroes, setHeroes] = useState([]);
  const [error, setError] = useState(null);
  const [newHero, setNewHero] = useState({ localized_name: '', name: '' });

  // ฟังก์ชั่นสำหรับดึงข้อมูล Heroes
  useEffect(() => {
    fetch('http://localhost:5000/api/heroes')
      .then(response => response.json())
      .then(data => setHeroes(data))
      .catch(error => setError('Error fetching heroes: ' + error.message));
  }, []);

  // ฟังก์ชั่นสำหรับการเพิ่ม Hero
  const handleAddHero = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/heroes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHero),
    });

    if (response.ok) {
      const addedHero = await response.json();
      setHeroes([...heroes, addedHero]);  // เพิ่ม Hero ที่เพิ่งเพิ่มเข้ามาใน list
      setNewHero({ localized_name: '', name: '' });  // เคลียร์ฟอร์ม
    } else {
      const errorData = await response.json();
      setError(errorData.message);
    }
  };

  return (
    <div>
      <h1 style={{color:'black'}}>List of Heroes</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleAddHero}>
        <div>
          <label>Localized Name:</label>
          <input
            type="text"
            value={newHero.localized_name}
            onChange={(e) => setNewHero({ ...newHero, localized_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newHero.name}
            onChange={(e) => setNewHero({ ...newHero, name: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Hero</button>
      </form>

      <ul>
        {heroes.map(hero => (
          <li key={hero.id}>
            <strong>{hero.localized_name}</strong> ({hero.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
