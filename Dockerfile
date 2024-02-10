# ---- Production Node ----
FROM node:20-alpine AS prod

# set working directory
WORKDIR /app

# set and expose port
ARG NODE_PORT=8000
ENV NODE_PORT $NODE_PORT
EXPOSE $NODE_PORT

# copy and install node dependencies
COPY package.json /app
COPY package-lock.json /app
RUN npm install --omit=dev

# copy project files
COPY server.js /app
COPY game.js /app
COPY client /app/client
COPY public /app/public

# run
ENV NODE_ENV production
CMD [ "npm", "start" ]

# ---- Development Node ----
FROM prod AS dev

# install all dependencies
RUN npm install

# run
COPY start_dev /app
CMD [ "npm", "run-script", "dev" ]
