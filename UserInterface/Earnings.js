import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';

export default function Earnings({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [driverEarnings, setDriverEarnings] = useState([]);
  const [isEarningsFetched, setIsEarningsFetched] = useState(false);

  const getDriverEarnings = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getDriverEarnings?truck_id=' + TruckId[0], {
        method: 'GET'
      });
      const json = await response.json();
      setDriverEarnings(json.result);
      setIsEarningsFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDriverEarnings()
  }, []);

  const { earnings, locations } = route.params;

  return (
    <View style={Styles.container}>
      <View>
        <Text style={{ height: 10 }}>{'\n'}</Text>
        <View style={{ alignItems: 'center', border: '1px solid #11567F', padding: 15, flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ fontWeight: '400', fontSize: 12, fontFamily: 'lato', color: '#9C9C9C' }}>Total Earned</Text>
            <Text style={{ fontWeight: '900', fontSize: 28, fontFamily: 'lato' }}>$47,112.66</Text>
          </View>
          <View style={{ height: '100%', border: '1px solid #11567F', margin: 15 }}></View>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={{ fontWeight: '400', fontSize: 12, fontFamily: 'lato', color: '#9C9C9C' }}>Locations Visited</Text>
            <Text style={{ fontWeight: '900', fontSize: 28, fontFamily: 'lato' }}>102</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }} >
        { isEarningsFetched && 
          <FlatList
            data={driverEarnings}
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
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 2, alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={Styles.content}>
                        {item[0]}
                        {item[1] == 'AM' ? ' Morning | ' : ' Evening | '}
                        {item[2]}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ height: 5 }}>{'\n'}</Text>
                      <Text style={{ fontWeight: '700', fontSize: 24, fontFamily: 'lato' }}>
                        {'$' + (parseFloat(item[3]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      style={{ cursor: 'pointer' }}
                      onPress={() => navigation.navigate('EarningsDetail', {
                        date: item[0],
                        shift: item[1],
                        location: item[2],
                        earnedAmount: item[3],
                        locationId: item[4]
                      })}
                    >
                      <Entypo name="chevron-thin-right" color={'#CFCFCF'} size={60} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ListItem>
            }
          />
        }
        <Text style={{ height: 30 }}>{'\n'}</Text>
      </View>
    </View>
  );
};