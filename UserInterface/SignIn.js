import React, { useEffect, useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TruckId } from './UpdatedData';
import Styles from './Styles';
import { BASE_URL } from '@env';

export default function SignIn({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [truckId, setTruckId] = useState('');
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const validateTruckCredentials = async () => {
    try {
      const response = await fetch(BASE_URL + 'validateTruckCredentials?truck_id=' + TruckId[0] + '&password=' + password, {
        method: 'GET'
      });
      const json = await response.json();
      if((json.result[0])[0] == "true") {
        navigation.navigate('Home');
      }
      else {
        setErrorMsg("Your Truck Id or Password is incorrect");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      setTruckId('81');
      setErrorMsg("");
    });
  }, [navigation]);

  function updateTruckId(value) {
    setTruckId(value);
    TruckId[0] = value;
  }

  function updatePassword(value) {
    setPassword(value);
  }

  function handleKeyPress(e) {
    if(e.nativeEvent.key == "Enter"){
      onConfirm();
    }
  }

  function onConfirm() {
    updateTruckId(truckId);
    navigation.navigate('Home');
    // validateTruckCredentials();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#11567F' }}>
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 36, lineHeight: 50, fontWeight: '900', textAlign: 'center', fontFamily: 'texta-black' }}>SIGN IN</Text>
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900', paddingLeft: '50px', fontFamily: 'lato' }}>Truck ID:</Text>
      <TextInput style={{ height: 40, marginLeft: 50, marginRight: 50, borderWidth: 1, paddingLeft: '12px', backgroundColor: '#FFFFFF' }}
        value={ truckId }
        onKeyPress={ handleKeyPress }
      />
      {/* <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900', paddingLeft: '50px', fontFamily: 'lato' }}>Password:</Text>
      <TextInput secureTextEntry={true}
        style={{ height: 40, marginLeft: 50, marginRight: 50, borderWidth: 1, paddingLeft: '12px', backgroundColor: '#FFFFFF' }}
        value={ password || '' }
        onChangeText={ (value) => updatePassword(value) }
        onKeyPress={ handleKeyPress }
      /> */}
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#FFFFFF', padding: 5, marginLeft: 110, marginRight: 110, height: 45, cursor: 'pointer', borderRadius: 50 }}
        onPress={ onConfirm }
      >
        <Text style={{ color: '#11567F', fontSize: 26, fontWeight: '900', textAlign: 'center', fontFamily: 'texta-black' }}>CONFIRM</Text>
      </TouchableOpacity>
      <Text >{'\n'}</Text>
      <Text >{'\n'}</Text>
      <Text style={[ Styles.contentHeading, { color: 'red', textAlign: 'center' } ]}>{ errorMsg }</Text>
    </View>
  );
};