import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import Slider from 'react-native-sliders';
import { Rating } from 'react-native-ratings';
import { ScrollView } from 'react-native-gesture-handler';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function ReviewDetails({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [reviewDetailData, setReviewDetailData] = useState([]);

  const getReviewDetailData = async () => {
    try {
      let dateFormat = new Date(surveyDate);
      let dateParam = dateFormat.getFullYear() + "-" + (dateFormat.getMonth() + 1) + "-" + dateFormat.getDate();
      const response = await fetch(BASE_URL + 'connector/getReviewDetails?truck_id=' + truckId + '&survey_id=' + surveyId + '&date=' + dateParam, {
        method: 'GET'
      });

      const json = await response.json();
      setReviewDetailData(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getReviewDetailData();
  }, []);

  const { truckId, firstName, lastName, rating, surveyId, comments, surveyDate, displayDate, image } = route.params;

  return (
    <View style={Styles.container}>
      <View style={{ paddingTop: 20, paddingBottom: 20 }}>
        <Text style={Styles.content}>{"Truck ID: " + truckId}</Text>
        <Text style={Styles.content}>{"Date: " + displayDate}</Text>
      </View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={{
                uri: image,
              }}
            />
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ height: 5 }}>{'\n'}</Text>
              <Text style={{ paddingLeft: 10, fontWeight: '700', fontSize: 20, fontFamily: 'lato' }}>
                {firstName ? (firstName + (lastName ? (" " + lastName) : '')) : 'Anonymous Customer'}
              </Text>
              <Text style={{ height: 5 }}>{'\n'}</Text>
              <Rating
                type='custom'
                ratingColor='#F1C644'
                readonly={true}
                ratingCount={5}
                imageSize={20}
                startingValue={rating}
                style={{ paddingLeft: 10 }}
              />
            </View>
          </View>
          <Text style={{ height: 10 }}>{'\n'}</Text>
          <View style={Styles.horizontalLine} />
          <Text style={{ height: 20 }}>{'\n'}</Text>
          <View>
            {reviewDetailData && reviewDetailData.length > 0 &&
              <View>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                  <Text style={Styles.contentHeading}>Food</Text>
                  <Slider
                    value={parseFloat(reviewDetailData[0])}
                    minimumValue={0}
                    maximumValue={5}
                    disabled
                    thumbTintColor='#11567F'
                    minimumTrackTintColor='#11567F'
                    maximumTrackTintColor='#11567F'
                    thumbStyle={{ width: 11, height: 11 }}
                    trackStyle={{ height: 5 }}
                  />
                </View>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                  <Text style={Styles.contentHeading}>Service</Text>
                  <Slider
                    value={parseFloat(reviewDetailData[1])}
                    minimumValue={0}
                    maximumValue={5}
                    disabled
                    thumbTintColor='#11567F'
                    minimumTrackTintColor='#11567F'
                    maximumTrackTintColor='#11567F'
                    thumbStyle={{ width: 11, height: 11 }}
                    trackStyle={{ height: 5 }}
                  />
                </View>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                  <Text style={Styles.contentHeading}>Price</Text>
                  <Slider
                    value={parseFloat(reviewDetailData[2])}
                    minimumValue={0}
                    maximumValue={5}
                    disabled
                    thumbTintColor='#11567F'
                    minimumTrackTintColor='#11567F'
                    maximumTrackTintColor='#11567F'
                    thumbStyle={{ width: 11, height: 11 }}
                    trackStyle={{ height: 5 }}
                  />
                </View>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                  <Text style={Styles.contentHeading}>Location</Text>
                  <Slider
                    value={parseFloat(reviewDetailData[3])}
                    minimumValue={0}
                    maximumValue={5}
                    disabled
                    thumbTintColor='#11567F'
                    minimumTrackTintColor='#11567F'
                    maximumTrackTintColor='#11567F'
                    thumbStyle={{ width: 11, height: 11 }}
                    trackStyle={{ height: 5 }}
                  />
                </View>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                  <Text style={Styles.contentHeading}>Experience</Text>
                  <Slider
                    value={parseFloat(reviewDetailData[4])}
                    minimumValue={0}
                    maximumValue={5}
                    disabled
                    thumbTintColor='#11567F'
                    minimumTrackTintColor='#11567F'
                    maximumTrackTintColor='#11567F'
                    thumbStyle={{ width: 11, height: 11 }}
                    trackStyle={{ height: 5 }}
                  />
                </View>
                <Text style={{ height: 20 }}>{'\n'}</Text>
                <View style={{ alignItems: 'stretch', justifyContent: 'center' }}>
                  <Text style={{ fontWeight: '900', fontSize: 20, fontFamily: 'texta-black', color: '#11567F' }}>COMMENTS{'\n'}
                  </Text>
                  <Text style={Styles.content}>
                    {comments ? comments : 'No Comments Provided'} {'\n'}
                  </Text>
                </View>
              </View>
            }
          </View>
          <Text style={{ height: 30 }}>{'\n'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};