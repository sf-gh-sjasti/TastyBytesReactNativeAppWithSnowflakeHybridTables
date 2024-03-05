import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import { ListItem } from "react-native-elements";
import { Rating } from 'react-native-ratings';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId, Images } from './UpdatedData';
import moment from 'moment-timezone';

export default function Notifications({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [notificationsData, setNotificationsData] = useState([]);
  const [currentDate, setCurrentDate] = useState([]);
  const [displayDate, setDisplayDate] = useState([]);
  const [femaleImages, setFemaleImages] = useState(Images[0]);
  const [maleImages, setMaleImages] = useState(Images[1]);
  const [placeHolderImg, setPlaceHolderImg] = useState(Images[2]);
  const [isNotificationsFetched, setIsNotificationsFetched] = useState(false);

  const getNotificationsData = async () => {
    try {
      var date;
      if(TruckId[0] == 81) {
        date = moment().tz("America/Toronto");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
        setDisplayDate(date.format("MM/DD/YYYY"));
      }
      else if(TruckId[0] == 162) {
        date = moment().tz("Europe/Paris");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
        setDisplayDate(date.format("MM/DD/YYYY"));
      }
      else if(TruckId[0] == 285) {
        date = moment().tz("Australia/Sydney");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
        setDisplayDate(date.format("MM/DD/YYYY"));
      }
      else if(TruckId[0] == 44) {
        date = moment().tz("America/Los_Angeles");
        setCurrentDate(date.format("MM/DD/YYYY, hh:mm:ss A"));
        setDisplayDate(date.format("MM/DD/YYYY"));
      }
      const response = await fetch(BASE_URL + 'connector/getNotifications?truck_id=' + TruckId[0] + '&currentDate=' + date.format("YYYY-MM-DD"), {
        method: 'GET'
      });

      const json = await response.json();
      setNotificationsData(json.result);
      setIsNotificationsFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getFemaleImages = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getAllImages?gender=Female', {
        method: 'GET'
      });
      const json = await response.json();
      setFemaleImages(json.result);
      Images[0] = json.result;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getMaleImages = async (gender) => {
    try {
      const response = await fetch(BASE_URL + 'connector/getAllImages?gender=Male', {
        method: 'GET'
      });
      const json = await response.json();
      setMaleImages(json.result);
      Images[1] = json.result;
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

  const getImage = (item) => {
    if (item[6] == 'Female') {
      return Number(item[0].slice(-2)) > 50 ? femaleImages[Number(item[0].slice(-2)) - 50] : femaleImages[Number(item[0].slice(-2))];
    }
    else if (item[6] == 'Male') {
      return Number(item[0].slice(-2)) >= 50 ? maleImages[Number(item[0].slice(-2)) - 50] : maleImages[Number(item[0].slice(-2))];
    }
    else {
      return placeHolderImg;
    }
  }

  useEffect(() => {
    getNotificationsData();
    if(Images[0].length == 0) {
      getFemaleImages();
    }
    if(Images[1].length == 0) {
      getMaleImages();
    }
    if(Images[2].length == 0) {
      getPlaceholderImg();
    }
  }, []);

  return (
    <View style={Styles.container}>
      <View style={{ paddingTop: 20, paddingBottom: 10 }}>
        <Text style={Styles.content}>{"Truck ID: " + TruckId[0]}</Text>
        <Text style={Styles.content}>{"Date: " + currentDate}</Text>
      </View>
      {femaleImages.length > 0 && maleImages.length > 0 && placeHolderImg.length > 0 && isNotificationsFetched && 
        <View style={{ flex: 1 }} >
          <FlatList
            data={notificationsData}
            scrollEnabled={true}
            vertical
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
                {item[0] != null &&
                  <View>
                    <Text style={Styles.contentHeading}>
                      {(item[2] ? (item[2] + (item[3] ? (" " + item[3]) : '')) : 'Anonymous Customer') + " Left a review!"}
                    </Text>
                    <Text style={{ height: 5 }}>{'\n'}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        style={{ width: 70, height: 70 }}
                        source={{
                          uri: (getImage(item))[0],
                        }}
                      />
                      <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{ paddingLeft: 10, width: 300, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '400', fontSize: 16, fontFamily: 'lato' }}>
                          {item[4] ? item[4] : 'No Comments Provided'} {'\n'}
                        </Text>
                        <Text style={{ height: 5 }}>{'\n'}</Text>
                        <Rating
                          type='custom'
                          ratingColor='#F1C644'
                          readonly={true}
                          ratingCount={5}
                          imageSize={20}
                          startingValue={item[5]}
                          style={{
                            paddingLeft: 10
                          }}
                        />
                        <Text style={{ height: 5 }}>{'\n'}</Text>
                        <View style={{ paddingLeft: 10 }}>
                          <TouchableOpacity style={Styles.subButton}
                            onPress={() => navigation.navigate('ReviewDetails', {
                              truckId: TruckId[0],
                              firstName: item[2],
                              lastName: item[3],
                              rating: item[5],
                              surveyId: item[0],
                              comments: item[4],
                              surveyDate: item[7],
                              displayDate: displayDate,
                              image: (getImage(item))[0]
                            })}
                          >
                            <Text style={Styles.subButtonText}>See Review</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                }
                {item[0] == null &&
                  <View>
                    <Text style={Styles.contentHeading}>
                      {item[2] + " Expiring Soon"}
                    </Text>
                    <Text style={{ height: 5 }}>{'\n'}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        style={{ width: 70, height: 70 }}
                        source={{
                          uri: item[6],
                        }}
                      />
                      <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{ paddingLeft: 10, width: 300, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '400', fontSize: 16, fontFamily: 'lato' }}>
                          {"Quantity Left: " + ((item[5] - Math.floor(item[5])) > 0 ? parseFloat(item[5]).toFixed(2) : item[5])} {'\n'}
                        </Text>
                        <Text style={{ height: 5 }}>{'\n'}</Text>
                        <View style={{ paddingLeft: 10 }}>
                          <TouchableOpacity style={Styles.subButton}
                            onPress={() => navigation.navigate('CurrentInventory', {
                            })}
                          >
                            <Text style={Styles.subButtonText}>View Inventory</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                }
              </ListItem>
            }
          />
        </View>
      }
    </View>
  );
};