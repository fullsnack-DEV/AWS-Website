import React, { useState, useLayoutEffect } from 'react';
import {
 Alert,
 SafeAreaView,
 StyleSheet, Text, View, Image, FlatList, TouchableOpacity,
 } from 'react-native';

import EventMapView from '../../../components/Schedule/EventMapView';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

function ChooseVenueScreen({ navigation }) {
    const [selectedVenue, setSelectedVenue] = useState(0);
    const [region] = useState();

  const [cordinate] = useState({
    latitude: 0.0,
    longitude: 0.0,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.saveButtonStyle} onPress={() => {
         Alert.alert('Save')
        }}>Save</Text>
      ),
    });
  }, [navigation]);

const renderVenueList = ({ item }) => (
  <View>
    <View style={{
 flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginRight: 15,
    }}>
      <View style={{ flex: 0.9 }}>
        <Text style={styles.venueTitle}>Calgary stampede</Text>
        <Text style={styles.venueAddress}>
          555 Saddledome Rise SE, Calgary, AB T2G 2W1
        </Text>
      </View>
      <TouchableOpacity style={{ flex: 0.1 }} onPress={() => {
        setSelectedVenue(item)
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
              coordinate={cordinate}
              region={region}
              style={styles.map}
            />
    </View>

  </View>
    )

  return (
    <SafeAreaView>
      <FlatList
           data={[1, 2, 3, 4, 5]}
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
