#!/bin/bash

cd `dirname $0`
npm run build || /usr/local/nodejs/bin/npm run build || exit 1

exit 0