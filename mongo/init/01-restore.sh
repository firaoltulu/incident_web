#!/bin/bash
set -e

echo "Restoring Midroc_Accident..."
mongorestore \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --nsInclude "Midroc_Accident.*" \
  /docker-entrypoint-initdb.d/dump
echo "Restore complete"