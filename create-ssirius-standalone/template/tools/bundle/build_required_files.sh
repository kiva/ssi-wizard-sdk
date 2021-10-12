#!/bin/bash

BASEDIR=$(dirname "$0")

cp "$BASEDIR/../../src/config.ts" "$BASEDIR/js"

npm run compile -- --project "$BASEDIR/../tsconfig.json"

node "$BASEDIR/js/createTranslationFile.js"

# For whatever reason, running `rm "$BASEDIR/js/*.js` didn't actually clean the files
# So... here we are
for file in `ls "$BASEDIR/js"`; do
    if [[ "js" == "${file##*.}" ]]; then
        rm "$BASEDIR/js/$file"
    fi
done

rm "$BASEDIR/js/config.ts"
