import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LocationExpand from './LocationExpand';
import Styles from './Styles';

export default function WeekSchedule({ item, childToParent }) {
  const [isLoading, setLoading] = useState(true);
  const [expandMode, setExpandMode] = useState(false);

  function expandLocation() {
    if (expandMode) {
      setExpandMode(false);
    }
    else {
      setExpandMode(true);
    }
  }

  function childToChild(item) {
    childToParent(item);
  }

  useEffect(() => {
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={expandLocation}
          style={{ paddingRight: 10, cursor: 'pointer' }}>
          <FontAwesome5 name={expandMode ? "caret-down" : "caret-right"} size={35} color="#11567F" />
        </TouchableOpacity>
        <Text style={[Styles.contentHeading, { paddingTop: 6 }]}>
          {item[0] + item[1]}
        </Text>
      </View>
      {expandMode &&
        <View>
          <LocationExpand shift="Morning Shift" dayOfWeek={item[2]} date={item[1]} childToChild={childToChild}></LocationExpand>
          <LocationExpand shift="Evening Shift" dayOfWeek={item[2]} date={item[1]} childToChild={childToChild}></LocationExpand>
        </View>
      }
    </View>
  );
};