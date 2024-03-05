import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import Styles from './Styles';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function InventoryOrderItem({ childToParent, item, index }) {
  const [isLoading, setLoading] = useState(true);
  const [totalQuantity, setTotalQuantity] = useState();

  useEffect(() => {
    setTotalQuantity(parseFloat(item[4]).toFixed(2));
  }, []);

  function updateTotal(updatedTotal, item) {
    setTotalQuantity(updatedTotal);
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
    if (parseFloat(item[4]) != parseFloat(updatedTotal)) {
      childToParent([TruckId[0], item[0], parseFloat(updatedTotal), date.format("YYYY-MM-DD")]);
    }
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1 }} key={index}>
      <View style={[Styles.tablepadding, { flex: 0.5 }]}>
        <Image
          style={{ width: 30, height: 30 }}
          source={{
            uri: item[5],
          }}
        />
      </View>
      <View style={[Styles.tablepadding, { flex: 2 }]}>
        <Text style={Styles.content}>
          {item[1]}
        </Text>
      </View>
      <View style={[Styles.tablepadding, { flex: 1.5 }]}>
        <Text style={Styles.content}>
          {item[2]}
        </Text>
      </View>
      <View style={[Styles.tablepadding, { flex: 1.5 }]}>
        <Text style={Styles.content}>
          {parseFloat(item[3]) > 0 ? parseFloat(item[3]).toFixed(2) : 0}
        </Text>
      </View>
      <View style={[Styles.tablepadding, { flex: 2 }]}>
        <TextInput
          style={{ cursor: 'pointer', width: 70, height: 25, padding: 5, background: '#ECECEC', fontWeight: '400', fontSize: 16, fontFamily: 'lato' }}
          value={totalQuantity ? totalQuantity : 0}
          onChangeText={(value) => updateTotal(value, item)} />
      </View>
    </View>
  );
};