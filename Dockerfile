FROM nginx:latest

COPY dist/index.js /usr/share/nginx/html/index.js
COPY dist/index.html /usr/share/nginx/html/index.html