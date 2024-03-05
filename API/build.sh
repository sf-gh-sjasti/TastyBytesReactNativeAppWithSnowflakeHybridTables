#!/bin/bash
npm install
virtualenv venv --python=python3
source ./venv/bin/activate
pip install -r requirements.txt
node ./node_modules/serverless/bin/serverless wsgi serve