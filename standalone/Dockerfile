# build environment
FROM node:13.12.0-alpine as build
WORKDIR /
COPY . .
RUN npm install
RUN npm run build
# production environment
FROM nginx:stable-alpine
ADD build/ /usr/share/nginx/html
ADD nginx/ /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
