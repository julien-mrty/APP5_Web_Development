# Stage 1: Build the application
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install phaser
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine
# Install envsubst
RUN apk add --no-cache gettext
# Copy the default config with placeholders
COPY default.conf /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom Nginx config into the container
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Use a startup script to substitute variables
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]