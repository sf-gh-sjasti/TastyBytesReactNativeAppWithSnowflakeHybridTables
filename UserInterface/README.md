
![IO_Data App](https://user-images.githubusercontent.com/112972962/234330162-de60eeb3-6605-4eff-a763-15619eceacf8.png)

## Tasty Bytes Data App:
Tasty Bytes the entity is a fictitious global food-truck organization supporting 30 cities across 15 countries. The food truck network consists of 450 trucks and 15 different truck brands/menu types. 

Tasty Bytes Data Application is targeted for Truck Drivers. Tasty Bytes driver app helps drivers to perform their daily activities and it has the following features.

1. The driver can log in using their unique Truck Id and password. Each driver is assigned a truck.
2. The app utilizes a data science model to suggest locations based on the predicted shift sales for a given day and shift.
3. The driver can choose from the suggested locations and will receive a checklist of items required to serve that location.
4. The app also provides navigation to the chosen location.
5. Once the driver arrives at the location and is ready to serve, the ordering system will become available, and the driver can view the order list in the In Queue screen. 
6. Drivers can see the orders in the queue and can mark them as complete once finished, which moves the order to the Order History screen.
7. The driver can view completed orders from the Order History screen. 
8. The Notifications Screen displays all customer reviews submitted for the current day, and it also shows items expiring within the next seven days. 
9. Drivers can view their profile, earnings, menu, and reviews, as well as the current inventory on their truck, including expiration dates. 
10. The driver can update the inventory, which writes the data back to the Snowflake. 
11. The Inventory Order screen displays a list of all the inventory required for the next week.
12. The driver can select locations for the following week to calculate the inventory forecast or use the model's recommendations. The app shows the inventory forecast needed for the following week, based on the data science model.
13. The driver can update the inventory forecast and place the purchase order for the coming week.

## App Architecture:
The application is designed based on a 3-tier architecture consisting of a Persistence layer, Processing layer, and User Interface layer.  
1. The Persistence layer is built using Snowflake and an API has been developed to facilitate communication between the application and Snowflake, utilizing SQL API, AWS API Gateway, AWS Lambda, Serverless Framework, Python, and Flask. 
2. The User Interface layer is developed using React Native Framework and the application is built using Expo Framework. 
3. To deploy the application, AWS Amplify Framework is used.

The App is designed to function as a mobile or web application that can be run on iOS, Android, or Web platforms. For the purpose of demonstration, the application has been deployed to AWS as a Web Application.

![Screenshot 2023-06-12 at 7 57 53 AM](https://github.com/snowflakecorp/frostbytes/assets/112972962/b2d1de96-1e6b-43c9-8089-f57ea4b5391c)

## How to run the App:
Launch the url provided, https://main.duuud5aw6r5hf.amplifyapp.com/.
1. Upon launching the app, the driver will be presented with the Tasty Bytes Launch Screen, which offers two options: SIGN UP and SIGN IN.

![Screenshot 2023-04-24 at 4 10 25 PM](https://user-images.githubusercontent.com/112972962/234135230-232b425c-9314-48d0-b8c7-063fbba84b26.png)

2. If the driver chooses to click on SIGN IN, driver would be provided with a sign in screen. We have enabled the App for 4 different truck's with different trends and timezones. Truck id and passwords are available in this slide.
https://docs.google.com/presentation/d/1hMv-H2Pdit7zl0Q8zfNr5r7s1S38afb06FyNj8z4ci0/edit?usp=sharing
<img width="453" alt="Screenshot 2023-06-09 at 11 17 27 AM" src="https://github.com/snowflakecorp/frostbytes/assets/112972962/cccbf6fd-6642-4884-b45c-fbeb7d224a94">

3. After successfully logging in, the driver will be directed to a screen that displays the details of the location they have selected for their current day and shift.

![Screenshot 2023-04-24 at 4 11 00 PM](https://user-images.githubusercontent.com/112972962/234135501-2cd73700-3583-4c7a-94a5-24bd09b8f0fb.png)

4. From this screen, the driver will have several options available to them, including the ability to change the selected location, view the inventory checklist for that location, navigate to the location, and begin taking orders.

![Screenshot 2023-04-24 at 4 16 50 PM](https://user-images.githubusercontent.com/112972962/234136578-b67329b6-c762-46bf-8fcc-307ed1e50724.png)

5. To change the selected location, the driver can simply click on the "Change Location" button, which will take them to the location recommendations screen. From there, the driver can review the available options and accept any of the recommended locations.

![Screenshot 2023-04-24 at 4 11 19 PM](https://user-images.githubusercontent.com/112972962/234135547-6bd7b1d3-823a-470a-89a9-613da4ae56db.png)

6. After accepting the location from the suggestions, the driver can also click on the "Checklist" button, which will navigate them to the Checklist screen. Here, they can review and validate whether they have all the necessary inventory to serve the selected location.

![Screenshot 2023-04-24 at 4 11 45 PM](https://user-images.githubusercontent.com/112972962/234135628-48daf8d0-a3da-476a-bd07-c052b6fe957e.png)

7. Once the driver has arrived at the location and is ready to begin taking orders, they can simply click on the "IM READY" button, and the system will start accepting orders.

8. In the Orders screen, the driver can view a list of all the orders that are currently in the queue.

![Screenshot 2023-04-24 at 4 17 16 PM](https://user-images.githubusercontent.com/112972962/234136671-6230695c-7789-4ced-8bb6-e58468020da0.png)

9. To view the complete details of an order, the driver can click on "View Order". Once the driver has fulfilled the order and is ready to mark it as completed, they can click on the "Order Ready" button. This will update the order status as "completed" in Snowflake.

![Screenshot 2023-04-24 at 4 17 31 PM](https://user-images.githubusercontent.com/112972962/234136694-ce14831e-7caf-4afe-8816-c2d2a162cd18.png)

10. The "Order History" tab displays a list of all the orders that have been marked as completed.

![Screenshot 2023-04-24 at 4 17 52 PM](https://user-images.githubusercontent.com/112972962/234136713-0c766b70-d5e3-45f5-8d33-afe7c3528308.png)

11. To view the details of a completed order, the driver can click on the "View Order" button within the "Order History" tab.

![Screenshot 2023-04-24 at 4 18 09 PM](https://user-images.githubusercontent.com/112972962/234136789-871303d4-e546-4ac6-aada-71af0b1aa1c2.png)

12. The "Notifications" screen displays all the reviews for the current day and also lists all the items that are expiring within the next 7 days.

![Screenshot 2023-04-24 at 4 18 39 PM](https://user-images.githubusercontent.com/112972962/234136831-1ea3128c-cff5-4666-944a-2a50f48fea38.png)

13. The "Profile" screen displays the driver's details, rating, locations visited, and earnings to date. From this screen, the driver has several buttons available to access additional information, including Reviews, Earnings, Inventory, and Menu.

![Screenshot 2023-04-24 at 4 19 06 PM](https://user-images.githubusercontent.com/112972962/234136856-ecfcc029-83bc-434d-86d9-47b503025cbf.png)

14. When the driver clicks on the "Reviews" button, they will be directed to the Reviews screen. Here, the driver can view their rating and all the reviews they have received thus far.

![Screenshot 2023-04-24 at 4 19 34 PM](https://user-images.githubusercontent.com/112972962/234136883-d4ee4572-f101-49e2-a75e-9248b612e0d9.png)

15. To view additional details of a review, the driver can simply click on the review they wish to view, and the app will display the full review.

![Screenshot 2023-04-24 at 4 19 47 PM](https://user-images.githubusercontent.com/112972962/234136925-36a25dc5-3345-4fed-9a2f-8f7b36a9b979.png)

16. The "Earnings" screen displays the earnings for each shift, as well as the total earnings accumulated to date.

![Screenshot 2023-04-24 at 4 20 04 PM](https://user-images.githubusercontent.com/112972962/234136947-9f11e702-f673-4f39-8116-a5f2ac9f0f3b.png)

17. If the driver clicks on a specific earnings record within the "Earnings" screen, they can view the inventory sold during that shift.

![Screenshot 2023-04-24 at 4 20 19 PM](https://user-images.githubusercontent.com/112972962/234137024-002a188f-9d37-497f-8d28-f6677c3c4187.png)

18. The "Menu" screen displays the food truck's menu. In the future, the driver may have an option to update the prices based on recommendations from a Data Science model in future.

![Screenshot 2023-04-24 at 4 20 38 PM](https://user-images.githubusercontent.com/112972962/234137040-a890aa3a-078c-4dcf-9d5c-ab1d074474d0.png)

19. When the driver clicks on the "Inventory" button, they will be directed to the Current Inventory screen. This screen displays a list of all the inventory available on the truck, along with their corresponding expiration dates.

![Screenshot 2023-04-24 at 4 20 53 PM](https://user-images.githubusercontent.com/112972962/234137060-c79deee4-3625-4868-accf-2130a7a1d2ca.png)

20. If the driver wants to see the item quantities and their corresponding expiration dates, they can expand each item on the Current Inventory screen to view this information.

![Screenshot 2023-04-24 at 4 21 15 PM](https://user-images.githubusercontent.com/112972962/234137082-90f13c5d-36f1-452b-b542-ff9acf9b2f78.png)

21. From the Current Inventory screen, the driver can update the current inventory, and the updated information will be saved back into Snowflake.
22. On the Current Inventory screen, the driver can click on the "ORDER FOR NEXT WEEK" button to order inventory for the following week.
23. Before placing an inventory order for the following week, the driver needs to select the locations for each day and shift. The app will provide location recommendations using an ML model. If the driver has not selected the locations, the app will automatically select them.

![Screenshot 2023-04-24 at 4 21 29 PM](https://user-images.githubusercontent.com/112972962/234137124-2375793d-42cf-4ead-a158-c5466846ac5a.png)

24. Once the locations are confirmed, the driver can click on the "SAVE AND ORDER" button to save the selected locations in Snowflake and view the inventory order. The inventory order is generated using an ML model which forecasts the inventory needed for the next week based on the selected locations.

![Screenshot 2023-04-24 at 4 21 46 PM](https://user-images.githubusercontent.com/112972962/234137260-78611b75-5ccc-4a24-8296-ba3759896032.png)

25. Driver can click on PLACE ORDER to place the inventory order as per the ML model recommendation or driver could update the quantity needed and place the order.
26. Once the order is placed, Driver is provided with the Order Summary and Expected Delivery Date in the order summary screen.

![Screenshot 2023-04-24 at 4 22 04 PM](https://user-images.githubusercontent.com/112972962/234137307-3e3db645-b764-48f2-b40b-8f80d2b640ce.png)

### To run App Locally
1. run ``` npm install ``` from this folder to install app dependancies
2. run ``` npx expo start ``` and hit ``` w ``` key to launch the app in a web browser


