#!/usr/bin/env bash
echo \
    "$(date --iso-8601 --utc)" \
    "$(git describe --exclude='*' --always --dirty=-delta)" \
    "$NETLIFY $BUILD_ID $CONTEXT" \

