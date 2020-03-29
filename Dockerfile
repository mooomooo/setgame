# ---- Base Node ----
FROM alpine:3.5 AS base
# install node
RUN apk add --no-cache nodejs-current tini 
# set working directory
WORKDIR /app
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY . /app

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN apk add --no-cache git
RUN git submodule update --init --recursive
RUN npm install --only=prod
RUN cp -R node_modules prod_node_modules
RUN npm install --only=dev
ENV NODE_ENV="production"
RUN npm run-script build

# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=dependencies /app/public ./public
# copy app sources
COPY server.js .
COPY game.js .
COPY start_prod .
COPY package.json .

# expose port and define CMD
EXPOSE 8000
CMD npm run-script prod

