import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';

export default function EarningsDetails({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [isInventoryFetched, setIsInventoryFetched] = useState(false);

  const getInventorySold = async () => {
    try {
      let dateFormat = new Date(date);
      let dateParam = dateFormat.getFullYear() + "-" + (dateFormat.getMonth() + 1) + "-" + dateFormat.getDate()
      const response = await fetch(BASE_URL + 'connector/getInventorySold?truck_id=' + TruckId[0] + '&date=' + dateParam + '&shift=' + shift + '&location_id=' + locationId, {
        method: 'GET'
      });
      const json = await response.json();
      setInventoryData(json.result);
      setIsInventoryFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getInventorySold();
  }, []);

  const { date, shift, location, earnedAmount, locationId } = route.params;

  return (
    <View style={Styles.container}>
      <View>
        <View>
          <Text style={{ height: 10 }}>{'\n'}</Text>
          <Text style={Styles.content}>
            {date}
            {shift == 'AM' ? ' Morning | ' : ' Evening | '}
            {location}
          </Text>
          <Text style={{ height: 10 }}>{'\n'}</Text>
          <View>
            <Text style={{ fontWeight: '700', fontSize: 24, fontFamily: 'lato' }}>
              {'$' + (parseFloat(earnedAmount).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </View>
          <Text style={{ height: 10 }}>{'\n'}</Text>
        </View>
        <View style={Styles.horizontalLine} />
      </View>
      <View style={{ flex: 1 }}>
        {isInventoryFetched && 
          <FlatList
            data={inventoryData}
            scrollEnabled={true}
            vertical
            title='Inventory Sold'
            ListEmptyComponent={
              <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{ height: 50 }}>{'\n'}</Text>
                <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
              </View>}
            ListHeaderComponent={() => <Text style={{ fontWeight: '700', fontSize: 18, color: '#11567F', fontFamily: 'lato', paddingTop: 15 }}>Inventory Sold</Text>}
            renderItem={({ item }) =>
              <ListItem>
                <View>
                  <Text style={Styles.content}>
                    {item[1] + "x " + item[0]}
                  </Text>
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