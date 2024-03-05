import React from 'react';
import { Text, View, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Launch({ route, navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('./Images/LaunchScreen.png')} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }} >
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 36, lineHeight: 50, fontWeight: '900', textAlign: 'center', fontFamily: 'texta-black' }}>DRIVER</Text>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, marginLeft: 30, marginRight: 30, cursor: 'pointer', borderRadius: 50 }}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={{ color: '#11567F', fontSize: 36, lineHeight: 50, fontWeight: '900', textAlign: 'center', fontFamily: 'texta-black' }}>SIGN IN</Text>
        </TouchableOpacity>
        <Text >{'\n'}</Text>
        <Text >{'\n'}</Text>
        <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, marginLeft: 30, marginRight: 30, cursor: 'pointer', borderRadius: 50 }}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={{ color: '#11567F', fontSize: 36, lineHeight: 50, fontWeight: '900', textAlign: 'center', fontFamily: 'texta-black' }}>SIGN UP</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};