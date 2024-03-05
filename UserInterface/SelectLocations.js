import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';
import WeekSchedule from './WeekSchedule';
import { UpdatedSelectedLocations } from './UpdatedData';
import Styles from './Styles';
import { BASE_URL } from '@env';
import moment from 'moment-timezone';
import { TruckId } from './UpdatedData';

export default function Locations({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');

  useEffect(() => {
    var timeZone;
    if(TruckId[0] == 81) {
      timeZone = "America/Toronto";
    }
    else if(TruckId[0] == 162) {
      timeZone = "Europe/Paris";
    }
    else if(TruckId[0] == 285) {
      timeZone = "Australia/Sydney";
    }
    else if(TruckId[0] == 44) {
      timeZone = "America/Los_Angeles";
    }
    setWeekStart(moment().tz("America/Los_Angeles").day(1 + 7).format("MM/DD/YYYY"));
    setWeekEnd(moment().tz("America/Los_Angeles").day(7 + 7).format("MM/DD/YYYY"));
    setWeekSchedule([['Monday, ', moment().tz("America/Los_Angeles").day(1 + 7).format("MM/DD/YYYY"), 1],
    ['Tuesday, ', moment().tz("America/Los_Angeles").day(2 + 7).format("MM/DD/YYYY"), 2],
    ['Wednesday, ', moment().tz("America/Los_Angeles").day(3 + 7).format("MM/DD/YYYY"), 3],
    ['Thursday, ', moment().tz("America/Los_Angeles").day(4 + 7).format("MM/DD/YYYY"), 4],
    ['Friday, ', moment().tz("America/Los_Angeles").day(5 + 7).format("MM/DD/YYYY"), 5],
    ['Saturday, ', moment().tz("America/Los_Angeles").day(6 + 7).format("MM/DD/YYYY"), 6],
    ['Sunday, ', moment().tz("America/Los_Angeles").day(7 + 7).format("MM/DD/YYYY"), 0]]);
  }, []);

  const updateSelectedLocations = async (data) => {
    try {
      let response = await fetch(BASE_URL + 'connector/updateSelectedLocation?data=' + data.map(a => a.join(":")).join(","), {
        method: 'GET'
      });
      if (response.status == 200) {
        UpdatedSelectedLocations.splice(0);
        navigation.navigate('InventoryOrder');
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

  function onSave() {
    if (UpdatedSelectedLocations.length > 0) {
      updateSelectedLocations(UpdatedSelectedLocations);
    }
    else {
      navigation.navigate('InventoryOrder');
    }
  }

  function updateData(item) {
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
    let data = [TruckId[0], (new Date(item[1])).toISOString().split('T')[0], item[7], item[0], parseFloat(item[8]).toFixed(2)];
    const i = UpdatedSelectedLocations.findIndex(_element => (_element[0] === data[0] && _element[1] === data[1] && _element[2] === data[2]));
    if (i > -1) UpdatedSelectedLocations[i] = data;
    else UpdatedSelectedLocations.push(data);
  }

  return (
    <View style={Styles.container}>
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text style={{ fontWeight: '900', fontSize: 20, color: '#11567F', fontFamily: 'texta-black' }}>CHOOSE YOUR LOCATIONS</Text>
        <Text style={Styles.content}>Week: {weekStart} - {weekEnd}</Text>
      </View>
      <View style={Styles.horizontalLine} />
      <Text style={{ height: '10px' }}></Text>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={weekSchedule}
          scrollEnabled={true}
          vertical
          renderItem={({ item }) =>
            <ListItem>
              <WeekSchedule item={item} childToParent={childToParent}></WeekSchedule>
            </ListItem>
          }
        />
      </SafeAreaView>
      <Text style={{ height: '20px' }}></Text>
      <View style={{ paddingLeft: 14, paddingRight: 14, paddingBottom: 14 }}>
        <TouchableOpacity style={Styles.button}
          onPress={onSave}
        >
          <Text style={Styles.buttonText}>SAVE AND ORDER</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ height: '20px' }}></Text>
    </View>
  );
};