# Usamos Node como base
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY package.json package-lock.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto en el que correrá React
EXPOSE 8081

# Comando para ejecutar la aplicación
CMD ["npm", "start"]