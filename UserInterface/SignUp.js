import { View, ImageBackground } from 'react-native';

export default function SignUp({ route, navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('./Images/SignUp.png')} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }} >
      </ImageBackground>
    </View>
  );
};