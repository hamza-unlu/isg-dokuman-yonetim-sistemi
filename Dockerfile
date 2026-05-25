# ─── ÜNLÜ İSG — Node.js Dockerfile ───
FROM node:20-slim

# Çalışma dizini
WORKDIR /app

# Önce package dosyalarını kopyala (cache optimizasyonu)
COPY package*.json ./

# Bağımlılıkları kur (sadece production)
RUN npm install --omit=dev --legacy-peer-deps

# Uygulama kodunu kopyala
COPY . .

# Yüklenen dosyalar için klasör (uploads .dockerignore'da, container içinde oluştur)
RUN mkdir -p uploads/profil uploads/mevzuat

# Port (Render PORT env değişkenini kullanır)
EXPOSE 5500

# Uygulamayı başlat
CMD ["node", "server.js"]