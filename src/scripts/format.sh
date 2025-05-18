#!/bin/bash

set -ex

npx prettier . --write \
  "!.prettierrc" \
  "!**/global.css" \
  "!**/package-lock.json" \
  "!**/package.json" \
  "!**/postcss.config.mjs" \
  "!**/tsconfig.json" \
  "!**/next-env.d.ts" \
  "!**/next.config.ts" \
  "!**/app/generated/**" \
  "!**/primas.config.ts" \

