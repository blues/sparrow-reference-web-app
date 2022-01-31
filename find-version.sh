#!/usr/bin/env bash
echo "$(date --iso-8601 --utc)-$(git describe --exclude='*' --always --dirty=-delta)-#$GITHUB_RUN_NUMBER-$GITHUB_RUN_ATTEMPT"

