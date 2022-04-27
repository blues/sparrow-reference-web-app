#!/usr/bin/env bash

docker ps | grep -E "(sparrow-postgresql-container)" || 
    echo "sparrow-postgresql-container is NOT running." && exit 1
docker ps | head -n1
