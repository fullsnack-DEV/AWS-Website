import React, { useState, useLayoutEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import EventMapView from '../../../components/Schedule/EventMapView';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

function ChooseVenueScreen({ navigation, route }) {
  const { venues, comeFrom } = route?.params;
  const [selectedVenue, setSelectedVenue] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            if (selectedVenue) {
              navigation.navigate(comeFrom, {
                selectedVenueObj: selectedVenue,
              });
            } else {
              Alert.alert('Please choose any one venue.');
            }
          }}>
          Save
        </Text>
      ),
    });
  }, [comeFrom, navigation, selectedVenue, venues]);

  const renderVenueList = ({ item }) => (
    <View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 15,
          marginRight: 15,
        }}>
        <View style={{ flex: 0.9 }}>
          <Text style={styles.venueTitle}>{item.name}</Text>
          <Text style={styles.venueAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <TouchableOpacity
          style={{ flex: 0.1 }}
          onPress={() => {
            setSelectedVenue(item);
          }}>
          {selectedVenue === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.venueContainer}>
        <EventMapView
          coordinate={item.coordinate}
          region={item.region}
          style={styles.map}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView>
      <FlatList
        data={venues}
        keyExtractor={(index) => index.toString()}
        renderItem={renderVenueList}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,

    marginBottom: 5,
  },
  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  venueContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    height: 35,
    width: '90%',
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default ChooseVenueScreen;
