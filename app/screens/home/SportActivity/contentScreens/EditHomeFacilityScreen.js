// @flow
import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';

const EditHomeFacilityScreen = ({setData = () => {}}) => {
  useEffect(() => {
    setData({
      homePlace: {
        country: 'India',
        address:
          'KD Singh Babu Road, Preet Vihar Colony, Civil Lines, Barabanki, Uttar Pradesh, India',
        coordinate: {
          latitude: 26.9282721,
          longitude: 81.1883907,
        },
        city: 'Barabanki',
        name: 'KD singh',
        details: '',
        state: 'Uttar Pradesh',
        region: {
          longitudeDelta: 0.0421,
          latitudeDelta: 0.0922,
          latitude: 26.9282721,
          longitude: 81.1883907,
        },
      },
    });
  }, [setData]);
  return (
    <View style={styles.parent}>
      <Text>EditHomeFacilityScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
export default EditHomeFacilityScreen;
