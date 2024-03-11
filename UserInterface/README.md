
![IO_Data App](https://user-images.githubusercontent.com/112972962/234330162-de60eeb3-6605-4eff-a763-15619eceacf8.png)

## Tasty Bytes Unistore Data App:

![tb_unistore_driver_app_header](https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables/assets/112972962/91111d29-1827-41fd-ae1c-d873fb12f64f)

Tasty Bytes is a fictional global food truck enterprise that has established its presence in 30 cities spanning across 15 countries, boasting a network of 450 trucks offering 15 diverse menu types under various brands. Catering to the needs of both customers and truck owners/operators, Tasty Bytes has developed a robust Truck Driver App. This specialized app provides truck owners/operators with a comprehensive 360-degree view of the order process, allowing them to efficiently manage their operations. Once orders are placed by customers, they are queued for processing, and drivers have the flexibility to prioritize each order based on various factors. This driver-focused app grants efficient access to both historical and real-time order data, enabling swift updates on ongoing orders. However, the exponential rise in daily order volumes, driven by Tasty Bytes growing success, has strained the application's performance and its ability to support concurrent users effectively.

<img width="778" alt="BusinessFlow" src="https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables/assets/112972962/5f13b733-1d1e-47be-bb1b-10e39f775bbd">

To tackle scaling challenges, the implementation of Hybrid Tables within this lightweight transactional application aims to harness several advantages. These tables provide quicker lookups for current and past orders, essential for driver efficiency. Supporting ACID transactions with row locking, they simplify the process of updating order statuses, ensuring data integrity and reliability. Moreover, Hybrid Tables facilitate seamless integration with Snowflake's existing business data, allowing for robust analytics. This blend of features enhances overall performance, scalability, and flexibility, making Hybrid Tables the ideal solution for addressing the evolving needs of Tasty Bytes food truck network.

## App Architecture:
The application is structured around a 3-tier architecture, comprising a Persistence layer, Processing layer, and User Interface layer.

In the Persistence layer, Snowflake serves as the foundation, with an API developed to facilitate communication between the application and Snowflake. This communication is enabled through the Serverless Framework, Python, and Flask.

For the User Interface layer, React Native Framework is utilized, and the application is constructed using the Expo Framework.

<img width="634" alt="Architecture" src="https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables/assets/112972962/49108e07-2e5d-4766-9154-f689f889de1a">

The application is versatile, capable of functioning as either a mobile or web application, compatible with iOS, Android, and Web platforms. Although designed for both, for demonstration purposes, it has been deployed as a Web Application.

To optimize the ordering process, our application relies on Snowflake's exclusive Unistore feature, leveraging hybrid tables at its core. These tables, seamlessly integrated into Snowflake's table types, are purpose-built for managing hybrid transactional and operational workloads, prioritizing minimal latency and enhanced throughput for small random point reads and writes.

Moreover, Hybrid Tables, currently accessible for public preview in select AWS regions, expedite rapid single-row operations, empowering teams to develop lightweight transactional use cases directly within Snowflake. This capability, combined with embedded indexes for swift data retrieval and enforced unique constraints for primary keys, significantly amplifies the efficiency of our application.

For Tasty Bytes food truck drivers, quick access to past and current orders, along with the ability to promptly update order statuses, is indispensable. Additionally, drivers require features such as viewing past earnings, sales comparisons, and monitoring food waste. The escalating success of these food trucks has driven up daily order volumes, thereby straining application performance and concurrent user support. Nevertheless, Unistore eliminates the need to duplicate or relocate data to handle transactional volume while providing analytical capabilities simultaneously. Furthermore, Snowflake's fully managed platform negates the necessity for managing infrastructure, query tuning, updates, or ensuring data continuity.

## How to run the App:
1. run ``` npm install ``` from this folder to install app dependancies
2. run ``` npx expo start ``` and hit ``` w ``` key to launch the app in a web browser

## Navigating through the application
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

<img width="367" alt="Orders" src="https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables/assets/112972962/e78537bc-baf3-4246-82da-05c58e619f33">

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

2. Click on the View Order button to access detailed order information. This action triggers a query on the hybrid table, employing point lookups to swiftly retrieve the specified order details.

<img width="365" alt="OrderDetails" src="https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables/assets/112972962/05314dd9-b25a-498e-af59-86cb6a936ff5">

3. Press the ORDER READY button to finalize the order. This initiates an update in the Hybrid Table, swiftly setting the Order Status value to Completed while utilizing rapid updates with row locking mechanisms. Afterward, you will be redirected back to the InQueue Orders Screen.
4. Now, Click on Order History tab to see the completed orders.

<img width="367" alt="OrderHistory" src="https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflakeHybridTables/assets/112972962/515cb870-3372-45f3-ad03-9571f0b3034e">

