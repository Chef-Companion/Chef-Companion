FROM node:alpine as base

WORKDIR /frontend

COPY ./package.json /frontend/package.json

COPY ./package-lock.json /frontend/package-lock.json

RUN npm ci --include=dev

COPY . /frontend

FROM base as development

EXPOSE 3000

CMD ["npm", "run", "dev"]