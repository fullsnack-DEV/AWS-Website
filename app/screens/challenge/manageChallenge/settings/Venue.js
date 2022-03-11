/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
import React, {useState, useContext, useLayoutEffect, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';


import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import * as Utility from '../../../../utils';
import {getLatLong} from '../../../../api/External';

import AuthContext from '../../../../auth/context';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCLabel from '../../../../components/TCLabel';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCTextInputClear from '../../../../components/TCTextInputClear';

export default function Venue({navigation, route}) {
  const {comeFrom, sportName, sportType} = route?.params ?? {};

  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [selectedVenueIndex, setSelectedVenueIndex] = useState();

  const [venue, setVenue] = useState(
    route?.params?.settingObj?.venue
      ? route?.params?.settingObj?.venue
      : [
          {
            id: 0,
            name: '',
            address: '',
            details: '',
          },
        ],
  );
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
            const result = venue.filter(
              (obj) => obj.name === '' || obj.address === '',
            );
            if (result.length > 0) {
              Alert.alert('Please fill all fields.');
            } else {
              onSavePressed();
            }
          }}>
          Save
        </Text>
      ),
    });
  }, [navigation, venue, selectedVenueIndex]);

  const addVenue = () => {
    if (venue.length < 10) {
      const obj = {
        id: venue.length === 0 ? 0 : venue.length,
        name: '',
        address: '',
        details: '',
      };
      setVenue([...venue, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxVenue);
    }
  };

  const renderVenue = ({index}) => (
    <View>
      <View style={styles.viewTitleContainer}>
        <ActivityLoader visible={loading} />

        <Text style={styles.venueCountTitle}>Venue {index + 1}</Text>
        {index !== 0 && (
          <Text
            style={styles.deleteButton}
            onPress={() => {
              venue.splice(index, 1);
              setVenue([...venue]);
            }}>
            Delete
          </Text>
        )}
      </View>

      <View style={styles.viewContainer}>
        <TCTextInputClear
          placeholder={strings.venueNamePlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].name = text;
            setVenue(ven);
          }}
          value={venue[index].name}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].name = '';
            setVenue(ven);
          }}
          multiline={false}
        />

        {/* <TCTextInputClear
editable={false}
pointerEvents="none"
          placeholder={strings.venueAddressPlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].address = text;
            setVenue(ven);
          }}
          value={venue[index].address}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].address = '';
            setVenue(ven);
          }}
          multiline={false}
        /> */}

        <TouchableOpacity
          style={styles.detailsSingleContainer}
          onPress={() => {
            setSelectedVenueIndex(index);
            navigation.navigate('ChooseAddressScreen', {
              comeFrom: 'Venue',
            });
          }}>
          <TextInput
            editable={false}
            pointerEvents="none"
            style={styles.detailsSingleText}
            placeholder={strings.venueAddressPlaceholder}
            value={venue[index].address}
          />
        </TouchableOpacity>

        <TCTextInputClear
          placeholder={strings.venueDetailsPlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].details = text;
            setVenue(ven);
          }}
          value={venue[index].details}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].details = '';
            setVenue(ven);
          }}
          multiline={true}
        />

        {/* <View style={styles.radioContainer}>
            <Text style={styles.radioText}>None</Text>
            <TouchableOpacity
              onPress={() => {
                const ref = [...venue];
                ref[index].responsible_team_id = 'none';
                setVenue(ref);
              }}>
              <Image
                source={
                  venue[index].responsible_team_id === 'none'
                    ? images.radioCheckGreenBG
                    : images.radioUnselect
                }
                style={styles.radioSelectStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>
              {route.params.teamData[0].group_name
                || `${route.params.teamData[0].first_name} ${route.params.teamData[0].last_name}`}
              ’s home
            </Text>
            <TouchableOpacity
              onPress={() => {
                const ref = [...venue];
                ref[index].responsible_team_id = route.params.teamData[0].group_id
                  || route.params.teamData[0].user_id;
                setVenue(ref);
              }}>
              <Image
                source={
                  venue[index].responsible_team_id
                    === route.params.teamData[0].group_id
                  || venue[index].responsible_team_id
                    === route.params.teamData[0].user_id
                    ? images.radioCheckGreenBG
                    : images.radioUnselect
                }
                style={styles.radioSelectStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.radioText}>
              {route.params.teamData[1].group_name
                || `${route.params.teamData[1].first_name} ${route.params.teamData[1].last_name}`}
              ’s home
            </Text>
            <TouchableOpacity
              onPress={() => {
                const ref = [...venue];
                ref[index].responsible_team_id = route.params.teamData[1].group_id
                  || route.params.teamData[1].user_id;
                setVenue(ref);
              }}>
              <Image
                source={
                  venue[index].responsible_team_id
                    === route.params.teamData[1].group_id
                  || venue[index].responsible_team_id
                    === route.params.teamData[1].user_id
                    ? images.radioCheckGreenBG
                    : images.radioUnselect
                }
                style={styles.radioSelectStyle}
              />
            </TouchableOpacity>
          </View> */}
      </View>
    </View>
  );

  const saveUser = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'player',
      venue: venue.map((e) => {
        delete e.id;
        return e;
      }),
    };
    setloading(true);
    const registerdPlayerData = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => {
        if (obj.sport === sportName && obj.sport_type === sportType) {
          return null;
        }
        return obj;
      },
    );

    let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj?.sport === sportName && obj?.sport_type === sportType,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: {...selectedSport?.setting, ...bodyParams},
    };
    registerdPlayerData.push(selectedSport);

    const body = {
      ...authContext?.entity?.obj,
      registered_sports: registerdPlayerData,
    };
    console.log('Body::::--->', body);

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          console.log('Register player response IS:: ', response.payload);
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.registered_sports.filter(
              (obj) => obj.sport === sportName && obj.sport_type === sportType,
            )[0].setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        console.log('RESPONSE IS:: ', response);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const saveTeam = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'team',
      venue: venue.map((e) => {
        delete e.id;
        return e;
      }),
    };
    setloading(true);
    const selectedTeam = authContext?.entity?.obj;
    selectedTeam.setting = {...selectedTeam.setting, ...bodyParams};
    const body = {...selectedTeam};
    console.log('Body Team::::--->', body);

    patchGroup(authContext.entity.uid, body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          console.log('Team patch::::--->', response.payload);

          setloading(false);
          const entity = authContext.entity;
          entity.obj = response.payload;
          authContext.setEntity({...entity});

          await Utility.setStorage('authContextEntity', {...entity});
         
          navigation.navigate(comeFrom, {
          settingObj: response.payload.setting,
          });
         

        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const onSavePressed = () => {
    if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };

  const getLatLongData = (addressDescription) => {
    getLatLong(addressDescription, authContext).then((response) => {
      console.log('Lat/Long response::=>', response);

      const ven = [...venue];
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

      ven[selectedVenueIndex].address = route?.params?.venueObj?.description;
      ven[selectedVenueIndex].city = city;
      ven[selectedVenueIndex].state = state;
      ven[selectedVenueIndex].country = country;

      ven[selectedVenueIndex].coordinate = {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      };

      ven[selectedVenueIndex].region = {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      console.log('Ven:=>', ven);
      setVenue(ven);
    });
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />

      <SafeAreaView>
        <View>
          <TCLabel title={strings.venueTitle} style={{marginRight: 15}} />

          <FlatList
            data={venue}
            renderItem={renderVenue}
            keyExtractor={(item, index) => index.toString()}
            style={{marginBottom: 15}}
          />
          <TCMessageButton
            title={'+ Add Venue'}
            width={120}
            alignSelf={'center'}
            marginTop={15}
            marginBottom={40}
            onPress={() => addVenue()}
          />
        </View>
      </SafeAreaView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
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

  deleteButton: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.darkThemeColor,
    marginRight: 25,
  },
  viewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
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
