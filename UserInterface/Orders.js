import React, { useEffect, useState } from 'react';
import { Modal, FlatList, Text, View, Dimensions, Image } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { ListItem } from "react-native-elements";
import { TabBar } from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId, DetailPopup } from './UpdatedData';
import moment from 'moment-timezone';

export default function Orders({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [inQueueData, setInQueueData] = useState([]);
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [currentDate, setCurrentDate] = useState([]);
  const [isInqueueDataFetched, setIsInqueueDataFetched] = useState(false);
  const [isHistoryDataFetched, setIsHistoryDataFetched] = useState(false);
  const [isTruckInTransit, setIsTruckInTransit] = useState(false);
  const [newTruckIdForLogin, setNewTruckIdForLogin] = useState();
  const [showPopup, setShowPopup] = useState(true);
  const [popUpText, setPopUpText] = useState('');
  
  const getInQueueData = async () => {
    try {
      const response = await fetch(BASE_URL + 'endpoints/getInqueueOrders?truck_id=' + TruckId[0] + '&currentTimestamp=' + moment().tz("America/Toronto").format("YYYY-MM-DD HH:mm:ss"), {
          method: 'GET'
        });
      const json = await response.json();
      setInQueueData(json.result);
      setIsInqueueDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getOrderHistoryData = async () => {
    try {
      const response = await fetch(BASE_URL + 'endpoints/getOrderHistory?truck_id=' + TruckId[0] + '&currentTimestamp=' + moment().format("YYYY-MM-DD HH:mm:ss"), {
        method: 'GET'
      });
      const json = await response.json();
      setOrderHistoryData(json.result);
      setIsHistoryDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      var currentTime;
      var date;
      if(TruckId[0] == 81) {
        date = moment().tz("America/Toronto");
        currentTime = date.format("HH");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
      }
      else if(TruckId[0] == 162) {
        date = moment().tz("Europe/Paris");
        currentTime = date.format("HH");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
      }
      else if(TruckId[0] == 285) {
        date = moment().tz("Australia/Sydney");
        currentTime = date.format("HH");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
      }
      else if(TruckId[0] == 44) {
        date = moment().tz("America/Los_Angeles");
        currentTime = date.format("HH");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
      }
      getInQueueData();
      if(DetailPopup[1]) {
        setShowPopup(true);
        DetailPopup[1] = false;
        setPopUpText("This action swiftly updated the order status column in the hybrid table, utilizing rapid updates with row locking mechanisms.");
      }
      else {
        setPopUpText("This screen showcases both current Orders in the Queue and completed ones, utilizing Hybrid Tables for efficient management.");
      }
    });
    setShowPopup(true);
  }, [navigation]);

  const dismissPopup = () => {
    setShowPopup(false);
  };

  const InQueue = () => (
    <View style={Styles.container}>
      {isInqueueDataFetched &&
        <FlatList
          data={inQueueData}
          scrollEnabled={true}
          vertical
          ItemSeparatorComponent={() => {
            return (<View style={Styles.horizontalLine} />);
          }}
          ListEmptyComponent={
            <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{ height: 50 }}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
            </View>}
          renderItem={({ item }) =>
            <ListItem>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('./Images/avatar.png')}
              />
              <View>
                <Text style={[Styles.content, { paddingLeft: 10 }]}>
                  <Text style={Styles.contentHeading}>
                    {(item[1] && item[2]) ? (item[1] + " " + item[2]) : 'Unknown Walk-up'} {'\n'}
                  </Text>
                  {'$' + (parseFloat(item[3]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} {'\n'}
                  {'Order # ' + item[0]}
                </Text>
                <Text style={{ height: 5 }}>{'\n'}</Text>
                <TouchableOpacity style={Styles.subButton}
                  onPress={() => navigation.navigate('Details', {
                    firstName: item[1] ? item[1] : 'Unknown',
                    lastName: item[2] ? item[2] : 'Walk-up',
                    orderTotal: item[3],
                    orderNum: item[0],
                    truckId: TruckId[0],
                    orderStatus: 'INQUEUE',
                    orderAmount: item[6],
                    orderTaxAmount: item[7],
                    orderDiscountAmount: item[8]
                  })}
                >
                  <Text style={Styles.subButtonText}>View Order</Text>
                </TouchableOpacity>
              </View>
            </ListItem>
          }
        />
      }
    </View>
  );

  const OrderHistory = () => (
    <View style={Styles.container}>
      {isHistoryDataFetched &&
        <FlatList
          data={orderHistoryData}
          scrollEnabled={true}
          vertical
          ItemSeparatorComponent={() => {
            return (<View style={Styles.horizontalLine} />);
          }}
          ListEmptyComponent={
            <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{ height: 50 }}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
            </View>}
          renderItem={({ item }) =>
            <ListItem>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('./Images/avatar.png')}
              />
              <View>
                <Text style={[Styles.content, { paddingLeft: 10 }]}>
                  <Text style={Styles.contentHeading}>
                    {(item[1] && item[2]) ? (item[1] + " " + item[2]) : 'Unknown Walk-up'} {'\n'}
                  </Text>
                  {'$' + (parseFloat(item[3]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} {'\n'}
                  {'Order # ' + item[0]}
                </Text>
                <Text style={{ height: 5 }}>{'\n'}</Text>
                <TouchableOpacity style={Styles.subButton}
                  onPress={() => navigation.navigate('Details', {
                    firstName: item[1] ? item[1] : 'Unknown',
                    lastName: item[2] ? item[2] : 'Walk-up',
                    orderTotal: item[3],
                    orderNum: item[0],
                    truckId: TruckId[0],
                    orderStatus: 'COMPLETED',
                    orderAmount: item[6],
                    orderTaxAmount: item[7],
                    orderDiscountAmount: item[8]
                  })}
                >
                  <Text style={Styles.subButtonText}>View Order</Text>
                </TouchableOpacity>
              </View>
            </ListItem>
          }
        />
      }
    </View>
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'inQueue', title: 'In Queue' },
    { key: 'orderHistory', title: 'Order History' },
  ]);

  function setNewTruckId() {
    var currentTime = moment().tz("America/Toronto").format("HH");
    if((currentTime >= 0 && currentTime < 3) || (currentTime >= 15 && currentTime < 17)) {
      setNewTruckIdForLogin(44);
    }
    else if((currentTime >= 3 && currentTime < 9)) {
      setNewTruckIdForLogin(162);
    }
    else if((currentTime >= 9 && currentTime < 15) || (currentTime >= 17 && currentTime < 24)) {
      setNewTruckIdForLogin(81);
    }
  }

  function onLoginClick() {
    TruckId[0] = newTruckIdForLogin;
    navigation.navigate("SignIn");
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Modal
        visible={showPopup} // Control visibility of the popup
        animationType="slide"
        transparent={true}
        onRequestClose={dismissPopup} // Dismiss the popup when user presses hardware back button (Android)
      >
        <View style={Styles.modalContainer}>
          <View style={Styles.modalContent}>
            <View style={{alignItems: 'center'}}>
              <Image
                style={{ width: 70, height: 70 }}
                source={require('./Images/Hybrid_Tables.png')}
              />
            </View>
            <View>
              <Text>{popUpText}</Text>
            </View>
            <Text style={{ height: 10 }}>{'\n'}</Text>
            <TouchableOpacity 
              onPress={dismissPopup} 
              style={{alignItems: 'center',
                backgroundColor: '#11567F',
                padding: 5,
                cursor: 'pointer',
                borderRadius: 50}} >
              <Text style={Styles.subButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      { !isTruckInTransit &&
      <View style={{flex: 1}}>
        <View style={{ paddingTop: 20, paddingLeft: 30, paddingBottom: 10 }}>
          <Text style={Styles.content}>{"Truck ID: " + TruckId[0]}</Text>
          <Text style={Styles.content}>{"Date: " + currentDate}</Text>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderLabel={({ route }) => (
                <Text style={[Styles.contentHeading, { color: '#11567F', margin: 8 }]}>
                  {route.title}
                </Text>
              )}
              indicatorStyle={{ backgroundColor: '#000000', height: 1 }}
              style={{ backgroundColor: 'white' }}
              onTabPress={({ route }) => {
                if (route.key === 'inQueue') {
                  getInQueueData();
                }
                if (route.key === 'orderHistory') {
                  getOrderHistoryData();
                }
              }}
            />
          )}
          renderScene={SceneMap({
            inQueue: () => <InQueue />,
            orderHistory: () => <OrderHistory />,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          style={{}}
        />
      </View>
      }
      { isTruckInTransit &&
        <View style={{flex: 1}}>
          <View style={{ textAlign: 'center', paddingTop: 100, fontSize: 16,
            fontFamily: 'lato',
            fontWeight: 700, color: '#11567F'}}>
            <Text style={[ Styles.contentHeading, { color: '#11567F' } ]}>
              Truck is in Transit. {'\n'}
              Please Check Back Later {'\n'}
              {'\n'}
              OR {'\n'}
              {'\n'}
              <TouchableOpacity 
                onPress={ onLoginClick }
                style={{ cursor: 'pointer' }}>
                <Text style={{ textDecoration: 'underline'}}>Login as Truck {newTruckIdForLogin} {'\n'}</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      }
    </View>
  );
};

