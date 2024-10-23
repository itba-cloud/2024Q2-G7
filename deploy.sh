#!/bin/bash

cd frontend && npm install && npm run build
terraform -chdir=backend init
terraform -chdir=backend apply -auto-approve