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
import { updateUserProfile } from '../../api/Accountapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function UserAboutScreen({ navigation, route }) {
  // For activity indicator
  const [loading, setloading] = useState(false);
  const [about, setAbout] = useState(route.params.userDetails.about);

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
  }, [navigation, about]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const userProfile = {};
    userProfile.about = about;
    updateUserProfile(userProfile).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        // setTimeout(() => {
        //   Alert.alert('Towns Cup', 'Profile changed sucessfully');
        // }, 0.1)
        const entity = await Utility.getStorage('loggedInEntity')
        entity.obj = response.payload;
        entity.auth.user = response.payload;
        Utility.setStorage('loggedInEntity', entity);
        navigation.goBack();
      } else {
        setTimeout(() => {
          Alert.alert('Towns Cup', 'Something went wrong');
        }, 0.1)
      }
    })
  }

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View>
          <TCLabel title= {strings.abouttitle}/>
          <TCTextField
            placeholder={strings.enterAboutPlaceholder}
            onChangeText={(text) => setAbout(text)}
            multiline
            maxLength={500}
            value={about}
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
