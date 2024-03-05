import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function OrderSummary({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [tableHead, setTableHead] = useState(['Item', 'Unit', 'Current Quantity', 'Quantity Ordered']);
  const [tableData, setTableData] = useState([]);
  const [currentDate, setCurrentDate] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState([]);

  const getOrderSummary = async () => {
    try {
      let response = await fetch(BASE_URL + 'connector/getInventoryOrder?truck_id=' + TruckId[0], {
        method: 'GET'
      });
      const json = await response.json();
      setTableData(json.result);
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
      setCurrentDate(date.format("MM/DD/YYYY"));
    }
    else if(TruckId[0] == 162) {
      date = moment().tz("Europe/Paris");
      setCurrentDate(date.format("MM/DD/YYYY"));
    }
    else if(TruckId[0] == 285) {
      date = moment().tz("Australia/Sydney");
      setCurrentDate(date.format("MM/DD/YYYY"));
    }
    else if(TruckId[0] == 44) {
      date = moment().tz("America/Los_Angeles");
      setCurrentDate(date.format("MM/DD/YYYY"));
    }
    setDeliveryDate(date.day(1 + 7).format("MM/DD/YYYY"));
  }

  useEffect(() => {
    getOrderSummary();
    setTruckDateTime();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10 }}>
      <ScrollView vertical>
        <ScrollView horizontal>
          <View style={{ width: 450 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 10, paddingLeft: 10, paddingBottom: 10 }}>
              </View>
              <View style={[Styles.tablepadding, { flex: 2 }]}>
                <Text style={Styles.contentHeading}>{tableHead[0]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[1]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[2]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 2 }]}>
                <Text style={Styles.contentHeading}>{tableHead[3]}</Text>
              </View>
            </View>
            <View style={Styles.horizontalLine} />
            <View style={{ paddingBottom: 5 }} />
            {tableData.map((item, index) => (
              <View style={{ flexDirection: 'row', flex: 1 }} key={index}>
                <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 10, paddingLeft: 10, paddingBottom: 10 }}>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={{
                      uri: item[5],
                    }}
                  />
                </View>
                <View style={[Styles.tablepadding, { flex: 2 }]}>
                  <Text style={Styles.content}>
                    {item[1]}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {item[2]}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {parseFloat(item[3]) > 0 ? parseFloat(item[3]).toFixed(2) : 0}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 2 }]}>
                  <Text style={Styles.content}>
                    {parseFloat(item[4]) > 0 ? parseFloat(item[4]).toFixed(2) : 0}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
      <View style={{ paddingLeft: 24, paddingRight: 24 }}>
        <Text style={{ height: '20px' }}></Text>
        <View style={Styles.horizontalLine} />
        <Text style={{ height: '20px' }}></Text>
        <Text style={Styles.content}>Order Date: {currentDate}</Text>
        <Text style={{ height: '10px' }}></Text>
        <Text style={Styles.content}>Estimated Delivery Date: {deliveryDate}</Text>
        <Text style={{ height: '20px' }}></Text>
        <View style={{ paddingLeft: 14, paddingRight: 14 }}>
          <TouchableOpacity style={Styles.button}
            onPress={() => navigation.navigate('MY ACCOUNT')}
          >
            <Text style={Styles.buttonText}>DONE</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ height: '40px' }}></Text>
      </View>
    </View>
  );
};