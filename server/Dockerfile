FROM alpine:3.18

ENV NODE_VERSION 14.17.5
WORKDIR /app

# Copy only the package files to leverage Docker caching
COPY package.json .
COPY package-lock.json .

# Install npm dependencies
RUN apk add --update nodejs npm \
    && npm install

# Copy the rest of the application code
COPY . .

CMD ["npm", "start"]
