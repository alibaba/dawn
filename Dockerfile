FROM nginx

LABEL MAINTAINER="Jeason<jitong.zjt@alibaba-inc.com>"

COPY ./docs /usr/share/nginx/html
