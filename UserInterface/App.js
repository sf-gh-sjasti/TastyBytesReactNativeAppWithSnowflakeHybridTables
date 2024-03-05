import React from 'react';
import { View, Image } from 'react-native';
import Navigations from './Navigation'

export default function App() {
  return (
    <View style={{
      flex: 1, left: '30%', width: '450px', borderLeftWidth: '5px', borderTopWidth: '5px',
      borderRightWidth: '5px', borderBottomWidth: '5px', height: 'auto', minHeight: '100%', overflow: 'auto'
    }}>
      <Navigations />
      <View>
        <Image
          style={{
            width: 440,
            height: 20,
            position: 'absolute',
            bottom: 0,
            zIndex: 100
          }}
          source={require('./Images/TB_PoweredBySnowflake.png')}
        />
      </View>
    </View>
  );
}
