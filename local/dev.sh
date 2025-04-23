#!/bin/bash

# Start the Docker Compose services in detached mode
docker compose -f ./local/docker-compose.db.yaml build
docker compose -f ./local/docker-compose.db.yaml up -d
