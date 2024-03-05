import functools, time, re
import decimal
import datetime

from flask import current_app as app
from flask import jsonify, make_response
from flask.json import JSONEncoder


def params_valid(start_range, end_range):
    if re.search("^[0-9]{2}/[0-9]{2}/[0-9]{4}$", start_range) and re.search("^[0-9]{2}/[0-9]{2}/[0-9]{4}$", end_range):
        return True
    return False

class JsonEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        if isinstance(obj, datetime.date):
            return obj.strftime('%m/%d/%y')
        return JSONEncoder.default(self, obj)

def api_response(func):
    @functools.wraps(func)
    def f(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        run_time = end_time - start_time        
        response = dict(result=result, time_ms=int(run_time*1000))
        app.json_encoder = JsonEncoder
        value = make_response(jsonify(response))
        value.headers['Access-Control-Allow-Origin'] = '*'
        return value
    return f