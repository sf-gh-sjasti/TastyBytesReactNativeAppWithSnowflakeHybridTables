import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import openMap from 'react-native-open-maps';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function LocationDetails({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [locationDetails, setLocationDetails] = useState([]);
  const [isReadyButtonDisabled, setIsReadyButtonDisabled] = useState(false);

  const getWarehouseLocationAndNavigate = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getWarehouseLocation?city=' + locationDetails[5], {
        method: 'GET'
      });
      const json = await response.json();
      const warehouseLocation = json.result[0];
      openMap({ navigate: true, start: warehouseLocation[0] + ', ' + warehouseLocation[1], end: locationDetails[9] + ", " + locationDetails[10], travelType: 'drive' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getLocationDetails = async () => {
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
      const shift = date.format("HH") < 15 ? 1 : 0;
      const response = await fetch(BASE_URL + 'connector/getSelectedLocationDetails?truck_id=' + TruckId[0] + '&shift=' + shift + '&date=' + date.format("YYYY-MM-DD"), {
        method: 'GET'
      });
      const json = await response.json();
      setLocationDetails(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getLocationDetails();
    });
  }, [navigation]);

  function navigateToLocation() {
    getWarehouseLocationAndNavigate();
  }

  function onImReadyClick() {
    setIsReadyButtonDisabled(true);
    navigation.navigate('ORDERS')
  }

  return (
    <View style={[Styles.container, { paddingTop: 24 }]}>
      {locationDetails && locationDetails.length > 0 &&
        <ScrollView>
          <View style={{flex:1}}>
            <View >
              <Text style={{ fontWeight: '900', fontSize: 26, color: '#11567F', fontFamily: 'lato' }}>{locationDetails[3]}</Text>
            </View>
            <Text style={{ height: 15 }}>{'\n'}</Text>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#11567F', fontFamily: 'lato' }}>Address:</Text>
              <Text style={Styles.contentHeading}>{locationDetails[4] + ", " + locationDetails[5] + ", " + locationDetails[6] + ", " + locationDetails[7]}</Text>
              <Text style={Styles.contentHeading}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#11567F', fontFamily: 'lato' }}>Arrive By: </Text>
              <Text style={Styles.contentHeading}>{locationDetails[1] == 1 ? "09:00 AM" : "04:00 PM"}</Text>
              <Text style={Styles.contentHeading}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#11567F', fontFamily: 'lato' }}>Date: </Text>
              <Text style={Styles.contentHeading}>{locationDetails[0]}</Text>
              <Text style={Styles.contentHeading}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 12, color: '#11567F', fontFamily: 'lato' }}>Predicted Shift Sales: </Text>
              <Text style={Styles.contentHeading}>{'$' + (parseFloat(locationDetails[8]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
              <Text style={Styles.contentHeading}>{'\n'}</Text>
              <Text style={Styles.contentHeading}>{'\n'}</Text>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#11567F', padding: 15, marginLeft: 20, marginRight: 20, cursor: 'pointer', borderRadius: 50 }}
                onPress={() => navigation.navigate('Locations')}
              >
                <Text style={[Styles.contentHeading, { color: '#FFFFFF' }]}>Change Location</Text>
              </TouchableOpacity>
              <Text style={{ height: 15 }}>{'\n'}</Text>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#11567F', padding: 15, marginLeft: 20, marginRight: 20, cursor: 'pointer', borderRadius: 50 }}
                onPress={() => navigation.navigate('Checklist',
                  {
                    shift: locationDetails[1],
                    locationId: locationDetails[2]
                  })}
              >
                <Text style={[Styles.contentHeading, { color: '#FFFFFF' }]}>Checklist</Text>
              </TouchableOpacity>
              <Text style={{ height: 15 }}>{'\n'}</Text>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#11567F', padding: 15, marginLeft: 20, marginRight: 20, cursor: 'pointer', borderRadius: 50 }}
                onPress={navigateToLocation}
              >
                <Text style={[Styles.contentHeading, { color: '#FFFFFF' }]}>Navigate</Text>
              </TouchableOpacity>
              <Text style={{ height: 15 }}>{'\n'}</Text>
              <TouchableOpacity style={{ alignItems: 'center', backgroundColor: (isReadyButtonDisabled ? '#8A999E' : '#11567F'), padding: 15, marginLeft: 20, marginRight: 20, cursor: (isReadyButtonDisabled ? 'unset' : 'pointer') , borderRadius: 50 }}
                onPress={onImReadyClick}
                disabled={isReadyButtonDisabled}
              >
                <Text style={[Styles.contentHeading, { color: '#FFFFFF' }]}>IM READY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      }
    </View>
  );
};