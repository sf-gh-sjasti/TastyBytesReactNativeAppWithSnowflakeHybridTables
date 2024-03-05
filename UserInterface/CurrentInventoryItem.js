import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CurrentInventory from './CurrentInventory';
import Styles from './Styles';
import { TruckId } from './UpdatedData';
import moment from 'moment-timezone';

export default function CurrentInventoryItem({ item, childToParent, editable, isParent, index }) {
  const [isLoading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState();
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    setQuantity(item[3]);
  }, []);

  function updateQuantity(updatedQuantity) {
    setQuantity(updatedQuantity);
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
    if (parseFloat(item[3]) != parseFloat(updatedQuantity)) {
      childToParent([TruckId[0], item[0], item[5], parseFloat(updatedQuantity), date.format("YYYY-MM-DD")]);
    }
  }

  function expand() {
    if (expanded) {
      setExpanded(false);
    }
    else {
      setExpanded(true);
    }
  }

  return (
    <View key={index}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={[Styles.tablepadding, { flex: 0.5 }]}>
          {isParent &&
            <Image
              style={{ width: 30, height: 30 }}
              source={{
                uri: item[5],
              }}
            />
          }
        </View>
        <View style={[Styles.tablepadding, { flex: 2.5, flexDirection: 'row' }]}>
            <View style={{ flex: 0.5 }}>
              {isParent &&
                <View>
                  {item[6] > 0 &&
                    <TouchableOpacity
                      onPress={expand}
                      style={{ cursor: 'pointer' }}>
                      <FontAwesome5 name={expanded ? "caret-down" : "caret-right"} size={25} color="#11567F" />
                    </TouchableOpacity>
                  }
                </View>
              }
            </View>
            <View style={{ flex: 2 }}>
              <Text style={Styles.content}>
                {item[1]}
              </Text>
            </View>
        </View>
        <View style={[Styles.tablepadding, { flex: 2.0 }]}>
          <Text style={Styles.content}>
            {item[2]}
          </Text>
        </View>
        <View style={[Styles.tablepadding, { flex: 1.8 }]}>
          {editable &&
            <View style={{ width: 110 }}>
              <TextInput
                style={{ cursor: 'pointer', width: 70, height: 25, padding: 5, background: '#ECECEC', fontWeight: '400', fontSize: 16, fontFamily: 'lato' }}
                value={quantity ? quantity : 0}
                onChangeText={(value) => updateQuantity(value)}
              />
            </View>
          }
          {editable == false &&
            <View>
              <Text style={Styles.content}>
                {quantity ? quantity : 0}
              </Text>
            </View>
          }
        </View>
        <View style={[Styles.tablepadding, { flex: 3.2 }]}>
          <Text style={Styles.content}>
            {item[4]}
          </Text>
        </View>
      </View>
      {expanded &&
        <View>
          <CurrentInventory expanded={true} item={item[0]}></CurrentInventory>
        </View>
      }
    </View>
  );
};