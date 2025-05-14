docker build -t deepagenix-nginx-upsync -f ./src/gateway/nginx-upsync/Dockerfile .
docker build -t deepagenix-component-python -f ./src/components/python/Dockerfile .
docker build -t deepagenix-main -f ./src/main/Dockerfile .