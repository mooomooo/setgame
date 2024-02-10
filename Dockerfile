# ---- Base Node ----
FROM node:20-alpine AS base
# set working directory
WORKDIR /app
# copy project file
COPY . /app

# expose port and define CMD
EXPOSE 8000
CMD [ "npm", "run-script", "dev" ]
