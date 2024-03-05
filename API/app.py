from flask import Flask, jsonify, make_response
from endpoints import endpoints
from utils import api_response

app = Flask(__name__)
app.register_blueprint(endpoints)

@app.route("/")
@api_response
def default():
    return 'Nothing to see here'


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)

