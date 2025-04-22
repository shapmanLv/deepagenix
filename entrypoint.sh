sh dockerbuild.sh && \
if [ ! -d appdata ]; then mkdir appdata; fi && \
if [ ! -d appdata/consul ]; then mkdir appdata/consul; fi && \
docker-compose up -d