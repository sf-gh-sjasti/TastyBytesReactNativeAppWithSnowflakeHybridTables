import config
from flask import Blueprint, request
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from utils import api_response
import sqlalchemy as db
from snowflake.sqlalchemy import URL
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from sqlalchemy import extract
from sqlalchemy.sql import func


def connect():
    # p_key = serialization.load_pem_private_key(
    #     config.SNOWFLAKE_PRIVATE_KEY.encode('utf-8'),
    #     password=None,
    #     backend=default_backend()
    # )
    # pkb = p_key.private_bytes(
    #     encoding=serialization.Encoding.DER,
    #     format=serialization.PrivateFormat.PKCS8,
    #     encryption_algorithm=serialization.NoEncryption())

    engine = create_engine(URL(
        account = config.SNOWFLAKE_ACCOUNT,
        user = config.SNOWFLAKE_USER,
        password = config.SNOWFLAKE_PASSWORD,
        database = config.SNOWFLAKE_DATABASE,
        schema = config.SNOWFLAKE_SCHEMA,
        warehouse = config.SNOWFLAKE_WAREHOUSE,
        role=config.SNOWFLAKE_ROLE,
        cache_column_metadata=True
        ),
        # connect_args={
        #     'private_key': pkb,
        # }
        )
    return engine

Base = declarative_base()

class CustomerLoyalty(Base):
    __tablename__ = 'CUSTOMER_LOYALTY'
    __table_args__ = {'extend_existing': True}
    __table_args__ = {'schema': 'RAW_CUSTOMER'}

    customer_id = db.Column(db.Numeric(38,0), primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    gender = db.Column(db.String(50))

class MENU(Base):
    __tablename__ = 'MENU'
    __table_args__ = {'extend_existing': True}

    menu_id = db.Column(db.Numeric(19,0), primary_key=True)
    menu_item_id = db.Column(db.Numeric(38,0))
    menu_item_name = db.Column(db.String(255))

class OrderHeader(Base):
    __tablename__ = 'ORDER_HEADER'
    __table_args__ = {'extend_existing': True}

    order_id = db.Column(db.Numeric(38,0), primary_key=True)
    customer_id = db.Column(db.Numeric(38,0), db.ForeignKey(CustomerLoyalty.customer_id), primary_key=True)
    order_total = db.Column(db.Numeric(38,0))
    order_ts = db.Column(db.TIMESTAMP)
    truck_id = db.Column(db.Numeric(38,0))
    order_status = db.Column(db.String(50))
    order_amount = db.Column(db.Numeric(38,4))
    order_tax_amount = db.Column(db.String(50))
    order_discount_amount = db.Column(db.String(50))
    shift = db.Column(db.Numeric(38,0))

class OrderDetail(Base):
    __tablename__ = 'ORDER_DETAIL'
    __table_args__ = {'extend_existing': True}

    order_id = db.Column(db.Numeric(38,0), primary_key=True)
    quantity = db.Column(db.Numeric(5,0))
    menu_item_name = db.Column(db.String(50))
    unit_price = db.Column(db.Numeric(38,4))
    menu_item_id = db.Column(db.Numeric(38,0))

endpoints = Blueprint('endpoints', __name__)
conn = connect()
connection = conn.connect()

Session = sessionmaker(bind=connection)
session = Session()

@endpoints.route("/endpoints/getInqueueOrders")
@api_response
def get_inqueue_orders():
    truckId = request.args.get('truck_id')
    currentTimestamp = request.args.get('currentTimestamp')
    d = datetime.datetime.strptime(currentTimestamp, '%Y-%m-%d %H:%M:%S')
    print(d.year)
    if d.hour >= 17 :
        results = session.query(OrderHeader.order_id, CustomerLoyalty.first_name, CustomerLoyalty.last_name, OrderHeader.order_total, \
                                OrderHeader.order_ts, CustomerLoyalty.gender, OrderHeader.order_amount, OrderHeader.order_tax_amount, \
                                OrderHeader.order_discount_amount) \
                         .join(CustomerLoyalty, OrderHeader.customer_id==CustomerLoyalty.customer_id) \
                         .filter(extract('year', OrderHeader.order_ts) == d.year) \
                         .filter(extract('month', OrderHeader.order_ts) == d.month) \
                         .filter(extract('day', OrderHeader.order_ts) == d.day) \
                         .filter(OrderHeader.shift == 0) \
                         .filter(OrderHeader.truck_id == truckId) \
                         .filter(OrderHeader.order_status == 'INQUEUE') \
                         .order_by(OrderHeader.order_ts) \
                         .limit(50) \
                         .all()
        session.close()
    else:
        results = session.query(OrderHeader.order_id, CustomerLoyalty.first_name, CustomerLoyalty.last_name, OrderHeader.order_total, \
                                OrderHeader.order_ts, CustomerLoyalty.gender, OrderHeader.order_amount, OrderHeader.order_tax_amount, \
                                OrderHeader.order_discount_amount) \
                         .join(CustomerLoyalty, OrderHeader.customer_id==CustomerLoyalty.customer_id) \
                         .filter(extract('year', OrderHeader.order_ts) == d.year) \
                         .filter(extract('month', OrderHeader.order_ts) == d.month) \
                         .filter(extract('day', OrderHeader.order_ts) == d.day) \
                         .filter(OrderHeader.shift == 1) \
                         .filter(OrderHeader.truck_id == truckId) \
                         .filter(OrderHeader.order_status == 'INQUEUE') \
                         .order_by(OrderHeader.order_ts) \
                         .limit(50) \
                         .all()
        session.close()
    return [list(elem) for elem in results]

@endpoints.route("/endpoints/getOrderHistory")
@api_response
def get_order_history():
    truckId = request.args.get('truck_id')
    currentTimestamp = request.args.get('currentTimestamp')
    d = datetime.datetime.strptime(currentTimestamp, '%Y-%m-%d %H:%M:%S')
    if d.hour >= 17 :
        results = session.query(OrderHeader.order_id, CustomerLoyalty.first_name, CustomerLoyalty.last_name, OrderHeader.order_total, \
                                OrderHeader.order_ts, CustomerLoyalty.gender, OrderHeader.order_amount, OrderHeader.order_tax_amount, \
                                OrderHeader.order_discount_amount) \
                         .join(CustomerLoyalty, OrderHeader.customer_id==CustomerLoyalty.customer_id) \
                         .filter(extract('year', OrderHeader.order_ts) == d.year) \
                         .filter(extract('month', OrderHeader.order_ts) == d.month) \
                         .filter(extract('day', OrderHeader.order_ts) == d.day) \
                         .filter(OrderHeader.shift == 0) \
                         .filter(OrderHeader.truck_id == truckId) \
                         .filter(OrderHeader.order_status == 'COMPLETED') \
                         .order_by(OrderHeader.order_ts.desc()) \
                         .limit(50) \
                         .all()
        session.close()
    else:
        results = session.query(OrderHeader.order_id, CustomerLoyalty.first_name, CustomerLoyalty.last_name, OrderHeader.order_total, \
                                OrderHeader.order_ts, CustomerLoyalty.gender, OrderHeader.order_amount, OrderHeader.order_tax_amount, \
                                OrderHeader.order_discount_amount) \
                         .join(CustomerLoyalty, OrderHeader.customer_id==CustomerLoyalty.customer_id) \
                         .filter(extract('year', OrderHeader.order_ts) == d.year) \
                         .filter(extract('month', OrderHeader.order_ts) == d.month) \
                         .filter(extract('day', OrderHeader.order_ts) == d.day) \
                         .filter(OrderHeader.shift == 1) \
                         .filter(OrderHeader.truck_id == truckId) \
                         .filter(OrderHeader.order_status == 'COMPLETED') \
                         .order_by(OrderHeader.order_ts.desc()) \
                         .limit(50) \
                         .all()
        session.close()
    return [list(elem) for elem in results]

@endpoints.route("/endpoints/getOrderDetails")
@api_response
def get_order_details():
    orderId = request.args.get('order_id')
    results = session.query(func.sum(OrderDetail.quantity).label("quantity"), MENU.menu_item_name, OrderDetail.unit_price) \
                     .join(MENU, OrderDetail.menu_item_id==MENU.menu_item_id) \
                     .filter(OrderDetail.order_id == orderId) \
                     .group_by(MENU.menu_item_name, OrderDetail.unit_price) \
                     .order_by(OrderDetail.unit_price.desc()) \
                     .all()
    session.close()
    return [list(elem) for elem in results]

@endpoints.route("/endpoints/updateOrderDetails")
@api_response
def update_order_details():
    orderId = request.args.get('order_id')
    session.query(OrderHeader) \
           .filter(OrderHeader.order_id == orderId) \
           .update({'order_status': 'COMPLETED'}) 
    session.commit()
    session.close()
    return [{}]

