FROM node:20-alpine
WORKDIR /server
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 8044
CMD ["node", "src/index.js"]