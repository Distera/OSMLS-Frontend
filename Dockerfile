FROM node:16 as build
WORKDIR /source

# download protoc zip
ENV PROTOC_ZIP=protoc-3.14.0-linux-x86_64.zip
RUN curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v3.14.0/${PROTOC_ZIP}
RUN unzip -o ${PROTOC_ZIP} -d ./proto
RUN chmod 755 -R ./proto/bin
ENV BASE=/usr
# copy into path
RUN cp ./proto/bin/protoc ${BASE}/bin/
RUN cp -R ./proto/include/* ${BASE}/include/

RUN npm --global config set user root && npm --global install protoc-gen-ts && npm --global install ng-openapi-gen
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run-script generate-linux && npm run-script build

# install chrome for tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -  \
    && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable xvfb

RUN npm run test:ci

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /source/dist/osmls-frontend /usr/share/nginx/html
