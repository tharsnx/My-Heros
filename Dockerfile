FROM node:20-alpine

WORKDIR /app

# คัดลอก package.json และ package-lock.json มาติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดของแอป
COPY . .

# ทำการ build แอป
RUN npm run build

#พอร์ต 3000 สำหรับ frontend
EXPOSE 3000

CMD ["npm", "run", "dev"]
