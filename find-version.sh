#!/usr/bin/env bash
echo \
    "$(date --rfc-3339=seconds)" \
    "$(git describe --exclude='*' --always --dirty=-delta)" \
    "GH#$GITHUB_RUN_NUMBER-$GITHUB_RUN_ATTEMPT" \
    "N=$BUILD_ID $CONTEXT" \

