FROM node:16-alpine as builder
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY . .
RUN ls -a
RUN npm install
RUN npm run build

FROM node:16-alpine as final

# create the appropriate directories
ENV APP_HOME=/home/node/app
ENV LDFLAGS="-L/usr/local/opt/openssl/lib"
ENV CPPFLAGS="-I/usr/local/opt/openssl/include"

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ENV envValue=prod

COPY package.json ./
RUN npm install --only=production

COPY --from=0 /usr/app/build .
COPY --from=0 /usr/app/index.html index.html
COPY --from=0 /usr/app/public public/
RUN npm install nodemon -g
EXPOSE 3000

CMD ["sh", "-c", "npm run start:${envValue}"]