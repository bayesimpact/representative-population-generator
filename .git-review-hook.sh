#!/bin/bash
function files_changed() {
  echo "$(git diff "${BRANCH}" origin/master... --name-only -- "$1")"
}

readonly REMOTE_BRANCH="$(git config "branch.${BRANCH}.merge" | sed -e s/^refs\\/heads\\///)"

for NOTEBOOK_FILE in "$(files_changed data_analysis/notebooks | grep .pynb$)"; do
  echo "Review directly on GitHub: [${NOTEBOOK_FILE}](https://github.com/bayesimpact/network-adequacy/blob/${REMOTE_BRANCH}/${NOTEBOOK_FILE})."
done
