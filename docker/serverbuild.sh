#!/bin/bash

# 获取脚本所在目录，并切换到项目根目录
SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)
cd "${SCRIPT_DIR}/.." || { echo "无法切换到项目根目录"; exit 1; }

# 构建镜像
docker build -t deepagenix-nginx-upsync -f server/gateway/nginx-upsync/Dockerfile server
docker build -t deepagenix-component-python -f server/components/python/Dockerfile server
docker build -t deepagenix-main -f server/main/Dockerfile server