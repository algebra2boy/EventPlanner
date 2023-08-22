FROM node:alpine

RUN npm install -g pm2

WORKDIR /usr/app

# copy dependency from package.json to the usr/app
COPY ./package.json ./
# install all the dependency from package.json
RUN npm install

# Remove node module before buildin the image
COPY ./ ./

# this run the `docker-start` script from the package.json
CMD ["npm", "run", "docker-start"]
