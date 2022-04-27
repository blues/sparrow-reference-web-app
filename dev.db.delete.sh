#!/usr/bin/env bash

# Bash strict
set -euo pipefail

# docker container with database stored on host OS filesystem so it persists
docker volume rm "sparrow.db.persistence.volume"

echo Persistent database deleted.
