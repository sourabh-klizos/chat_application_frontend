
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install --frozen-lockfile

ARG VITE_API_BASE_URL
ARG VITE_API_BASE_URL_WS

COPY . .

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_BASE_URL_WS=$VITE_API_BASE_URL_WS


RUN npm run build

FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]












# docker build --build-arg VITE_API_BASE_URL=http://localhost:8000 \
#              --build-arg VITE_API_BASE_URL_WS=ws://localhost:8000/ws \
#              -t my-vite-app .


# docker run -d -p 8080:80 --name vite-container my-vite-app



# docker build --build-arg VITE_API_BASE_URL=http://localhost:8000  --build-arg VITE_API_BASE_URL_WS=ws://localhost:8000/ws  -t my-vite-app .