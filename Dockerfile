# FROM node:carbon

# # Create app directory

# ADD . /home/node/app
# WORKDIR /home/node/app

# EXPOSE 3999
# CMD [ "npm", "run","production" ]

FROM node:carbon

MAINTAINER jiangyan33 <17760745090>

# 创建 app 目录
WORKDIR /app

# 打包 app 源码
COPY . /app

EXPOSE 3999

ENV NODE_ENV production

CMD [ "node", "index.js" ]