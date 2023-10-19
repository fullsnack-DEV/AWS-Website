/* eslint-disable consistent-return */
import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import ScreenHeader from '../../../components/ScreenHeader';
import Verbs from '../../../Constants/Verbs';

export default function GroupOwnPrivacySetting({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [pointEvent] = useState('auto');
  const [teamSetting] = useState([
    {
      key:
        route.params?.type === Verbs.entityTypeUser
          ? 'Who can follow me'
          : strings.whoCanSeeFollwerText,
      id: 0,
    },
  ]);

  const [whoCanFollow, setwhoCanFollow] = useState(
    authContext.entity.obj?.who_can_follow_me,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      setwhoCanFollow(authContext.entity.obj?.who_can_follow_me);
    }
  }, [
    authContext.entity.obj?.who_can_follow_me,
    isFocused,
    route?.params?.whoCanSeeFollwer,
  ]);

  const handleOpetions = async (opetions) => {
    if (opetions === teamSetting[0].key) {
      navigation.navigate('WhoCanSeeFollowers', {
        type: route.params?.type,
      });
    }
  };

  const getSettingValue = useCallback(
    (item) => {
      if (item === teamSetting[0].key) {
        if (whoCanFollow === 0) {
          return strings.everyoneRadio;
        }
        if (whoCanFollow === 1) {
          return strings.camAccepted;
        }
        if (whoCanFollow === undefined) {
          return strings.everyoneRadio;
        }
      }
    },
    [whoCanFollow, teamSetting],
  );

  const renderMenu = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View
        style={{
          flexDirection: 'row',
          opacity: authContext.isAccountDeactivated && index <= 1 ? 0.5 : 1,
        }}
        pointerEvents={
          authContext.isAccountDeactivated && index <= 1 ? pointEvent : 'auto'
        }>
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === teamSetting[0].key && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.privacyText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.mainContainer}>
        <FlatList
          data={teamSetting}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },

  // headerTitle: {
  //   fontFamily: fonts.RBold,
  //   fontSize: 16,
  //   color: colors.lightBlackColor,
  // },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
    alignSelf: 'center',
  },
});
