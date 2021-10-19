#!/bin/bash

BASEDIR=$(dirname "$0")

cp "$BASEDIR/../../src/constants.ts" "$BASEDIR/js"

npm run compile -- --project "$BASEDIR/../tsconfig.json"

node "$BASEDIR/js/createTranslationFile.js"

echo "Running rm $BASEDIR/js/createTranslationFile.js"
rm "$BASEDIR/js/createTranslationFile.js"
rm "$BASEDIR/js/constants.js"
