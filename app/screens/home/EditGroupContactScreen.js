import React, { useState, useLayoutEffect, useContext } from 'react';

import {
  View, Text, ScrollView, Alert, StyleSheet,
} from 'react-native';

import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import TCPhoneNumber from '../../components/TCPhoneNumber';
import { patchGroup } from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import { Google_API_Key } from '../../utils/constant';
import * as Utility from '../../utils';

export default function EditGroupContactScreen({ navigation, route }) {
  // For activity indicator
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [groupData, setGroupData] = useState(route.params.groupDetails);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={{
            marginEnd: 16,
            fontSize: 14,
            fontFamily: fonts.RRegular,
            color: colors.lightBlackColor,
          }}
          onPress={() => {
            onSaveButtonClicked();
          }}>
          {strings.done}
        </Text>
      ),
    });
  }, [navigation, groupData]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const groupProfile = { ...groupData };
    patchGroup(groupData.group_id, groupProfile, authContext).then(async (response) => {
      setloading(false);
      const entity = authContext.entity
      entity.obj = response.payload;
      authContext.setEntity({ ...entity })
      Utility.setStorage('authContextEntity', { ...entity })
      navigation.goBack();
    }).catch(() => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, 'Something went wrong');
      }, 0.1);
    });
  };

  const onHomeFieldExist = () => {
    // setloading(true)
    Geocoder.init(Google_API_Key);
    Geocoder.from(groupData.homefield_address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        groupData.homefield_address_latitude = location.lat;
        groupData.homefield_address_longitude = location.lng;
        setGroupData({ ...groupData })
      })
      .catch((error) => {
        console.log(error)
        delete groupData.homefield_address_latitude;
        delete groupData.homefield_address_longitude;
        setGroupData({ ...groupData })
      })
      // .finally(() => setloading(false));
  }

  const onOfficeFieldExist = () => {
    // setloading(true)
    Geocoder.init(Google_API_Key);
    Geocoder.from(groupData.office_address)
      .then((json) => {
        const location = json.results[0].geometry.location;
        groupData.office_address_latitude = location.lat;
        groupData.office_address_longitude = location.lng;
        setGroupData({ ...groupData })
      })
      .catch((error) => {
        console.log(error)
        delete groupData.office_address_latitude;
        delete groupData.office_address_longitude;
        setGroupData({ ...groupData })
      })
      // .finally(() => setloading(false));
  }

  const coordinates = []
  const markers = []

  if (groupData.homefield_address_latitude && groupData.homefield_address_longitude) {
    coordinates.push({
      latitude: Number(groupData.homefield_address_latitude),
      longitude: Number(groupData.homefield_address_longitude),
    })
    markers.push({
      id: '1',
      latitude: groupData.homefield_address_latitude,
      longitude: groupData.homefield_address_longitude,
      name: strings.homeaddress,
      adddress: groupData.homefield_address,
      pinColor: 'red',
    })
  }

  if (groupData.office_address_latitude && groupData.office_address_longitude) {
    coordinates.push({
      latitude: Number(groupData.office_address_latitude),
      longitude: Number(groupData.office_address_longitude),
    })
    markers.push({
      id: '2',
      latitude: Number(groupData.office_address_latitude),
      longitude: Number(groupData.office_address_longitude),
      name: strings.officeaddress,
      adddress: groupData.office_address,
      pinColor: 'green',
    })
  }

  // const region = Utility.getRegionFromMarkers(coordinates)

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View>
          <TCLabel title={strings.website} style={{ marginTop: 37 }} />
          <TCTextField
            placeholder={strings.enterwebsite}
            onChangeText={(text) => setGroupData({ ...groupData, webSite: text })}
            value={groupData.webSite}
          />
        </View>
        <View>
          <TCLabel title={strings.emailPlaceHolder} style={{ marginTop: 37 }} />
          <TCTextField
            placeholder={strings.enterEmailPlaceholder}
            onChangeText={(text) => setGroupData({ ...groupData, email: text })}
            value={groupData.email}
          />
        </View>

        <View>
          <TCLabel title={strings.phone} />
          <TCPhoneNumber
            marginBottom={2}
            placeholder={strings.selectCode}
            value={groupData.phone_country}
            numberValue={groupData.phone}
            onValueChange={(value) => {
              setGroupData({ ...groupData, phone_country: value });
            }}
            onChangeText={(text) => {
              setGroupData({ ...groupData, phone: text });
            }}
          />
        </View>

        <View>
          <TCLabel title={strings.office} />
          <TCTextField placeholder={strings.officeaddress}
            onChangeText={(text) => setGroupData({ ...groupData, office_address: text })}
            value={groupData.office_address}
            onBlur={onOfficeFieldExist}
            />
        </View>

        <View>
          <TCLabel title={strings.homefield} />
          <TCTextField placeholder={strings.homeaddress}
            onChangeText={(text) => setGroupData({ ...groupData, homefield_address: text })}
            value={groupData.homefield_address}
            onBlur={onHomeFieldExist}
            />
        </View>

        {coordinates.length > 0 && <MapView
          style={styles.mapViewStyle}>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              identifier={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              description={marker.adddress}
              title={marker.name}
              pinColor={marker.pinColor}
            />
          ))}
        </MapView>
        }

        <View style={{ height: 50 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mapViewStyle: {
    height: 150,
    marginHorizontal: 15,
    marginTop: 25,
    borderRadius: 5,
  },
});
