import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import Styles from './Styles';
import { BASE_URL } from '@env';
import { TruckId } from './UpdatedData';

export default function FoodWasteDetails({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [expiredInventoryData, setExpiredInventoryData] = useState([]);
  const [tableHead, setTableHead] = useState(['Item', 'Unit', 'Expired Quantity', 'Wasted Amount']);

  const getInventoryExpired = async () => {
    try {
      const response = await fetch(BASE_URL + 'connector/getInventoryWasted?truck_id=' + TruckId[0] + '&month=' + month + '&year=' + year, {
        method: 'GET'
      });
      const json = await response.json();
      setExpiredInventoryData(json.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInventoryExpired();
  }, []);

  const { foodWasteAmount, month, year } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10 }}>
      <View style={{ paddingLeft: 14, paddingRight: 14 }}>
        <View>
          <Text style={{ height: 10 }}>{'\n'}</Text>
          <Text style={Styles.content}>
            {month + ', ' + year}
          </Text>
          <Text style={{ height: 10 }}>{'\n'}</Text>
          <View>
            <Text style={{ fontWeight: '700', fontSize: 24, fontFamily: 'lato' }}>
              {'$' + (parseFloat(foodWasteAmount).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </View>
          <Text style={{ height: 20 }}>{'\n'}</Text>
        </View>
      </View>
      <ScrollView vertical>
        <ScrollView horizontal>
          <View style={{ width: 450 }}>
            <View style={Styles.horizontalLine} />
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 10, paddingLeft: 10, paddingBottom: 10 }}>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[0]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[1]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                <Text style={Styles.contentHeading}>{tableHead[2]}</Text>
              </View>
              <View style={[Styles.tablepadding, { flex: 2.3 }]}>
                <Text style={Styles.contentHeading}>{tableHead[3]}</Text>
              </View>
            </View>
            <View style={Styles.horizontalLine} />
            <View style={{ paddingBottom: 5 }} />
            {expiredInventoryData.map((item, index) => (
              <View style={{ flexDirection: 'row', flex: 1 }} key={index}>
                <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 10, paddingLeft: 10, paddingBottom: 10 }}>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={{
                      uri: item[2],
                    }}
                  />
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {item[0]}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {item[1]}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 1.5 }]}>
                  <Text style={Styles.content}>
                    {parseFloat(item[3]) > 0 ? parseFloat(item[3]).toFixed(2) : 0}
                  </Text>
                </View>
                <View style={[Styles.tablepadding, { flex: 2.3 }]}>
                  <Text style={Styles.content}>
                    {'$' + (parseFloat(item[4]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};