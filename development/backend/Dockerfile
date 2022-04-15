FROM node:12-alpine
WORKDIR /backend
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ ./src
RUN mkdir file
RUN mkdir file/static

ENTRYPOINT ["node", "src/index.js"]
