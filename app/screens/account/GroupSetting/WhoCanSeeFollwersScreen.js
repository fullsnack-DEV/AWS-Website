import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {patchGroup} from '../../../api/Groups';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import {updateUserProfile} from '../../../api/Users';

const WhoCanSeeFollowers = ({navigation, route}) => {
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const whoCanJoinGroupOpetions = [
    {key: strings.everyoneRadio, id: 0},
    {
      key:
        route.params?.type === Verbs.entityTypeUser
          ? format(strings.personWhoseRequestText, Verbs.me)
          : format(
              strings.personWhoseRequestText,
              authContext.entity.role === Verbs.entityTypeTeam
                ? Verbs.entityTypeTeam
                : Verbs.entityTypeClub,
            ),
      id: 1,
    },
  ];

  const [whoCanFollow, setwhoCanFollow] = useState(
    authContext.entity.obj.who_can_follow_me ?? 0,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const saveTeam = () => {
    //  who_can_follow_me
    const bodyParams = {
      who_can_follow_me: whoCanFollow,
    };

    if (route.params?.type === Verbs.entityTypeUser) {
      setloading(true);
      updateUserProfile(bodyParams, authContext)
        .then(async (response) => {
          navigation.goBack();

          await Utility.setAuthContextData(response.payload, authContext);
          setloading(false);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.appName, e.messages);
          }, 0.1);
          setloading(false);
        });
    } else {
      setloading(true);
      patchGroup(authContext.entity.uid, bodyParams, authContext)
        .then(async (response) => {
          if (response.status === true) {
            setloading(false);
            await Utility.setAuthContextData(response.payload, authContext);
            navigation.goBack();
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
    }
  };

  const renderWhocanJoinOption = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setwhoCanFollow(item.id);
      }}
      style={styles.radioItem}>
      <View style={{flex: 1}}>
        <Text style={styles.labelText}>{item.key}</Text>
      </View>
      <View style={styles.checkbox}>
        {whoCanFollow === item.id ? (
          <Image source={images.radioCheckYellow} style={styles.checkboxImg} />
        ) : (
          <Image source={images.radioUnselect} style={styles.checkboxImg} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={format(strings.whoCanSeeFollwerText)}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={() => {
          saveTeam();
        }}
      />
      <ActivityLoader visible={loading} />
      <Text style={styles.opetionsTitle}>
        Who can Follow
        {/* {authContext.entity.role === Verbs.entityTypeClub
          ? strings.whoCanJoinClub
          : strings.whoCanJoinTeam} */}
      </Text>
      <FlatList
        data={whoCanJoinGroupOpetions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWhocanJoinOption}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  opetionsTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginTop: 20,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 15,
  },
});

export default WhoCanSeeFollowers;
