import React, {
  useState,
  useLayoutEffect,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import { patchGroup } from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function GroupBioScreen({ navigation, route }) {
  // For activity indicator
  const [loading, setloading] = useState(false);
  const [bio, setBio] = useState(route.params.groupDetails.bio);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        } } onPress={ () => {
          onSaveButtonClicked();
        } }>{strings.done}</Text>
      ),
    });
  }, [navigation, bio]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const groupProfile = {};
    groupProfile.bio = bio;
    patchGroup(route.params.groupDetails.group_id, groupProfile).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        const entity = await Utility.getStorage('loggedInEntity')
        entity.obj = response.payload;
        Utility.setStorage('loggedInEntity', entity);
        navigation.goBack();
      } else {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, 'Something went wrong');
        }, 0.1)
      }
    })
  }

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View>
          <TCLabel title= {strings.bio}/>
          <TCTextField
            placeholder={strings.enterBioPlaceholder}
            onChangeText={(text) => setBio(text)}
            multiline
            maxLength={500}
            value={bio}
            height={155}
            />
        </View>
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
