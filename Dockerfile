FROM node:carbon

# Create app directory

ADD . /home/node/app
WORKDIR /home/node/app

EXPOSE 3999
CMD [ "npm", "run","production" ]