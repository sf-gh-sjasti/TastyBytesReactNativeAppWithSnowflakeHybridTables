import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import { ListItem } from "react-native-elements";
import MenuItem from './MenuItem';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';

export default function Menu({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [menuType, setMenuType] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isMenuFetched, setIsMenuFetched] = useState(false);

  const getMenuType = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getMenuType?truck_id=' + TruckId[0], {
        method: 'GET'
      });
      const json = await response.json();
      setMenuType(json.result[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getMenuItems = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getMenuItems?truck_id=' + TruckId[0], {
        method: 'GET'
      });
      const json = await response.json();
      setMenuItems(json.result);
      setIsMenuFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMenuType();
    getMenuItems();
  }, []);

  return (
    <View style={Styles.container}>
      <Text style={{ height: 10 }}>{'\n'}</Text>
      <Text style={{ fontWeight: '900', fontSize: 26, color: '#11567F', fontFamily: 'lato', alignItems: 'center' }}>{menuType[0]}</Text>
      <View style={{ flex: 1 }}>
        { isMenuFetched && 
          <FlatList
            data={menuItems}
            scrollEnabled={true}
            vertical
            title={menuType[1]}
            ListHeaderComponent={() => <Text style={{ fontWeight: '700', fontSize: 18, color: '#11567F', fontFamily: 'lato', paddingTop: 15 }}>{menuType[1]}</Text>}
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
                <Image
                  style={{ width: 150, height: 100 }}
                  source={{
                    uri: item[2],
                  }}
                />
                <MenuItem item={item} />
              </ListItem>
            }
          />
        }
        <Text style={{ height: 30 }}>{'\n'}</Text>
      </View>
    </View>
  );
};