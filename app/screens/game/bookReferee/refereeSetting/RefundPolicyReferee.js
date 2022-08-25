/* eslint-disable no-unsafe-optional-chaining */
import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Text,
  Alert,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import AuthContext from '../../../../auth/context';

import images from '../../../../Constants/ImagePath';
import * as Utility from '../../../../utils';
import {patchPlayer} from '../../../../api/Users';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import strings from '../../../../Constants/String';

export default function RefundPolicyReferee({navigation, route}) {
  const policiesTypeList = [
    {key: strings.strictText, id: 1},
    {key: strings.moderateText, id: 2},
    {key: strings.flexibleText, id: 3},
  ];

  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);

  const [typeSelection, setTypeSelection] = useState(
    (route?.params?.settingObj?.refund_policy === strings.strictText &&
      policiesTypeList[0]) ||
      (route?.params?.settingObj?.refund_policy === strings.moderateText &&
        policiesTypeList[1]) ||
      (route?.params?.settingObj?.refund_policy === strings.flexibleText &&
        policiesTypeList[2]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed();
          }}>
          Save
        </Text>
      ),
    });
  }, [comeFrom, navigation, typeSelection.key]);

  const renderPolicyTypes = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setTypeSelection(item);
      }}>
      <View style={styles.radioItem}>
        <Text style={styles.languageList}>{item.key}</Text>
        <View style={styles.checkbox}>
          {typeSelection?.key === item?.key ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
      navigation.navigate(comeFrom, {
        refundPolicy: typeSelection.key,
      });
    } else {
      const refereeSetting = (
        authContext?.entity?.obj?.referee_data ?? []
      ).filter((obj) => obj.sport === sportName)?.[0]?.setting;

      const modifiedSetting = {
        ...refereeSetting,
        sport: sportName,
        entity_type: 'referee',
        refund_policy: typeSelection.key,
      };

      setloading(true);
      const registerdRefereeData =
        authContext?.entity?.obj?.referee_data?.filter(
          (obj) => obj?.sport !== sportName,
        );

      let selectedSport = authContext?.entity?.obj?.referee_data?.filter(
        (obj) => obj?.sport === sportName,
      )[0];

      selectedSport = {
        ...selectedSport,
        setting: modifiedSetting,
      };
      registerdRefereeData.push(selectedSport);

      const body = {
        ...authContext?.entity?.obj,
        referee_data: registerdRefereeData,
      };
      console.log('Body::::--->', body);

      patchPlayer(body, authContext)
        .then(async (response) => {
          if (response.status === true) {
            setloading(false);
            const entity = authContext.entity;
            console.log('Register referee response IS:: ', response.payload);
            entity.auth.user = response.payload;
            entity.obj = response.payload;
            authContext.setEntity({...entity});
            authContext.setUser(response.payload);
            await Utility.setStorage('authContextUser', response.payload);
            await Utility.setStorage('authContextEntity', {...entity});
            navigation.navigate(comeFrom, {
              settingObj: response.payload.referee_data.filter(
                (obj) => obj.sport === sportName,
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
    }
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}>
      <ActivityLoader visible={loading} />

      <TCLable title={strings.gameTyleTitle} required={false} />
      <FlatList
        // ItemSeparatorComponent={() => <TCThinDivider />}
        data={policiesTypeList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPolicyTypes}
      />
      {typeSelection.key === strings.strictText && (
        <View style={styles.policyTypeNotes}>
          <Text style={styles.policyTypeHeading}>{strings.strictText}</Text>
          <Text style={styles.policyTypeTitle}>
            {strings.strictPoint1Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.strictPoint1Desc}
          </Text>
          <Text style={[styles.policyTypeTitle, {marginTop: 25}]}>
            {strings.strictPoint2Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.strictPoint2Desc}
          </Text>
          <Text style={[styles.policyTypeTitle, {marginTop: 25}]}>
            {strings.strictPoint3Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.strictPoint3Desc}
          </Text>
        </View>
      )}

      {typeSelection.key === strings.moderateText && (
        <View style={styles.policyTypeNotes}>
          <Text style={styles.policyTypeHeading}>{strings.moderateText}</Text>
          <Text style={styles.policyTypeTitle}>
            {strings.moderatePoint1Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.moderatePoint1Desc}
          </Text>

          <Text style={[styles.policyTypeTitle, {marginTop: 25}]}>
            {strings.moderatePoint2Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.moderatePoint2Desc}
          </Text>

          <Text style={[styles.policyTypeTitle, {marginTop: 25}]}>
            {strings.moderatePoint3Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.moderatePoint3Desc}
          </Text>
        </View>
      )}

      {typeSelection.key === strings.flexibleText && (
        <View style={styles.policyTypeNotes}>
          <Text style={styles.policyTypeHeading}>{strings.flexibleText}</Text>
          <Text style={styles.policyTypeTitle}>
            {strings.flexiblePoint1Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.flexiblePoint1Desc}
          </Text>
          <Text style={[styles.policyTypeTitle, {marginTop: 25}]}>
            {strings.flexiblePoint2Title}
          </Text>
          <Text style={styles.policyTypeDetail}>
            {strings.flexiblePoint2Desc}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  mainContainer: {
    flex: 1,
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {},
  radioItem: {
    paddingLeft: 25,
    paddingTop: 15,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  policyTypeNotes: {
    margin: 15,
    padding: 15,
    backgroundColor: colors.offwhite,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 15,
  },
  policyTypeTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.veryLightBlack,
  },
  policyTypeHeading: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
  },
  policyTypeDetail: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
});
