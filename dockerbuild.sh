docker build -t deepagenix-nginx-consul-template -f ./src/gateway/nginx-consul-template .
docker build -t deepagenix-component-python -f ./src/components/python/Dockerfile .
docker build -t deepagenix-core -f ./src/core/Dockerfile .