import config
import requests
import uuid
from datetime import timedelta
from flask import Blueprint, request
import json
import datetime
from ast import literal_eval

from api_auth import JWTGenerator
from utils import api_response, params_valid


sqlapi = Blueprint('sqlapi', __name__)
authfn = JWTGenerator(config.SNOWFLAKE_ACCOUNT, config.SNOWFLAKE_USER, config.SNOWFLAKE_PRIVATE_KEY, timedelta(59), timedelta(54)).get_token
http_session = requests.Session()
url_base = f"https://{config.SNOWFLAKE_ACCOUNT}.snowflakecomputing.com"

HEADERS = {
    "Authorization": "Bearer " + authfn(),
    "Content-Type": "application/json",
    "Snowflake-Account": config.SNOWFLAKE_ACCOUNT,
    "Accept": "application/json",
    "X-Snowflake-Authorization-Token-Type": "KEYPAIR_JWT"
}

def sql2body(sql):
    result = {
        "statement": f"{sql}",
        "timeout": 180,
        "resultSetMetaData": {
            "format": "json"
        },
        "database": config.SNOWFLAKE_DATABASE,
        "schema": config.SNOWFLAKE_SCHEMA,
        "warehouse": config.SNOWFLAKE_WAREHOUSE,
        "parameters": {"query_tag": "Snowflake-Python-SQLApi"},
        }
    return result


def exec_and_fetch(sql):
    jsonBody = sql2body(sql)
    r = http_session.post(f"{url_base}/api/v2/statements?requestId={str(uuid.uuid4())}&retry=true", json=jsonBody, headers=HEADERS)
    if r.status_code == 200:
        result = r.json()['data']
        return result
    else:
        print(f"ERROR: Status code from {sql}: {r.status_code}")
        raise Exception("Invalid response from API")

# Location Id filter to be added
@sqlapi.route("/getInqueueOrders")
@api_response
def get_inqueue_orders():
    truckId = request.args.get('truck_id')
    currentTimestamp = request.args.get('currentTimestamp')
    d = datetime.datetime.strptime(currentTimestamp, '%Y-%m-%d %H:%M:%S')
    print(d.hour)
    sql = ""
    if d.hour >= 17 :
      sql = f"SELECT DISTINCT order_id, first_name, last_name, order_total, order_ts, gender \
            FROM {database}.analytics.data_app_orders_v \
            WHERE date = CURRENT_DATE() \
            AND HOUR(order_ts) >= '17' \
            AND truck_id = {truckId} \
            AND order_status = 'INQUEUE' \
            ORDER BY order_ts;"
    else :
      sql = f"SELECT DISTINCT order_id, first_name, last_name, order_total, order_ts, gender \
                  FROM {database}.analytics.data_app_orders_v \
                  WHERE date = CURRENT_DATE() \
                  AND HOUR(order_ts) <= '16' \
                  AND truck_id = {truckId} \
                  AND order_status = 'INQUEUE' \
                  ORDER BY order_ts;"
    return exec_and_fetch(sql)

# Location Id filter to be added
@sqlapi.route("/getOrderHistory")
@api_response
def get_order_history():
    truckId = request.args.get('truck_id')
    currentTimestamp = request.args.get('currentTimestamp')
    d = datetime.datetime.strptime(currentTimestamp, '%Y-%m-%d %H:%M:%S')
    sql = ""
    if d.hour >= 17 :
      sql = f"SELECT DISTINCT order_id, first_name, last_name, order_total, order_ts, gender \
            FROM {database}.analytics.data_app_orders_v \
            WHERE date = CURRENT_DATE() \
            AND HOUR(order_ts) >= '17' \
            AND truck_id = {truckId} \
            AND order_status = 'COMPLETED' \
            ORDER BY order_ts;"
    else :
      sql = f"SELECT DISTINCT order_id, first_name, last_name, order_total, order_ts, gender \
                  FROM {database}.analytics.data_app_orders_v \
                  WHERE date = CURRENT_DATE() \
                  AND HOUR(order_ts) <= '16' \
                  AND truck_id = {truckId} \
                  AND order_status = 'COMPLETED' \
                  ORDER BY order_ts;"
    return exec_and_fetch(sql)

@sqlapi.route("/getOrderDetails")
@api_response
def get_order_details():
    orderId = request.args.get('order_id')
    sql = f"SELECT SUM(quantity), menu_item_name, unit_price, order_amount, order_tax_amount, \
            order_discount_amount, order_total, order_status \
            FROM {database}.analytics.data_app_orders_v \
            WHERE order_id = {orderId} \
            GROUP BY 2,3,4,5,6,7,8;"
    return exec_and_fetch(sql)

@sqlapi.route("/updateOrderDetails")
@api_response
def update_order_details():
    orderId = request.args.get('order_id')
    sql = f"INSERT INTO {database}.raw_supply_chain.data_app_order_status \
            VALUES({orderId}, 'COMPLETED', CURRENT_DATE());"
    return exec_and_fetch(sql)

@sqlapi.route("/getWarehouseLocation")
@api_response
def get_warehouse_location():
    city = request.args.get('city')
    sql = f"SELECT TOP 1 warehouse_latitude, warehouse_longitude \
            FROM {database}.analytics.warehouse_inventory_v \
            WHERE warehouse_city = '{city}';"
    return exec_and_fetch(sql)

@sqlapi.route("/getReviewDetails")
@api_response
def get_review_details():
    surveyId = request.args.get('survey_id')
    truckId = request.args.get('truck_id')
    date = request.args.get('date')
    sql = f"SELECT (q1 + q2 + q3)/3 AS food, (q4 + q5)/2 AS service, (q6 + q7)/2 AS price, \
            (q8 + q9)/2 AS location, (q10 + q11)/2 AS experience \
            FROM {database}.analytics.app_surveys \
            WHERE survey_id = '{surveyId}' \
            AND truck_id = {truckId} \
            AND survey_ts = '{date}'"
    return exec_and_fetch(sql)

@sqlapi.route("/getReviewStats")
@api_response
def get_review_stats():
    truckId = request.args.get('truck_id')
    sql = f"SELECT (SUM(q1) + SUM(q2) + SUM(q3) + SUM(q4) + SUM(q5) + SUM(q6) + SUM(q7) + SUM(q8) + SUM(q9) \
            + SUM(q10) + SUM(q11)) / (11 * COUNT(*)) AS reviewAvg, COUNT(*) AS reviewCount \
            FROM {database}.analytics.app_surveys \
            WHERE truck_id = {truckId} \
            AND survey_ts <= CURRENT_DATE();"
    return exec_and_fetch(sql)

@sqlapi.route("/getDriverDetails")
@api_response
def get_driver_details():
    truckId = request.args.get('truck_id')
    sql = f"SELECT first_name, last_name \
            FROM {database}.raw_pos.franchise \
            WHERE franchise_id = (SELECT franchise_id \
                                  FROM {database}.raw_pos.truck \
                                  WHERE truck_id = {truckId});"
    return exec_and_fetch(sql)

@sqlapi.route("/getDailyDriverEarnings")
@api_response
def get_daily_driver_earnings():
    truckId = request.args.get('truck_id')
    currentTimestampHour = request.args.get('currentTimestampHour')
    sql = f"SELECT SUM(price) \
            FROM {database}.analytics.data_app_orders_v \
            WHERE truck_id = {truckId} \
            AND HOUR(order_ts) <= {currentTimestampHour} \
            AND date = CURRENT_DATE();"
    return exec_and_fetch(sql)

@sqlapi.route("/getAllTimeDriverEarnings")
@api_response
def get_all_time_driver_earnings():
    truckId = request.args.get('truck_id')
    currentTimestamp = request.args.get('currentTimestamp')
    sql = f"SELECT SUM(order_total) \
            FROM {database}.raw_pos.order_header \
            WHERE truck_id = {truckId} \
            AND order_ts <= '{currentTimestamp}';"
    return exec_and_fetch(sql)

@sqlapi.route("/getLocationsVisited")
@api_response
def get_locations_visited():
    truckId = request.args.get('truck_id')
    currentTimestamp = request.args.get('currentTimestamp')
    sql = f"SELECT COUNT(distinct location_id) \
            FROM {database}.raw_pos.order_header \
            WHERE order_ts <= '{currentTimestamp}' \
            AND truck_id = {truckId};"
    return exec_and_fetch(sql)

@sqlapi.route("/getMenuType")
@api_response
def get_menu_type():
    truckId = request.args.get('truck_id')
    sql = f"SELECT TOP 1 truck_brand_name, menu_type \
            FROM {database}.raw_pos.menu \
            WHERE menu_type_id = (SELECT menu_type_id \
                                  FROM {database}.raw_pos.truck \
                                  WHERE truck_id = {truckId});"
    return exec_and_fetch(sql)

@sqlapi.route("/getMenuItems")
@api_response
def get_menu_items():
    truckId = request.args.get('truck_id')
    sql = f"SELECT menu_item_name, sale_price_usd, image_url \
            FROM {database}.analytics.menu_item_v \
            WHERE menu_type_id = (SELECT menu_type_id \
                                  FROM {database}.raw_pos.truck \
                                  WHERE truck_id = {truckId}) \
                                  ORDER BY menu_item_name;"
    return exec_and_fetch(sql)

@sqlapi.route("/getInventorySold")
@api_response
def get_inventory_sold():
    truckId = request.args.get('truck_id')
    date = request.args.get('date')
    shift = request.args.get('shift')
    locationId = request.args.get('location_id')
    if shift == 'AM' :
        shiftSQL = "HOUR(order_ts) <= 16"
    else :
        shiftSQL = "HOUR(order_ts) > 16"
    sql = f"SELECT menu_item_name, SUM(quantity) AS total_quantity \
            FROM {database}.analytics.data_app_orders_history_v \
            WHERE date = '{date}' \
            AND {shiftSQL} \
            AND truck_id = {truckId} \
            AND location_id = {locationId} \
            GROUP BY menu_item_name;"
    return exec_and_fetch(sql)

@sqlapi.route("/getItemChecklist")
@api_response
def get_item_checklist():
    truckId = request.args.get('truck_id')
    shift = request.args.get('shift')
    locationId = request.args.get('location_id')
    date = request.args.get('date')
    sql = f"SELECT name, unit, (SELECT SUM(quantity) \
                                FROM {database}.analytics.app_current_inventory_v \
                                WHERE truck_id = {truckId} \
                                AND item_id = acr.item_id) AS current_quantity, quantity AS quantity_needed \
            FROM {database}.analytics.app_checklist_recommendations_v acr \
            WHERE location_id = {locationId} \
            AND date = '{date}' \
            AND shift = {shift} \
            AND menu_type_id = (SELECT menu_type_id \
                                FROM {database}.raw_pos.truck \
                                WHERE truck_id = {truckId}) \
            ORDER BY 1;"
    return exec_and_fetch(sql)

@sqlapi.route("/getInventoryOrder")
@api_response
def get_inventory_order():
    truckId = request.args.get('truck_id')
    sql = f"SELECT item_id, name, unit, (SELECT SUM(quantity) \
                                        FROM {database}.analytics.app_current_inventory_v \
                                        WHERE truck_id = {truckId} \
                                        AND item_id = aiq.item_id) AS current_quantity, \
            quantity AS quantity_needed, image_url \
            FROM {database}.analytics.app_inventory_order_v aiq \
            WHERE truck_id = {truckId} \
            ORDER BY 2;"
    return exec_and_fetch(sql)

@sqlapi.route("/getOrderSummary")
@api_response
def get_order_summary():
    truckId = request.args.get('truck_id')
    sql = f"SELECT item_id, item_name, unit, (SELECT SUM(quantity) \
                                              FROM {database}.analytics.app_current_inventory_v \
                                              WHERE truck_id = {truckId} \
                                              AND item_id = ads.item_id) AS current_quantity, \
            quantity AS quantity_needed, image_url \
            FROM {database}.analytics.app_distribution_summary_v ads \
            WHERE truck_id = {truckId} \
            ORDER BY 2;"
    return exec_and_fetch(sql)

@sqlapi.route("/getAllImages")
@api_response
def get_placeholder_image():
    gender = request.args.get('gender')
    sql = f"SELECT image_url \
            FROM {database}.harmonized.customer_v \
            WHERE gender = '{gender}'"
    return exec_and_fetch(sql)

@sqlapi.route("/updateSelectedLocation")
@api_response
def update_selected_location():
    data = request.args.get('data')
    data = data.split(',')
    stmt = ""
    for item in data :
        item = item.split(':')
        stmt += "SELECT " + str(item[0]) + " AS truck_id, '" + str(item[1]) + "' AS date, \
                " + str(item[2]) + " AS shift, " + str(item[3]) + " AS location_id, " + item[4] + " AS shift_forecast UNION "
    sql = f"MERGE INTO {database}.raw_supply_chain.selected_locations_app sla \
            USING (" + stmt[0:len(stmt) - 6] + ") s \
            ON sla.truck_id = s.truck_id \
            AND sla.date = s.date \
            AND sla.shift = s.shift \
            WHEN MATCHED \
              THEN \
                UPDATE SET sla.location_id = s.location_id, \
                sla.shift_forecast = s.shift_forecast \
            WHEN NOT MATCHED \
              THEN \
                INSERT VALUES(s.truck_id, s.date, s.shift, s.location_id, s.shift_forecast);"
    return exec_and_fetch(sql)

@sqlapi.route("/updateItemInventory")
@api_response
def update_item_inventory():
    data = request.args.get('data')
    data = data.split(',')
    stmt = ""
    for item in data :
        item = item.split(':')
        stmt += "SELECT " + str(item[0]) + " AS truck_id, " + str(item[1]) + " AS item_id, " + str(item[2]) + " AS po_id, \
                '" + str(item[3]) + "' AS quantity, " + "CURRENT_DATE() AS last_updated_date UNION "
    sql = f"MERGE INTO {database}.raw_supply_chain.current_inventory_app cia \
            USING (" + stmt[0:len(stmt) - 6] + ") s \
            ON cia.truck_id = s.truck_id \
            AND cia.item_id = s.item_id \
            AND cia.po_id = s.po_id \
            WHEN MATCHED \
              THEN \
                UPDATE SET cia.quantity = s.quantity, \
                cia.last_updated_date = s.last_updated_date \
            WHEN NOT MATCHED \
              THEN \
                INSERT VALUES(s.truck_id, s.item_id, s.po_id, s.quantity, s.last_updated_date);"
    return exec_and_fetch(sql)

@sqlapi.route("/placeInventoryOrder")
@api_response
def place_inventory_order():
    data = request.args.get('data')
    data = data.split(',')
    stmt = ""
    for item in data :
        item = item.split(':')
        stmt += "SELECT " + str(item[0]) + " AS truck_id, " + str(item[1]) + " AS item_id, \
                '" + str(item[2]) + "' AS quantity_recommended, " + "CURRENT_DATE() AS last_updated_date UNION "
    sql = f"MERGE INTO {database}.raw_supply_chain.inventory_order_app ioa \
            USING (" + stmt[0:len(stmt) - 6] + ") s \
            ON ioa.truck_id = s.truck_id \
            AND ioa.item_id = s.item_id \
            WHEN MATCHED \
              THEN \
                UPDATE SET ioa.quantity_recommended = s.quantity_recommended, \
                ioa.last_updated_date = s.last_updated_date \
            WHEN NOT MATCHED \
              THEN \
                INSERT VALUES(s.truck_id, s.item_id, s.quantity_recommended, s.last_updated_date);"
    return exec_and_fetch(sql)

@sqlapi.route("/getFoodWasteData")
@api_response
def get_food_waste_data():
    truckId = request.args.get('truck_id')
    sql = f"SELECT SUM(total_wastage_amount), MONTHNAME(CREATE_DATE), YEAR(CREATE_DATE) \
            FROM {database}.analytics.app_item_wastage_v \
            WHERE truck_id = {truckId} \
            AND create_date > DATEADD(YEAR, -1, GetDate()) \
            GROUP BY 2,3 \
            ORDER BY MAX(create_date) DESC;"
    return exec_and_fetch(sql)

@sqlapi.route("/getAllFoodWasteData")
@api_response
def get_all_food_waste_data():
    truckId = request.args.get('truck_id')
    sql = f"SELECT SUM(total_wastage_amount), (sum(total_quantity_wasted) / sum(total_quantity_ordered)) * 100 \
            FROM {database}.analytics.app_item_wastage_v \
            WHERE truck_id = {truckId};"
    return exec_and_fetch(sql)

@sqlapi.route("/getInventoryWasted")
@api_response
def get_inventory_wasted():
    truckId = request.args.get('truck_id')
    month = request.args.get('month')
    year = request.args.get('year')
    sql = f"SELECT name, unit, image_url, SUM(TOTAL_QUANTITY_WASTED) AS expired_quantity, SUM(TOTAL_WASTAGE_AMOUNT) AS wastage_dollars \
            FROM {database}.analytics.app_item_wastage_v \
            WHERE MONTHNAME(create_date) = '{month}' \
            AND YEAR(create_date) = '{year}' \
            AND truck_id = {truckId} \
            GROUP BY 1,2,3;"
    return exec_and_fetch(sql)

@sqlapi.route("/validateTruckCredentials")
@api_response
def validate_truck_credentials():
    truckId = request.args.get('truck_id')
    password = request.args.get('password')
    sql = f"SELECT TO_BOOLEAN(TO_VARCHAR(DECRYPT(TO_BINARY(SELECT password \
                                                           FROM {database}.RAW_TRUCK.USER_CREDENTIALS_APP \
                                                           WHERE truck_id = {truckId}),\
                                                           '{config.APP_PASSPHRASE}'),'utf-8') = '{password}');"
    return exec_and_fetch(sql)