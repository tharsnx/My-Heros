const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Unable to connect to the database:", err));

  const Board = sequelize.define("Board", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nub: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  
  

const Admin = sequelize.define('Admin',{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Admin.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

sequelize.drop()
  .then(() => {
    // Sync โมเดลกับฐานข้อมูล (สร้างตารางหากยังไม่มี)
    return sequelize.sync();
  })
  .then(() => {
    console.log("Hero table created successfully");

    // แสดงชื่อของตารางทั้งหมด
    return sequelize.getQueryInterface().showAllTables();
  })
  .then((tables) => {
    console.log("Tables in the database:", tables);
  })
  .catch((err) => console.error("Error syncing database:", err));



const seedAdmin = async () => {
  const adminCount = await Admin.count();
  if (adminCount === 0) {
    await Admin.create({ username: "admintest", password: "1234" });
  }
};

app.get("/api/heroes/nub", async (req, res) => {
  try {
    const heroes = await Board.findAll();
    console.log(heroes);
    
    if (heroes.length === 0) {
      return res.status(404).json({ message: "No heroes found" });
    }

    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching heroes", error });
  }
});

app.post("/api/addnub", async (req, res) => {
  const { heroName } = req.body;
  console.log(heroName);
  const heroes = await Board.findAll();
  console.log(heroes.length);
  let hero = await Board.findOne({ where: { name: heroName } });
  
  if (!hero) {
    hero = await Hero.create({
      name: heroName,
      nub: 1,
      time: new Date(),
    });
    console.log(hero);
    return res.status(201).json({ message: 'Hero created and nub initialized', hero });
  }
  hero.nub += 1;
  hero.time = new Date();
  await hero.save();
  console.log(hero);
});

app.post("/api/deletenub", async (req, res) => {
  const { heroName } = req.body;
  let hero = await Board.findOne({ where: { name: heroName } });
  if (hero) {
    hero.nub = Math.max(hero.nub - 1, 0);
    hero.time = new Date();
    await hero.save();
    console.log(hero);
    return res.status(200).json({ message: 'nub decremented', hero });
  }
  return res.status(404).json({ message: 'Hero not found' });
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await Admin.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({message: 'Login successful',token,});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
