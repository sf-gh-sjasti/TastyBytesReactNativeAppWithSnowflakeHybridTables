import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';

export default function LocationExpand({ shift, dayOfWeek, date, childToChild }) {
  const [isLoading, setLoading] = useState(true);
  const [locationsData, setLocationsData] = useState([]);
  const [expandMode, setExpandMode] = useState(false);
  const [expandIcon, setExpandIcon] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [isLocationsFetched, setIsLocationsFetched] = useState(false);

  const getLocationRecommendations = async () => {
    try {
      let response = await fetch(BASE_URL + 'connector/getLocationRecommendations?truck_id=' + TruckId[0] + '&shift=' + (shift == "Morning Shift" ? 1 : 0) + '&day_of_week=' + dayOfWeek, {
        method: 'GET'
      });
      const json = await response.json();
      setLocationsData(json.result);
      setExpandMode(true);
      setIsLocationsFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getSelectedLocation = async () => {
    try {
      let response = await fetch(BASE_URL + 'connector/getSelectedLocation?truck_id=' + TruckId[0] + '&shift=' + (shift == "Morning Shift" ? 1 : 0) + '&day_of_week=' + dayOfWeek, {
        method: 'GET'
      });
      const json = await response.json();
      setSelectedLocation(json.result[0]);
      setLocationSelected(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  }, []);

  function selectLocation(item) {
    setExpandMode(false);
    setSelectedLocation([item[1], item[7], item[0], item[2], item[3], item[4], item[5], item[6], item[8], '', '']);
    setLocationSelected(true);
    if (selectedLocation[2] != item[0]) {
      childToChild(item);
    }
  }

  function expandShift() {
    if (expandIcon) {
      setExpandIcon(false);
      setLocationSelected(false);
      setExpandMode(false);
    }
    else {
      setExpandIcon(true);
      getSelectedLocation();
    }

  }

  function changeLocation() {
    setLocationSelected(false);
    getLocationRecommendations();
  }

  return (
    <View style={Styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={expandShift}
          style={{ paddingRight: 10, cursor: 'pointer' }}>
          <FontAwesome5 name={expandIcon ? "caret-down" : "caret-right"} size={35} color="#11567F" />
        </TouchableOpacity>
        <Text style={[Styles.contentHeading, { paddingTop: 6 }]}>
          {shift}
        </Text>
      </View>
      {expandMode &&
        <View style={{ paddingLeft: 10 }}>
          <SafeAreaView style={{ flex: 1 }}>
            {isLocationsFetched &&
              <FlatList
                data={locationsData}
                listKey={(item, index) => item[0] + index.toString()}
                windowSize={100}
                ListEmptyComponent={
                  <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{ height: 50 }}>{'\n'}</Text>
                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
                  </View>}
                renderItem={({ item }) =>
                  <ListItem>
                    <View style={{ width: 300 }}>
                      <Text style={Styles.contentHeading}>
                        {item[2]}
                      </Text>
                      <Text style={Styles.contentHeading}>{'Address: '}
                        <Text style={Styles.content}>{item[3] + ", " + item[4] + ", " + item[5] + ", " + item[6]}</Text></Text>
                      <Text style={Styles.contentHeading}>{'Predicted Shift Sales: '}
                        <Text style={Styles.content}>{'$' + (parseFloat(item[8]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text></Text>
                      <Text style={{ height: 5 }}>{'\n'}</Text>
                      <TouchableOpacity style={Styles.subButton}
                        onPress={() => selectLocation(item)}
                      >
                        <Text style={Styles.subButtonText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </ListItem>
                }
              />
            }
          </SafeAreaView>
        </View>
      }
      {locationSelected &&
        <View style={{ paddingLeft: 30, paddingRight: 10 }}>
          <Text style={Styles.contentHeading}>
            {selectedLocation[3]}
          </Text>
          <Text style={Styles.contentHeading}>{'Address: '}
            <Text style={Styles.content}>{selectedLocation[4] + ", " + selectedLocation[5] + ", " + selectedLocation[6] + ", " + selectedLocation[7]}</Text></Text>
          <Text style={Styles.contentHeading}>{'Predicted Shift Sales: '}
            <Text style={Styles.content}>{'$' + (parseFloat(selectedLocation[8]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text></Text>
          <Text style={{ height: 5 }}>{'\n'}</Text>
          <TouchableOpacity style={Styles.subButton}
            onPress={changeLocation}
          >
            <Text style={Styles.subButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
};