# 第一阶段：构建环境（使用完整基础镜像编译模块）
FROM debian:bullseye AS build

# 安装编译依赖
RUN apt-get update && \
    apt-get install -y \
    wget tar make gcc \
    libpcre3-dev zlib1g-dev libssl-dev

# 下载 nginx
ENV NGINX_VERSION=1.28.0
ENV NGINX_UPSYNC_VERSION=2.1.3
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz

# 下载 nginx-upsync-module
RUN wget https://github.com/weibocom/nginx-upsync-module/archive/refs/tags/v${NGINX_UPSYNC_VERSION}.tar.gz -O nginx-upsync-module.tar.gz && \
    tar -zxvf nginx-upsync-module.tar.gz

# 编译 nginx 并集成 upsync 模块
WORKDIR /nginx-${NGINX_VERSION}
RUN ./configure \
    --prefix=/usr/local/nginx \
    --with-http_ssl_module \
    --add-module=../nginx-upsync-module-${NGINX_UPSYNC_VERSION} && \
    make -j$(nproc) && \
    make install

# 第二阶段：运行时环境（使用轻量级镜像）
FROM debian:bullseye-slim AS runtime

# 安装运行依赖
RUN apt-get update && \
    apt-get install -y libpcre3 zlib1g openssl && \
    rm -rf /var/lib/apt/lists/*

# 从构建阶段复制编译结果
COPY --from=build /usr/local/nginx /usr/local/nginx

# 暴露端口并设置启动命令
EXPOSE 80 443
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]