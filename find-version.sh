#!/usr/bin/env bash
echo \
    "$(date --rfc-3339=seconds)" \
    "$(git describe --exclude='*' --always --dirty=-delta)" \

