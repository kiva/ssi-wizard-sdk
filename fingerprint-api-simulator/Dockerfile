FROM node:lts-alpine as built_app
WORKDIR /tmp
COPY . .
RUN npm install

FROM node:lts-alpine
WORKDIR /www
COPY --from=built_app /tmp/bin ./bin
COPY --from=built_app /tmp/node_modules ./node_modules
COPY --from=built_app /tmp/package.json ./package.json
CMD ["node", "bin/simulator.js"]
EXPOSE 9907