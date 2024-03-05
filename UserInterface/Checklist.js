import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Styles from './Styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function Checklist({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [tableHead, setTableHead] = useState(['Item', 'Unit', 'Current Quantity', 'Quantity Needed']);
  const [tableData, setTableData] = useState([]);
  const [currentDate, setCurrentDate] = useState([]);

  const getItemChecklist = async () => {
    try {
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
      let response = await fetch(BASE_URL + 'connector/getItemChecklist?truck_id=' + TruckId[0] + 
                                '&shift=' + shift + '&location_id=' + locationId + '&date=' + date.format("YYYY-MM-DD"), {
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

  useEffect(() => {
    getItemChecklist();
  }, []);

  const { shift, locationId } = route.params;

  return (
    <View style={Styles.container}>
      <View style={{ paddingTop: 20, paddingLeft: 6, paddingBottom: 20 }}>
        <Text style={Styles.content}>{"Truck ID: " + TruckId[0]}</Text>
        <Text style={Styles.content}>{"Date: " + currentDate}</Text>
      </View>
      <ScrollView vertical>
        <ScrollView horizontal>
          <View style={{ width: 450 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={[Styles.tablepadding, { flex: 0.5 }]}>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[0]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[1]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[2]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 2.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[3]}</Text>
              </View>
            </View>
            <View style={Styles.horizontalLine} />
            <View style={{ paddingBottom: 5 }} />
            {tableData.map((item, index) => (
              <View style={{ flexDirection: 'row', flex: 1 }} key={index}>
                <View style={[Styles.tablepadding, { flex: 0.5, paddingTop: 13 }]}>
                  <Text>
                    <FontAwesome5 name="square-full" size={19} color={parseFloat(item[2]) >= parseFloat(item[3]) ? "#008F4A" : "#ED2323"} />
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {item[0]}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {item[1]}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {item[2] != null ? parseFloat(item[2]).toFixed(2) : 0}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 2.5 }]}>
                  <Text style={Styles.content}>
                    {item[3] != null ? parseFloat(item[3]).toFixed(2) : 0}
                  </Text>
                </View>
              </View>
            ))}
            <Text style={{ height: 30 }}>{'\n'}</Text>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};