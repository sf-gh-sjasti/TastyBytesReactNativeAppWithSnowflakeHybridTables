# Tasty Bytes Driver App API

Technologies used: [Snowflake](https://snowflake.com/), [Python](https://www.python.org/), [Flask](https://palletsprojects.com/p/flask/), [Serverless Framework](https://www.serverless.com/)

Requirements: 
* Snowflake.com and Serverless.com account
* node.js, python 3, virtualenv installed

This project demonstrates how to build and deploy a custom API powered by Snowflake. 

## Configuration

Copy the serverless-template.yml to serverless.yml and modify the parameters according to your Snowflake configuration. Put your private key to your Snowflake user in AWS SSM is us-west-2 region under the parameter <ACCOUNT>.DATA_APPS_DEMO.

Install serverless and other required node packages and configure serverless (sls) for the project.

```bash
npm install
sls login
```

Create a virtualenv locally and install python packages.

```bash
virtualenv venv --python=python3.8
source ./venv/bin/activate
pip install -r requirements.txt
```

## Local Development

For local development you will want to use the venv previously created. This will run a local application server and connect to your Snowflake account for data access.

Start the local serverless server.

```bash
sls wsgi serve
```

### Invocation

After successful startup, you can call the created application via HTTP:

```bash
curl http://localhost:5000/
```

Which should result in the following response:

```json
{"result":"Nothing to see here", "time_ms": 0}
```