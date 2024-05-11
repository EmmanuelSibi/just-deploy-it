#!/bin/bash

#this is the main script that will be executed by the build server
#this script will clone the repository

export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

# Clone the repository
git clone "$GIT_REPOSITORY_URL" /home/app/output

exec node script.js
