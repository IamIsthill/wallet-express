#!/bin/bash

set -e  # Exit on error

# Start Docker Compose
docker compose -f ./local/docker-compose.sql.yaml up
