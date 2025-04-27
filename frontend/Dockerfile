# Dockerfile para Frontend optimizado
FROM node:18

WORKDIR /app

# Copiar archivos de dependencias y luego instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
