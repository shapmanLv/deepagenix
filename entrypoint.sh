#!/bin/bash

# 加载 .env 环境变量
source .env

echo "🔧 构建 Docker 镜像..."
sh dockerbuild.sh || { echo "❌ dockerbuild.sh 执行失败"; exit 1; }

echo "📁 准备目录结构..."
mkdir -p appdata/consul
mkdir -p appdata/nginx
mkdir -p appdata/postgres
mkdir -p appdata/knowledge

echo "📄 检查 nginx 配置文件..."
if [ ! -f appdata/nginx/nginx.conf ]; then
    cp -r src/gateway/nginx-upsync/conf.d appdata/nginx
    cp -r src/gateway/nginx-upsync/nginx.conf appdata/nginx/nginx.conf
    mkdir appdata/nginx/upstreams
    touch appdata/nginx/upstreams/servers_main.conf
fi

echo "📄 检查 elasticsearch 配置文件 和 插件..."

echo "🚀 启动服务..."
docker-compose up -d

echo "✅ 所有服务已启动。访问 http://localhost:${NGINX_PORT}"