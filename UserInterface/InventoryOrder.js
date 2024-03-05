import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InventoryOrderItem from './InventoryOrderItem';
import { UpdatedInventoryOrderData } from './UpdatedData';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';

export default function InventoryOrder({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [tableHead, setTableHead] = useState(['Item', 'Unit', 'Current Quantity', 'Quantity Needed']);
  const [tableData, setTableData] = useState([]);

  const getInventoryOrder = async () => {
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

  const placeInventoryOrder = async (updatedData) => {
    try {
      let response = await fetch(BASE_URL + 'connector/placeInventoryOrder?data=' + updatedData.map(a => a.join(":")).join(","), {
        method: 'GET'
      });
      if (response.status == 200) {
        UpdatedInventoryOrderData.splice(0);
        setTableData([]);
        navigation.navigate('OrderSummary');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getInventoryOrder();
    });
  }, [navigation]);

  function childToParent(data) {
    updateData(data);
  };

  function updateData(data) {
    const i = UpdatedInventoryOrderData.findIndex(_element => (_element[0] === data[0] && _element[1] === data[1]));
    if (i > -1) UpdatedInventoryOrderData[i] = data;
    else UpdatedInventoryOrderData.push(data);
  }

  function onPlaceOrder() {
    if (UpdatedInventoryOrderData.length > 0) {
      placeInventoryOrder(UpdatedInventoryOrderData);
    }
    else {
      navigation.navigate('OrderSummary');
    }
  }

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
              <InventoryOrderItem item={item} childToParent={childToParent} key={index}></InventoryOrderItem>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
      <View>
        <Text style={{ height: '10px' }}></Text>
        <View style={Styles.horizontalLine} />
        <Text style={{ height: '20px' }}></Text>
        <View style={{ paddingLeft: 14, paddingRight: 14, paddingBottom: 14 }}>
          <TouchableOpacity style={Styles.button}
            onPress={onPlaceOrder} >
            <Text style={Styles.buttonText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ height: '20px' }}></Text>
      </View>
    </View>
  );
};
