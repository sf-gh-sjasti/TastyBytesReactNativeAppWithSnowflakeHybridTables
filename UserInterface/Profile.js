import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId, Images } from './UpdatedData';
import moment from 'moment-timezone';

export default function Profile({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [driverDetails, setDriverDetails] = useState([]);
  const [reviewStats, setReviewStats] = useState([]);
  const [dailyDriverEarnings, setDailyDriverEarnings] = useState([]);
  const [allTimeDriverEarnings, setAllTimeDriverEarnings] = useState([]);
  const [locationsVisited, setLocationsVisited] = useState([]);
  const [placeHolderImg, setPlaceHolderImg] = useState(Images[2]);

  const getDriverDetails = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getDriverDetails?truck_id=' + TruckId[0], {
        method: 'GET'
      });
      const json = await response.json();
      setDriverDetails(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getReviewStats = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getReviewStats?truck_id=' + TruckId[0], {
        method: 'GET'
      });
      const json = await response.json();
      setReviewStats(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getDailyDriverEarnings = async () => {
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
      const response = await fetch(BASE_URL + 'connector/getDailyDriverEarnings?truck_id=' + TruckId[0] + '&currentTimestampHour=' + date.format("HH"), {
        method: 'GET'
      });
      const json = await response.json();
      setDailyDriverEarnings([[json.result[0]]]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getAllTimeDriverEarnings = async () => {
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
      const response = await fetch(BASE_URL + 'connector/getAllTimeDriverEarnings?truck_id=' + TruckId[0] + '&currentTimestamp=' + date.format("YYYY-MM-DD HH:mm:ss"), {
        method: 'GET'
      });
      const json = await response.json();
      setAllTimeDriverEarnings(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getLocationsVisited = async () => {
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
      const response = await fetch(BASE_URL + 'connector/getLocationsVisited?truck_id=' + TruckId[0] + '&currentTimestamp=' + date.format("YYYY-MM-DD HH:mm:ss"), {
        method: 'GET'
      });
      const json = await response.json();
      setLocationsVisited(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getPlaceholderImg = async (gender) => {
    try {
      const response = await fetch(BASE_URL + 'connector/getAllImages?gender=Undisclosed', {
        method: 'GET'
      });
      const json = await response.json();
      setPlaceHolderImg(json.result[0]);
      Images[2] = json.result[0];
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDriverDetails();
    getReviewStats();
    getDailyDriverEarnings();
    getAllTimeDriverEarnings();
    getLocationsVisited();
    if(Images[2].length == 0) {
      getPlaceholderImg();
    }
  }, []);

  return (
    <View style={Styles.container}>
      { driverDetails.length > 0 && placeHolderImg.length > 0 &&
        <ScrollView>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ height: 10 }}>{'\n'}</Text>
            <Image
              style={{ width: 100, height: 100 }}
              source={{
                uri: placeHolderImg[0],
              }}
            />
            <Text style={{ height: 5 }}>{'\n'}</Text>
            <Text style={{ paddingLeft: 10, color: '#11567F', fontWeight: '900', fontSize: 26, fontFamily: 'lato' }}>
              {(driverDetails[0] + ' ' + driverDetails[1]) == 'Corporate Owned' ? 'Michael Gates' : driverDetails[0] + ' ' + driverDetails[1]}
            </Text>
            <Text style={{ height: 5 }}>{'\n'}</Text>
            <Text style={Styles.content}>{"Truck ID: "}
              <Text style={{ fontWeight: '700', fontSize: 20, fontFamily: 'lato' }}>{TruckId[0]}</Text></Text>
            <Text style={{ height: 5 }}>{'\n'}</Text>
            <Rating
              type='custom'
              ratingColor='#F1C644'
              readonly={true}
              ratingCount={5}
              imageSize={35}
              startingValue={reviewStats[0]}
              style={{ paddingLeft: 10 }}
            />
            <Text style={{ height: 10 }}>{'\n'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 20, fontFamily: 'lato' }}>102</Text>
              <Text style={Styles.content}> Locations Visited</Text>
            </View>
            <Text style={{ height: 10 }}>{'\n'}</Text>
            {dailyDriverEarnings.length > 0 && allTimeDriverEarnings.length > 0 &&
              <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', border: '1px solid #11567F', padding: 15, flexDirection: 'row', flex: 1 }}>
                  <View style={{ alignItems: 'flex-start', flex: 2 }}>
                    <Text style={{ fontWeight: '400', fontSize: 12, fontFamily: 'lato', color: '#9C9C9C' }}>Earned Today</Text>
                    <Text style={{ fontWeight: '900', fontSize: 20, fontFamily: 'lato' }}>{parseFloat(dailyDriverEarnings[0]) > 0 ? '$' + (parseFloat(dailyDriverEarnings[0]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '$0.00'}</Text>
                  </View>
                  <View style={{ height: '100%', border: '1px solid #11567F', margin: 15 }}></View>
                  <View style={{ alignItems: 'flex-start', flex: 3 }}>
                    <Text style={{ fontWeight: '400', fontSize: 12, fontFamily: 'lato', color: '#9C9C9C' }}>Total Earned</Text>
                    <Text style={{ fontWeight: '900', fontSize: 20, fontFamily: 'lato' }}>$47,112.66</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', flex: 1 }}>
                    <TouchableOpacity
                      style={{ cursor: 'pointer' }}
                      onPress={() => navigation.navigate('Earnings', {
                        earnings: '$' + (parseFloat(allTimeDriverEarnings[0]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                        locations: locationsVisited[0]
                      })}>
                      <Entypo name="chevron-thin-right" color={'#11567F'} size={40} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ height: 10 }}>{'\n'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ cursor: 'pointer' }}
                    onPress={() => navigation.navigate('ReviewList')}>
                    <View style={{ width: 190, height: 120, backgroundColor: '#11567F', margin: 2.5, alignItems: 'center', paddingTop: 10 }}>
                      <Ionicons name="people" color={'#FFFFFF'} size={60} />
                      <Text style={{ fontWeight: '500', fontSize: 20, fontFamily: 'lato', color: '#FFFFFF' }}>Reviews</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ cursor: 'pointer' }}
                    onPress={() => navigation.navigate('FoodWaste') }>
                    <View style={{ width: 190, height: 120, backgroundColor: '#11567F', margin: 2.5, alignItems: 'center', paddingTop: 10 }}>
                      <Ionicons name="trash" color={'#FFFFFF'} size={60} />
                      <Text style={{ fontWeight: '500', fontSize: 20, fontFamily: 'lato', color: '#FFFFFF' }}>Food Waste</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ cursor: 'pointer' }}
                    onPress={() => navigation.navigate('CurrentInventory')}>
                    <View style={{ width: 190, height: 120, backgroundColor: '#11567F', margin: 2.5, alignItems: 'center', paddingTop: 15 }}>
                      <MaterialIcons name="inventory" color={'#FFFFFF'} size={60} />
                      <Text style={{ fontWeight: '500', fontSize: 20, fontFamily: 'lato', color: '#FFFFFF' }}>Inventory</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ cursor: 'pointer' }}
                    onPress={() => navigation.navigate('Menu')}>
                    <View style={{ width: 190, height: 120, backgroundColor: '#11567F', margin: 2.5, alignItems: 'center', paddingTop: 15 }}>
                      <MaterialIcons name="menu-book" color={'#FFFFFF'} size={60} />
                      <Text style={{ fontWeight: '500', fontSize: 20, fontFamily: 'lato', color: '#FFFFFF' }}>Menu</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={{ height: 10 }}>{'\n'}</Text>
                <View>
                  <TouchableOpacity
                    style={{ cursor: 'pointer' }}
                    onPress={() => navigation.navigate("SignIn") }>
                    <Text style={{ fontWeight: '700', fontSize: 16, fontFamily: 'lato', color: '#9C9C9C', textDecoration: 'underline', textAlign: 'center' }}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ height: 10 }}>{'\n'}</Text>
              </View>
            }
          </View>
        </ScrollView>
      }
    </View>
  );
};
