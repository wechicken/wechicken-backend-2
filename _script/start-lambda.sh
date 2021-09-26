#/usr/bin bash

export STAGE="local"

npx sls offline start --skipCacheInvalidation --processName Wechicken &
