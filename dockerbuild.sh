docker build -t deepagenix-nginx-upsync -f ./server/gateway/nginx-upsync/Dockerfile .
docker build -t deepagenix-component-python -f ./server/components/python/Dockerfile .
docker build -t deepagenix-main -f ./server/main/Dockerfile .