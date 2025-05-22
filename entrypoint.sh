#!/bin/bash

# 加载 .env 环境变量
source .env

echo "🔧 构建 Docker 镜像..."
sh docker/serverbuild.sh || { echo "❌ serverbuild.sh 执行失败"; exit 1; }

echo "📁 准备目录结构..."
mkdir -p appdata/consul
mkdir -p appdata/nginx
mkdir -p appdata/postgres
mkdir -p appdata/knowledge
mkdir -p appdata/elasticsearch

echo "📄 检查 nginx 配置文件..."
if [ ! -f appdata/nginx/nginx.conf ]; then
    cp -r server/gateway/nginx-upsync/conf.d appdata/nginx
    cp -r server/gateway/nginx-upsync/nginx.conf appdata/nginx/nginx.conf
    mkdir -p appdata/nginx/upstreams
    touch appdata/nginx/upstreams/servers_main.conf
fi

echo "📄 检查 elasticsearch 配置文件..."
if [ ! -f appdata/elasticsearch/elasticsearch.yml ]; then
    # 创建必要的目录结构
    mkdir -p appdata/elasticsearch/data
    mkdir -p appdata/elasticsearch/plugins
    mkdir -p appdata/elasticsearch/config
    # 复制配置文件
    cp -f docker/elasticsearch/elasticsearch.yml appdata/elasticsearch/config/elasticsearch.yml
    echo "📦 解压 Elasticsearch 插件..."
    plugins=$(find "docker/elasticsearch/plugins" -maxdepth 1 -name "*.tar.gz" 2>/dev/null)
    for tar in $plugins; do
        tar -xzf "$tar" -C "appdata/elasticsearch/plugins"
    done
fi

echo "🚀 启动服务..."
if ! docker-compose -p deepagenix -f docker-compose.yml up -d; then
  echo "❌ 启动服务失败"
  exit 1
fi

echo "✅ 所有服务已启动。访问 http://localhost:${NGINX_PORT}"