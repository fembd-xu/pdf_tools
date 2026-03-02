# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# 配置 MIME 类型，确保 .mjs 文件被识别为 JavaScript
RUN sed -i 's|application/javascript|application/javascript mjs|g' /etc/nginx/mime.types || \
    sed -i 's|application/x-javascript|application/x-javascript mjs|g' /etc/nginx/mime.types || \
    echo 'types { application/javascript mjs; }' >> /etc/nginx/conf.d/mime.types.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
