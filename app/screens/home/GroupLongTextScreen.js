import React, {useState, useLayoutEffect, useContext} from 'react';

import {View, Text, ScrollView, Alert, StyleSheet} from 'react-native';

import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import {patchGroup} from '../../api/Groups';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';

export default function GroupLongTextScreen({navigation, route}) {
  // For activity indicator
  const [loading, setloading] = useState(false);
  const [textData, setTextData] = useState(
    route.params.isBylaw
      ? route.params.groupDetails.bylaw
      : route.params.groupDetails.bio,
  );
  const authContext = useContext(AuthContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.isBylaw ? strings.editbylaw : strings.editbio,
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
          }}
        >
          {strings.done}
        </Text>
      ),
    });
  }, [navigation, textData]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const groupProfile = {};
    if (route.params.isBylaw) {
      groupProfile.bylaw = textData;
    } else {
      groupProfile.bio = textData;
    }
    patchGroup(
      route.params.groupDetails.group_id,
      groupProfile,
      authContext,
    ).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        const entity = authContext.entity;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
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
          <TCLabel title={route.params.isBylaw ? strings.bylaw : strings.bio} />
          <TCTextField
            placeholder={
              route.params.isBylaw
                ? strings.enterBylawPlaceholder
                : strings.enterBioPlaceholder
            }
            onChangeText={(text) => setTextData(text)}
            multiline
            maxLength={500}
            value={textData}
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
  },
});
