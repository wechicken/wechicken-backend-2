#/usr/bin/bash

echo "Code building..."

npx nest build &&
node build.js &&

echo "Code Successfully Built"