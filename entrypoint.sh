#!/usr/bin/env bash

set -e

app="$IMMER_CY_APP_NAME"

function yarnInstall {
  if ping -q -c 1 -W 1 google.com >/dev/null; then
    echo -e "\nFetching and building node packages for app: $app."
    echo -e "Running: 'yarn install --frozen-lockfile'\n"

    yarn install --frozen-lockfile

    echo -e "\nDone running: 'yarn install --frozen-lockfile' for app: $app\n"
  fi
}

echo -e "\n\n :::::::: Starting App: $app :::::\n\n"
yarnInstall
yarn start "$app"
