import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import CurrentInventoryItem from './CurrentInventoryItem';
import { UpdatedCurrentInventoryData } from './UpdatedData';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function CurrentInventory({ route, navigation, expanded, item }) {
  const [isLoading, setLoading] = useState(true);
  const [tableHead, setTableHead] = useState(['Item', 'Unit', 'Quantity', 'Expiration (Earliest)']);
  const [tableData, setTableData] = useState([]);

  const getCurrentInventory = async () => {
    try {
      var date;
      if(TruckId[0] == 81) {
        date = moment().tz("America/Toronto");
      }
      else if(TruckId[0] == 162) {
        date = moment().tz("Europe/Paris");
      }
      else if(TruckId[0] == 285) {
        date = moment().tz("Australia/Sydney");
      }
      else if(TruckId[0] == 44) {
        date = moment().tz("America/Los_Angeles");
      }
      let response = await fetch(BASE_URL + 'connector/getCurrentInventory?truck_id=' + TruckId[0] + '&currentDate=' + date.format("YYYY-MM-DD"), {
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

  const getItemInventory = async (itemId) => {
    try {
      let response = await fetch(BASE_URL + 'connector/getItemInventory?truck_id=' + TruckId[0] + '&item_id=' + itemId, {
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

  const updateItemInventory = async (updatedData) => {
    try {
      let response = await fetch(BASE_URL + 'connector/updateItemInventory?data=' + updatedData.map(a => a.join(":")).join(","), {
        method: 'GET'
      });
      if (response.status == 200) {
        UpdatedCurrentInventoryData.splice(0);
        setTableData([]);
        getCurrentInventory();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function childToParent(data) {
    updateData(data);
  };

  useEffect(() => {
    if (expanded != true) {
      getCurrentInventory();
    }
    else {
      getItemInventory(item);
    }
  }, []);

  function updateData(data) {
    const i = UpdatedCurrentInventoryData.findIndex(_element => (_element[0] === data[0] && _element[1] === data[1] && _element[2] === data[2]));
    if (i > -1) UpdatedCurrentInventoryData[i] = data;
    else UpdatedCurrentInventoryData.push(data);
  }

  function onSave() {
    if (UpdatedCurrentInventoryData.length > 0) {
      updateItemInventory(UpdatedCurrentInventoryData);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10 }}>
      <ScrollView vertical>
        <ScrollView horizontal>
          <View style={{ width: expanded ? 410 : 430 }}>
            {expanded != true &&
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={[Styles.tablepadding, { flex: 0.5 }]}>
                </View>
                <View style={[Styles.tablepadding, { flex: 2.5 }]}>
                  <Text style={Styles.contentHeading}>{tableHead[0]}</Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 2 }]}>
                  <Text style={Styles.contentHeading}>{tableHead[1]}</Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.8 }]}>
                  <Text style={Styles.contentHeading}>{tableHead[2]}</Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 3.2 }]}>
                  <Text style={Styles.contentHeading}>{tableHead[3]}</Text>
                </View>
              </View>
            }
            {expanded != true &&
              <View style={Styles.horizontalLine} />
            }
            {expanded != true &&
              <View style={{ paddingBottom: 5 }} />
            }
            {tableData.map((item, index) => (
              <CurrentInventoryItem item={item} index={index} childToParent={childToParent} editable={expanded ? true : false} isParent={expanded ? false : true} key={index}></CurrentInventoryItem>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
      {expanded != true &&
        <View>
          <Text style={{ height: 10 }}></Text>
          <View style={{ alignItems: 'flex-end', paddingLeft: 14, paddingRight: 14 }}>
            <TouchableOpacity
              onPress={onSave}
              style={Styles.subButton}>
              <Text style={Styles.subButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ height: '10px' }}></Text>
          <View style={Styles.horizontalLine} />
          <Text style={{ height: '20px' }}></Text>
          <View style={{ paddingLeft: 14, paddingRight: 14, paddingBottom: 14 }}>
            <TouchableOpacity style={Styles.button}
              onPress={() => navigation.navigate('SelectLocations')}
            >
              <Text style={Styles.buttonText}>ORDER FOR NEXT WEEK</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ height: '20px' }}></Text>
        </View>
      }
    </View>
  );
};
