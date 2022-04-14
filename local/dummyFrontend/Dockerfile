FROM nginx:mainline

RUN echo "<!doctype html>Dummy</html>" > /usr/share/nginx/html/index.html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]