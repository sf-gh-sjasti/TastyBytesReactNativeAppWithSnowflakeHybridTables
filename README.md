# TastyBytesReactNativeAppWithSnowflakeHybridTables
The application is structured around a 3-tier architecture, comprising a Persistence layer, Processing layer, and User Interface layer.

In the Persistence layer, Snowflake serves as the foundation, with an API developed to facilitate communication between the application and Snowflake. This communication is enabled through the Serverless Framework, Python, and Flask.

For the User Interface layer, React Native Framework is utilized, and the application is constructed using the Expo Framework.

The application is versatile, capable of functioning as either a mobile or web application, compatible with iOS, Android, and Web platforms. Although designed for both, for demonstration purposes, it has been deployed as a Web Application.

To optimize the ordering process, our application relies on Snowflake's exclusive Unistore feature, leveraging hybrid tables at its core. These tables, seamlessly integrated into Snowflake's table types, are purpose-built for managing hybrid transactional and operational workloads, prioritizing minimal latency and enhanced throughput for small random point reads and writes.

Moreover, Hybrid Tables, currently accessible for public preview in select AWS regions, expedite rapid single-row operations, empowering teams to develop lightweight transactional use cases directly within Snowflake. This capability, combined with embedded indexes for swift data retrieval and enforced unique constraints for primary keys, significantly amplifies the efficiency of our application.

For Tasty Bytes food truck drivers, quick access to past and current orders, along with the ability to promptly update order statuses, is indispensable. Additionally, drivers require features such as viewing past earnings, sales comparisons, and monitoring food waste. The escalating success of these food trucks has driven up daily order volumes, thereby straining application performance and concurrent user support. Nevertheless, Unistore eliminates the need to duplicate or relocate data to handle transactional volume while providing analytical capabilities simultaneously. Furthermore, Snowflake's fully managed platform negates the necessity for managing infrastructure, query tuning, updates, or ensuring data continuity.

### Step 1: Set up the Source Code
1. Clone the repo using ``` git clone https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables.git reactNativeAppWithHybridTables ```
2. Navigate to the API folder to set up the backend Flask API, ``` cd reactNativeAppWithHybridTables/API ```
3. Run ``` npm install ``` to install dependancies
4. Create a virtualenv to install python packages, ``` virtualenv venv --python=python3.8 ```
5. activate the virtualenv created, ``` source ./venv/bin/activate ```
6. Install the depenancies needed, ``` pip install -r requirements.txt ```
7. Update the private key in the ``` API/config.py ``` file. Replace ``` PRIVATE_KEY ``` with the private key. Copy and paste the whole private key from ``` ~/.ssh/snowflake_app_key.pub ``` including header(``` -----BEGIN RSA PRIVATE KEY----- ```) and footer(``` -----END RSA PRIVATE KEY----- ```).
8. Update ``` SNOWFLAKE_ACCOUNT ``` with your Snowflake Account
   If you are located outside the us-west region, Update ``` SNOWFLAKE_ACCOUNT ``` as '<SNOWFLAKE ACCOUNT>.<REGION>'.
   To get the snowflake_account value from Snowflake, run ``` SELECT CURRENT_ACCOUNT() ``` in Snowsight. 
   To get the region value from Snowflake, run ``` SELECT CURRENT_REGION() ``` in Snowsight. 
9. Start the local serverless server, ``` sls wsgi serve ```
10. In a new Terminal Tab, Navigate to the UserInterface folder to set up the frontend React Native Application, ``` cd reactNativeAppWithHybridTables/UserInterface ```
11. Run ``` npm install ``` to install dependancies
12. Run ``` npx expo start --clear ``` and hit ``` w ``` key to run the app in a web browser
13. This launches the app in Web Browser
14. Upon Launch, You can see the InQueue Orders Screen.

### Step 2: Review the Source Code
We are using Key Pair Authentication to authenticate with Snowflake using SQL API. ```API/endpoints.py``` file has the API's we are using in the application. We are using SQLAlchemy to connect to the Snowflake. 
``` UserInterface/Orders.js ``` has the source code to render Orders screen. ``` OrderDetails.js ``` has the source code to render Order Details Screen.

### Step 4: Navigating through the application
1. Hybrid tables play a crucial role in the ordering process. Upon Launch of the application, You can see the InQueue Orders Screen. Now, let's delve into the development of this screen, starting with the Data Model. At the core of this Data Model are two primary tables. The first is the ORDER_HEADER table, which encompasses all orders placed by customers. Below, you'll find the definition of this table, outlining how it was created. Note that a primary key is mandatory for hybrid tables, and in this case, the ORDER_ID serves as the primary key. 

```sql

create or replace HYBRID TABLE FROSTBYTE_TASTY_BYTES_APP_UNISTORE.RAW.ORDER_HEADER (
	ORDER_ID NUMBER(38,0) NOT NULL,
	TRUCK_ID NUMBER(38,0),
	CUSTOMER_ID NUMBER(38,0),
	SHIFT NUMBER(38,0),
	SHIFT_START_TIME TIME(9),
	SHIFT_END_TIME TIME(9),
	ORDER_CHANNEL VARCHAR(16777216),
	ORDER_TS TIMESTAMP_NTZ(9),
	SERVED_TS VARCHAR(16777216),
	ORDER_CURRENCY VARCHAR(3),
	ORDER_AMOUNT NUMBER(38,4),
	ORDER_TAX_AMOUNT VARCHAR(16777216),
	ORDER_DISCOUNT_AMOUNT VARCHAR(16777216),
	ORDER_TOTAL NUMBER(38,4),
	ORDER_STATUS VARCHAR(16777216) DEFAULT 'INQUEUE',
	primary key (ORDER_ID) rely ,
	foreign key (TRUCK_ID) references FROSTBYTE_TASTY_BYTES_APP_UNISTORE.RAW.TRUCK(TRUCK_ID) rely ,
	foreign key (CUSTOMER_ID) references FROSTBYTE_TASTY_BYTES_APP_UNISTORE.RAW.CUSTOMER_LOYALTY(CUSTOMER_ID) rely ,
	index IDX01_ORDER_TS(ORDER_TS),
	index IDX02_ORDER_STATUS(ORDER_STATUS),
	index IDX02_SHIFT(SHIFT)
);

```

Hybrid tables also offer the capability to include secondary indexes. In our setup, we've indexed attributes such as TRUCK_ID, ORDER_TS, LOCATION_ID, and ORDER_STATUS. These indexes are instrumental in facilitating rapid lookups within the application, enhancing its responsiveness and user experience.

The second table in our setup is ORDER_DETAIL, which stores individual order line items within an order. It's common to have multiple order details associated with a single order header, especially when customers place multiple orders. The ORDER_DETAIL table includes ORDER_DETAIL_ID as its primary key and also features a foreign key, ORDER_ID, referencing the ORDER_HEADER table.

```sql

create or replace HYBRID TABLE FROSTBYTE_TASTY_BYTES_APP_UNISTORE.RAW.ORDER_DETAIL (
	ORDER_DETAIL_ID NUMBER(38,0) NOT NULL,
	ORDER_ID NUMBER(38,0),
	MENU_ITEM_ID NUMBER(38,0),
	DISCOUNT_ID VARCHAR(16777216),
	LINE_NUMBER NUMBER(38,0),
	QUANTITY NUMBER(5,0),
	UNIT_PRICE NUMBER(38,4),
	PRICE NUMBER(38,4),
	ORDER_ITEM_DISCOUNT_AMOUNT VARCHAR(16777216),
	primary key (ORDER_DETAIL_ID) rely ,
	foreign key (ORDER_ID) references FROSTBYTE_TASTY_BYTES_APP_UNISTORE.RAW.ORDER_HEADER(ORDER_ID) rely ,
	foreign key (MENU_ITEM_ID) references FROSTBYTE_TASTY_BYTES_APP_UNISTORE.RAW.MENU(MENU_ITEM_ID) rely 
);

```

In our configuration, the hybrid table ensures referential integrity by enforcing constraints that validate the presence of a genuine order header record for each entry in the ORDER_DETAIL table. This mechanism guarantees that each order detail is associated with a valid and existing order header, maintaining data consistency and accuracy within the system.

You may also explore additional hybrid tables such as TRUCK, MENU, and CUSTOMER_LOYALTY.

2. Now Click on View Order button to see the Order Details.

3. Click on ORDER READY button to complete the order. This action updates the Order Status value to Completed in Hybrid Table and take you back to the InQueue Orders Screen
4. Now, Click on Order History tab to see the completed orders.
