const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // โหลดตัวแปรจาก .env

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// เชื่อมต่อกับฐานข้อมูล PostgreSQL
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'postgres',
  logging: false,
});

// ทดสอบการเชื่อมต่อ
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Unable to connect to the database:', err));

// สร้างโมเดล Hero (ถ้าจำเป็น)
const Hero = sequelize.define('Hero', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  localized_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Sync โมเดลกับฐานข้อมูล (สร้างตารางหากยังไม่มี)
sequelize.sync()
  .then(() => console.log('Hero table created successfully'))
  .catch((err) => console.error('Error syncing database:', err));

// สร้าง API สำหรับดึงข้อมูล Heroes
app.get('/api/heroes', async (req, res) => {
  try {
    const heroes = await Hero.findAll(); // ดึงข้อมูลจากฐานข้อมูล
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching heroes', error });
  }
});

// API สำหรับเพิ่ม Hero
app.post('/api/heroes', async (req, res) => {
  try {
    const { localized_name, name } = req.body;

    // ตรวจสอบข้อมูลก่อนเพิ่ม
    if (!localized_name || !name) {
      return res.status(400).json({ message: 'Localized name and name are required' });
    }

    // เพิ่ม Hero ลงในฐานข้อมูล
    const newHero = await Hero.create({
      localized_name,
      name,
    });

    res.status(201).json(newHero);  // ส่งข้อมูล Hero ที่เพิ่งเพิ่มไป
  } catch (error) {
    res.status(500).json({ message: 'Error adding hero', error });
  }
});


// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
