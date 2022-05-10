#!/usr/bin/env bash

# Bash strict
set -euo pipefail

readonly SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$SCRIPT_DIR" # cd to this script's dir

set -o allexport
source .env
set +o allexport

# To run a docker image with a clean database
docker run --rm \
  -d `# detached` \
  --net=host \
  --name sparrow-postgresql-container \
  -p $POSTGRES_PORT:5432 \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  postgres

#### Wait for database to come up.
readonly timeout_seconds=5
timeout $timeout_seconds bash -c \
  'until printf "" 2>>/dev/null >>/dev/tcp/localhost/$0; do sleep 1; done' $POSTGRES_PORT ||
  (
    echo "Err: database did not come up. Use ./dev.db.stop.sh and try again." && 
    exit 10
  )

#### Reset the Datastore and generate the datastore tables
yarn db:reset
#### Seed the datastore
yarn db:init
#### Update the datastore schema
yarn prisma db push --accept-data-loss

echo Database is now running the background. Use ./dev.db.stop.sh to stop it.
