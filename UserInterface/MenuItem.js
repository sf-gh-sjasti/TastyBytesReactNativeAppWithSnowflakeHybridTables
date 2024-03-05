import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Styles from './Styles';

export default function MenuItem({ item }) {
  const [isLoading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
  }, []);

  function openEditMode() {
    setEditMode(true);
  }

  return (
    <View>
      <Text style={Styles.content}>
        {item[0]}
      </Text>
      <Text style={{ height: 5 }}>{'\n'}</Text>
      <Text style={{ fontWeight: '900', fontSize: 16, fontFamily: 'lato' }}>
        {'$' + (parseFloat(item[1]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
      </Text>
      <Text style={{ height: 5 }}>{'\n'}</Text>
      {/* { editMode == false && 
                <View >
                    <TouchableOpacity
                        onPress={ openEditMode }
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:'#11567F',
                            borderRadius:50,
                            cursor: 'pointer',
                            width:37,
                            height:37
                            }}
                        >
                        <FontAwesome5 name="edit"  size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            }
            { editMode && 
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:'#11567F',
                            borderRadius:50,
                            width:37,
                            cursor: 'pointer',
                            height:37,
                            margin: 2.5
                        }}
                    >
                        <AntDesign name="checkcircle"  size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                            backgroundColor:'#11567F',
                            borderRadius:50,
                            cursor: 'pointer',
                            width:37,
                            height:37,
                            margin: 2.5
                        }}
                    >
                        <Entypo name="circle-with-cross"  size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            } */}
    </View>
  );
};