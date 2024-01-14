FROM node:18-alpine as builder
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY . .
RUN ls -a
RUN yarn
RUN yarn build

FROM node:18-alpine as final

# create the appropriate directories
ENV APP_HOME=/home/node/app
ENV LDFLAGS="-L/usr/local/opt/openssl/lib"
ENV CPPFLAGS="-I/usr/local/opt/openssl/include"

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ENV envValue=prod

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=0 /usr/app/build .
COPY --from=0 /usr/app/index.html index.html
COPY --from=0 /usr/app/public public/
RUN yarn add nodemon -g
EXPOSE 3000

CMD ["sh", "-c", "yarn start:${envValue}"]