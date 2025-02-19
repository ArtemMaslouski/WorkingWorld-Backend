FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 3000

CMD ["npm", "run", "start:dev"]