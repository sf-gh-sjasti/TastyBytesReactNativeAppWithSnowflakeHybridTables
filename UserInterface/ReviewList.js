import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import { ListItem } from "react-native-elements";
import { Rating } from 'react-native-ratings';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId, Images } from './UpdatedData';
import moment from 'moment-timezone';

export default function ReviewList({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState([]);
  const [reviewStats, setReviewStats] = useState([]);
  const [femaleImages, setFemaleImages] = useState(Images[0]);
  const [maleImages, setMaleImages] = useState(Images[1]);
  const [placeHolderImg, setPlaceHolderImg] = useState(Images[2]);
  const [isReviewsFetched, setIsReviewsFetched] = useState(false);

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

  const getReviewData = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getAllReviews?truck_id=' + TruckId[0], {
        method: 'GET'
      });

      const json = await response.json();
      setReviewData(json.result);
      setIsReviewsFetched(true);
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
    if (item[7] == 'Female') {
      return Number(item[0].slice(-2)) > 50 ? femaleImages[Number(item[0].slice(-2)) - 50] : femaleImages[Number(item[0].slice(-2))];
    }
    else if (item[7] == 'Male') {
      return Number(item[0].slice(-2)) >= 50 ? maleImages[Number(item[0].slice(-2)) - 50] : maleImages[Number(item[0].slice(-2))];
    }
    else {
      return placeHolderImg;
    }
  }

  useEffect(() => {
    getReviewStats();
    getReviewData();
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
      {reviewStats.length > 0 && femaleImages.length > 0 && maleImages.length > 0 && placeHolderImg.length > 0 && isReviewsFetched &&
        <View style={{ flex: 1 }}>
          <Text style={{ height: 10 }}>{'\n'}</Text>
          <View style={{ alignItems: 'center', border: '1px solid #D9D9D9' }}>
            <Text style={{ height: 10 }}>{'\n'}</Text>
            <Text style={{ fontWeight: '700', fontSize: 20, fontFamily: 'lato' }}>Overall Rating</Text>
            <Text style={{ height: 10 }}>{'\n'}</Text>
            <Rating
              type='custom'
              ratingColor='#F1C644'
              readonly={true}
              ratingCount={5}
              imageSize={30}
              startingValue={reviewStats[0]}
              style={{ alignItems: 'flex-start' }}
            />
            <Text style={{ height: 10 }}>{'\n'}</Text>
            <Text style={Styles.content}>{reviewStats[1] + ' Reviews'}</Text>
            <Text style={{ height: 10 }}>{'\n'}</Text>
          </View>
          <View style={{ flex: 1 }} >
            <FlatList
              data={reviewData}
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
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        style={{ width: 50, height: 50 }}
                        source={{
                          uri: (getImage(item))[0],
                        }}
                      />
                      <View style={{ alignItems: 'flex-start' }}>
                        <Text style={[Styles.contentHeading, { paddingLeft: 10 }]}>
                          {item[2] ? (item[2] + (item[3] ? (" " + item[3]) : '')) : 'Anonymous Customer'}
                        </Text>
                        <Text style={[Styles.content, { paddingLeft: 10 }]}>
                          {item[5]}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={{ height: 5 }}>{'\n'}</Text>
                      <Rating
                        type='custom'
                        ratingColor='#F1C644'
                        readonly={true}
                        ratingCount={5}
                        imageSize={20}
                        startingValue={item[6]}
                        style={{ alignItems: 'flex-start' }}
                      />
                      <Text style={{ height: 5 }}>{'\n'}</Text>
                      <Text style={{ width: 370, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'break-word', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, fontWeight: '400', fontSize: 16, fontFamily: 'lato' }}>
                        {item[4] ? item[4] : 'No Comments Provided'} {'\n'}
                      </Text>
                      <Text style={{ height: 5 }}>{'\n'}</Text>
                      <TouchableOpacity style={Styles.subButton}
                        onPress={() => navigation.navigate('ReviewDetails', {
                          truckId: TruckId[0],
                          firstName: item[2],
                          lastName: item[3],
                          rating: item[6],
                          surveyId: item[0],
                          comments: item[4],
                          surveyDate: item[5],
                          displayDate: item[5],
                          image: (getImage(item))[0]
                        })}
                      >
                        <Text style={Styles.subButtonText}>Full Review</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ListItem>
              }
            />
            <Text style={{ height: 30 }}>{'\n'}</Text>
          </View>
        </View>
      }
    </View>
  );
};