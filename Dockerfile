FROM nginx:latest

COPY dist/index.js /app/index.js
COPY dist/index.html /app/index.html
COPY nginx.conf /etc/nginx/nginx.conf