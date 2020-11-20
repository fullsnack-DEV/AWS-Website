import React, { useState, useLayoutEffect } from 'react';

import {
  View, Text, ScrollView, Alert, StyleSheet,
} from 'react-native';

import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import TCPhoneNumber from '../../components/TCPhoneNumber';
import { patchGroup } from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function EditGroupContactScreen({ navigation, route }) {
  // For activity indicator
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
    const groupProfile = {};
    groupProfile.webSite = groupData.webSite;
    groupProfile.email = groupData.email;
    groupProfile.phone = groupData.phone;
    groupProfile.phone_country = groupData.phone_country;
    groupProfile.office_address = groupData.office_address
    groupProfile.homefield_address = groupData.homefield_address;

    patchGroup(groupData.group_id, groupProfile).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        console.log('response', response)
        // setTimeout(() => {
        //   Alert.alert('Towns Cup', 'Profile changed sucessfully');
        // }, 0.1)
        const entity = await Utility.getStorage('loggedInEntity');
        entity.obj = response.payload;
        Utility.setStorage('loggedInEntity', entity);
        navigation.goBack();
      } else {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, 'Something went wrong');
        }, 0.1);
      }
    });
  };

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
            />
        </View>

        <View>
          <TCLabel title={strings.homefield} />
          <TCTextField placeholder={strings.homeaddress}
          onChangeText={(text) => setGroupData({ ...groupData, homefield_address: text })}
            value={groupData.homefield_address}
            />
        </View>

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
});
