#!/bin/bash

start_mongo() {
    mongod --replSet rs0 --bind_ip_all
}

activate_rs() {
    echo "Waiting for mongo to start..."
    sleep 5
    echo "Initiating replica set"
    mongosh --host mongo --eval "rs.initiate()"
}

start_mongo()
activate_rs()
