import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function Locations({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState();
  const [locationsData, setLocationsData] = useState([]);
  const [isLocationsFetched, setIsLocationsFetched] = useState(false);

  const getLocationsFromUDF = async () => {
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
      const shift = date.format("HH") < 15 ? 1 : 0;
      let response = await fetch(BASE_URL + 'connector/getLocationRecommendations?truck_id=' + TruckId[0] + '&shift=' + shift + '&day_of_week=' + (date.day() == 6 ? 0 : date.day()), {
        method: 'GET'
      });
      const json = await response.json();
      setLocationsData(json.result);
      setIsLocationsFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const updateSelectedLocation = async (data) => {
    try {
      let response = await fetch(BASE_URL + 'connector/updateSelectedLocation?data=' + data.map(a => a.join(":")).join(","), {
        method: 'GET'
      });
      if (response.status == 200) {
        navigation.navigate('LOCATION');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function onAccept(item) {
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
    updateSelectedLocation([[TruckId[0], date.format("YYYY-MM-DD"), item[7], item[0], parseFloat(item[8]).toFixed(2)]]);
  }

  useEffect(() => {
    getLocationsFromUDF();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ paddingTop: 20, paddingLeft: 30, paddingBottom: 10 }}>
        <Text style={Styles.content}>{"Truck ID: " + TruckId[0]}</Text>
        <Text style={Styles.content}>{currentDate}</Text>
      </View>
      <View style={Styles.container}>
        { isLocationsFetched &&
          <FlatList
            data={locationsData}
            scrollEnabled={true}
            vertical
            title='Recommended'
            ListHeaderComponent={() => <Text style={{ fontWeight: '700', fontSize: 18, color: '#11567F', fontFamily: 'lato' }}>Recommended</Text>}
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
                <View style={{ width: 380 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', fontFamily: 'lato' }}>
                    {item[2]}
                  </Text>
                  <Text style={Styles.contentHeading}>{'Address: '}
                    <Text style={Styles.content}>{item[3] + ", " + item[4] + ", " + item[5] + ", " + item[6]}</Text></Text>
                  <Text style={Styles.contentHeading}>{'Arrive By: '}
                    <Text style={Styles.content}>{item[7] == 1 ? "09:00 AM" : "04:00 PM"}</Text></Text>
                  <Text style={Styles.contentHeading}>{'Predicted Shift Sales: '}
                    <Text style={Styles.content}>{'$' + (parseFloat(item[8]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text></Text>
                  <Text style={{ height: 5 }}>{'\n'}</Text>
                  <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#11567F', padding: 5, marginRight: 40, cursor: 'pointer', borderRadius: 50 }}
                    onPress={() => onAccept(item)} >
                    <Text style={Styles.subButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </ListItem>
            }
          />
        }
      </View>
      <Text style={{ height: 30 }}>{'\n'}</Text>
    </View>
  );
};