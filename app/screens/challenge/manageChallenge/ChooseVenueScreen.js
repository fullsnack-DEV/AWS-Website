/* eslint-disable array-callback-return */
import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import EventMapView from '../../../components/Schedule/EventMapView';
import TCTextInputClear from '../../../components/TCTextInputClear';
import {getLatLong} from '../../../api/External';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

function ChooseVenueScreen({navigation, route}) {
  const [venues] = useState(route?.params?.venues);
  const [comeFrom] = useState(route?.params?.comeFrom);

  const authContext = useContext(AuthContext);

  const [venueFooter, setVenueFooter] = useState(
    venues[venues.length - 1].isCustom
      ? {
          isCustom: true,
          name: venues[venues.length - 1].name,
          address: venues[venues.length - 1].address,
          details: venues[venues.length - 1].details,
          region: venues[venues.length - 1].region,
          coordinate: venues[venues.length - 1].coordinate,
          city: venues[venues.length - 1].city,
          state: venues[venues.length - 1].state,
          country: venues[venues.length - 1].country,
        }
      : {isCustom: true},
  );
  const [isChanged, setIsChanged] = useState(
    !venues[venues.length - 1].isCustom,
  );

  const [selectedVenue, setSelectedVenue] = useState();

  useEffect(() => {
    if (route?.params?.venueObj) {
      getLatLongData(route?.params?.venueObj?.description);

      console.log('Venue Object', route?.params?.venueObj);
    }
  }, [route?.params?.venueObj]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            console.log('selected venue details:=>', selectedVenue);
            if (selectedVenue) {
              if (selectedVenue.isCustom) {
                if (
                  selectedVenue.name &&
                  selectedVenue.address &&
                  selectedVenue.details
                ) {
                  navigation.navigate(comeFrom, {
                    selectedVenueObj: selectedVenue,
                  });
                } else {
                  Alert.alert('Please fill all details of venue.');
                }
              } else if (comeFrom === 'EditChallenge') {
                navigation.navigate(comeFrom, {
                  selectedVenueObj: selectedVenue,
                  groupObj: route?.params?.groupObj,
                  sportName: route?.params?.challengeObj?.sport,
                  challengeObj: route?.params?.challengeObj,
                  lastConfirmVersion: route?.params?.challengeObj,
                  settingObj: route?.params?.settingObj,
                });
              } else {
                navigation.navigate(comeFrom, {
                  selectedVenueObj: selectedVenue,
                });
              }
            } else {
              Alert.alert('Please choose any one venue.');
            }
          }}
        >
          Save
        </Text>
      ),
    });
  }, [comeFrom, navigation, selectedVenue, venues]);

  const renderVenueList = ({item}) => {
    if (item?.isCustom && isChanged) {
      return renderFooter({item});
    }
    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 15,
            marginRight: 15,
          }}
        >
          <View style={{flex: 0.9}}>
            <Text style={styles.venueTitle}>{item.name}</Text>
            <Text style={styles.venueAddress} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
          <TouchableOpacity
            style={{flex: 0.1}}
            onPress={() => {
              setSelectedVenue(item);
            }}
          >
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
        {item.isCustom && (
          <Text
            onPress={() => setIsChanged(!isChanged)}
            style={{
              color: colors.darkThemeColor,
              textAlign: 'right',
              marginRight: 15,
              marginTop: 10,
            }}
          >
            Change
          </Text>
        )}
      </View>
    );
  };

  const getLatLongData = (addressDescription) => {
    getLatLong(addressDescription, authContext).then((response) => {
      console.log('Lat/Long response::=>', response);

      let city, state, country;
      response.results[0].address_components.map((e) => {
        if (e?.types?.includes('country')) {
          country = e.long_name;
        }

        if (e?.types?.includes('administrative_area_level_1')) {
          state = e.long_name;
        }

        if (e?.types?.includes('administrative_area_level_2')) {
          city = e.long_name;
        }
      });

      const ven = {};

      ven.address = route?.params?.venueObj?.description;
      ven.city = city;
      ven.state = state;
      ven.country = country;
      ven.coordinate = {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      };
      ven.region = {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setVenueFooter({...venueFooter, ...ven});
      console.log('Ven:=>', {...venueFooter, ...ven});
    });
  };

  const renderFooter = ({item}) => (
    <View>
      <View style={[styles.viewTitleContainer, {marginRight: 15}]}>
        <Text style={styles.venueCountTitle}>Other place</Text>
        <TouchableOpacity
          style={{flex: 0.1}}
          onPress={() => {
            console.log('Custom venue item:=>', item);
            setSelectedVenue(item);
          }}
        >
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

      <View style={styles.viewContainer}>
        <TCTextInputClear
          placeholder={strings.venueNamePlaceholder}
          onChangeText={(text) => {
            const ven = {...venueFooter};
            ven.name = text;
            setVenueFooter(ven);
          }}
          value={venueFooter.name}
          onPressClear={() => {
            const ven = {...venueFooter};
            ven.name = '';
            setVenueFooter(ven);
          }}
          multiline={false}
        />

        <TouchableOpacity
          style={styles.detailsSingleContainer}
          onPress={() => {
            navigation.navigate('ChooseAddressScreen', {
              comeFrom: 'ChooseVenueScreen',
            });
          }}
        >
          <TextInput
            editable={false}
            pointerEvents="none"
            style={styles.detailsSingleText}
            placeholder={strings.venueAddressPlaceholder}
            value={venueFooter.address}
          />
        </TouchableOpacity>

        <TCTextInputClear
          placeholder={strings.venueDetailsPlaceholder}
          onChangeText={(text) => {
            const ven = {...venueFooter};
            ven.details = text;
            setVenueFooter(ven);
          }}
          value={venueFooter.details}
          onPressClear={() => {
            const ven = {...venueFooter};
            ven.details = '';
            setVenueFooter(ven);
          }}
          multiline={true}
        />
      </View>
    </View>
  );

  const preparedVenueList = () => {
    if (venues[venues.length - 1].isCustom) {
      venues[venues.length - 1] = venueFooter;
      return venues;
    }
    return [...venues, venueFooter];
  };
  return (
    <SafeAreaView>
      <FlatList
        data={preparedVenueList()}
        keyExtractor={(index) => index.toString()}
        renderItem={renderVenueList}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
        style={{marginTop: 20}}
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

  viewContainer: {
    marginLeft: 15,
    marginRight: 15,
  },
  venueCountTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 25,
    marginTop: 15,
  },

  viewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailsSingleContainer: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsSingleText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    height: 40,
    fontFamily: fonts.RRegular,
  },
});

export default ChooseVenueScreen;
