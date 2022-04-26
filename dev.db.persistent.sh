#!/usr/bin/env bash

# Bash strict
set -euo pipefail

readonly SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$SCRIPT_DIR" # cd to this script's dir

set -o allexport
source .env
set +o allexport

# docker container with database stored on host OS filesystem so it persists
docker run --rm \
  -d `# detached` \
  --net=host \
  --name sparrow-postgresql-container \
  -p $POSTGRES_PORT:5432 \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -v "sparrow.db.persistence.volume":/var/lib/postgresql/data \
  postgres

#### Update the datastore schema
yarn run db:update

#### Seed the datastore
yarn db:init

echo Database is now running the background. Use ./dev.db.stop.sh to stop it.
