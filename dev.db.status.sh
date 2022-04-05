#!/usr/bin/env bash

docker ps | grep -E "(sparrow-postgresql-container)" || 
    echo "No sparrow-postgresql-container is running." && exit 1
docker ps | head -n1
