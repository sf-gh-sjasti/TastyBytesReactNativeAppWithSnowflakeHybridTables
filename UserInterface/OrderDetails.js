import React, { useEffect, useState } from 'react';
import { Modal, FlatList, Text, View, Image } from 'react-native';
import { ListItem } from "react-native-elements";
import { ScrollView } from 'react-native-gesture-handler';
import SpinnerButton from 'react-native-spinner-button';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId, DetailPopup } from './UpdatedData';
import moment from 'moment-timezone';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function OrderDetails({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonColorCode, setButtonColorCode] = useState('#11567F');
  const [buttonText, setButtonText] = useState('ORDER READY');
  const [defaultLoading, setDefaultLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const getOrderDetailData = async (orderId) => {
    try {
      const response = await fetch(BASE_URL + 'endpoints/getOrderDetails?order_id=' + orderId, {
        method: 'GET'
      });
      const json = await response.json();
      setOrderDetailData(json.result);
      setOrderDetails(json.result[0]);
      setIsDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (orderId) => {
    try {
      setDefaultLoading(true);
      const response = await fetch(BASE_URL + 'endpoints/updateOrderDetails?order_id=' + orderId);
      if (response.status == 200) {
        DetailPopup[1] = true
        setDefaultLoading(false);
        setIsButtonDisabled(true);
        setButtonColorCode('#8A999E');
        setButtonText('ORDER COMPLETED');
        setTimeout(() => {
          navigation.navigate('ORDERS');
        }, 700);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function setTruckDateTime() {
    var date;
    if(TruckId[0] == 81) {
      date = moment().tz("America/Toronto");
      setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
    }
    else if(TruckId[0] == 162) {
      date = moment().tz("Europe/Paris");
      setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
    }
    else if(TruckId[0] == 285) {
      date = moment().tz("Australia/Sydney");
      setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
    }
    else if(TruckId[0] == 44) {
      date = moment().tz("America/Los_Angeles");
      setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
    }
  }

  useEffect(() => {
    setTruckDateTime();
    getOrderDetailData(orderNum);
    if(DetailPopup[0]) {
      setShowPopup(true);
    }
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    DetailPopup[0] = false;
  };

  function handleClick() {
    updateOrderStatus(orderNum);
  }

  const { firstName, lastName, orderTotal, orderNum, truckId, orderStatus, orderAmount, orderTaxAmount, orderDiscountAmount} = route.params;

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
              <Text>This screen provides detailed information for individual orders. We employ Hybrid Tables to swiftly retrieve order details through efficient point lookups.</Text>
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
      <View>
        <View style={{ paddingTop: 20, paddingLeft: 30, paddingBottom: 40 }}>
          <Text style={Styles.content}>{"Truck ID: " + truckId}</Text>
          <Text style={Styles.content}>{"Date: " + currentDate}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', paddingLeft: 24, paddingRight: 24 }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={require('./Images/avatar.png')}
          />
          <View>
            <Text style={[Styles.content, { padding: 20 }]}>
              <Text style={Styles.contentHeading}>
                {firstName + " " + lastName} {'\n'}
              </Text>
              {'$' + (parseFloat(orderTotal).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} {'\n'}
              {'Order # ' + orderNum}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 20 }}>
            { isDataFetched &&
              <FlatList
                data={orderDetailData}
                scrollEnabled={true}
                vertical
                ListEmptyComponent={
                  <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{ height: 50 }}>{'\n'}</Text>
                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
                  </View>}
                renderItem={({ item }) =>
                  <ListItem>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                      <Text style={Styles.content}>
                        {item[0] + "x " + item[1]}
                      </Text>
                      <Text style={Styles.content}>
                        {'$' + ((item[2] * item[0]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                      </Text>
                    </View>
                  </ListItem>
                }
                ListFooterComponent={() => {
                  return (<View style={Styles.horizontalLine} />);
                }}
              />
            }
          </View>
          <View style={{ paddingTop: 10, paddingLeft: 30, paddingRight: 34 }}>
            {orderDetails.length > 0 &&
              <View >
                <Text style={{ paddingTop: 10 }}>ORDER SUMMARY</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10 }}>
                  <Text style={Styles.content}>Subtotal</Text>
                  <Text style={Styles.content}>{'$' + (parseFloat(orderAmount).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10 }}>
                  <Text style={Styles.content}>{"Taxes & Fees"}</Text>
                  <Text style={Styles.content}>{orderTaxAmount != null ? '$' + ((parseFloat(orderTaxAmount).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')) : '$' + parseFloat(0).toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10 }}>
                  <Text style={Styles.content}>Discount</Text>
                  <Text style={Styles.content}>{orderDiscountAmount != null ? '$' + ((parseFloat(orderDiscountAmount).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')) : '$' + parseFloat(0).toFixed(2)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10 }}>
                  <Text style={{ fontWeight: '900', fontSize: 16, fontFamily: 'lato' }}>Total</Text>
                  <Text style={Styles.content}>{'$' + ((parseFloat(orderTotal).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))}</Text>
                </View>
              </View>
            }
          </View>
          <View style={{ paddingTop: 30 }}>
            {orderDetails.length > 0 &&
              <SpinnerButton
                buttonStyle={{ alignItems: 'center', backgroundColor: (orderStatus == 'COMPLETED' ? '#8A999E' : buttonColorCode), padding: 20, marginLeft: 25, marginRight: 25, borderRadius: 50 }}
                isLoading={defaultLoading}
                spinnerType='MaterialIndicator'
                onPress={handleClick}
                disabled={orderStatus == 'COMPLETED' ? true : isButtonDisabled}
              >
                <Text style={{ color: '#FFFFFF', fontFamily: 'texta-black', fontSize: 20, fontWeight: 700 }}>{orderStatus == 'COMPLETED' ? 'ORDER COMPLETED' : buttonText}</Text>
              </SpinnerButton>
            }
          </View>
          <Text style={{ height: 30 }}>{'\n'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
