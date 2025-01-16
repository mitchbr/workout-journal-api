FROM node:18-alpine

WORKDIR /usr/src/app
# TODO: Permissions
# RUN chown node:node ./
# USER node

COPY package*.json ./
# TODO: use yarn?
# TODO: split install based on env?
RUN yarn

# TODO: Only copy dist for prod?
COPY . .

# TODO: Thefuck is this for?
EXPOSE 1337

# TODO: Change this
CMD ["yarn", "dev"]