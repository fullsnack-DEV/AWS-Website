import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import colors from '../../../../Constants/Colors';
import strings from '../../../../Constants/String';
import TCLabel from '../../../../components/TCLabel';
import fonts from '../../../../Constants/Fonts';
import AuthContext from '../../../../auth/context';
import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import * as Utility from '../../../../utils';
import TCThinDivider from '../../../../components/TCThinDivider';
import images from '../../../../Constants/ImagePath';
import DataSource from '../../../../Constants/DataSource';

export default function GameFee({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);

  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [basicFee, setBasicFee] = useState(
    route?.params?.settingObj?.game_fee
      ? route?.params?.settingObj?.game_fee?.fee
      : 0,
  );
  const [visibleCurrencyModal, setVisibleCurrencyModal] = useState(false);

  const [currencyType, setCurruencyType] = useState(
    route?.params?.settingObj?.game_fee
      ? route?.params?.settingObj?.game_fee?.currency_type
      : authContext?.entity?.obj?.currency_type ?? strings.defaultCurrency,
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
  }, [
    authContext.entity.obj.currency_type,
    basicFee,
    comeFrom,
    currencyType,
    navigation,
  ]);

  const saveUser = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'player',
      game_fee: {
        fee: Number(parseFloat(basicFee).toFixed(2)),
        currency_type: currencyType,
      },
    };

    setloading(true);

    const registerdPlayerData =
      authContext?.entity?.obj?.registered_sports?.filter((obj) => {
        if (obj.sport === sportName && obj.sport_type === sportType) {
          return null;
        }
        return obj;
      });

    let selectedSport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) => obj.sport === sportName && obj.sport_type === sportType,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: {...selectedSport?.setting, ...bodyParams},
    };
    registerdPlayerData.push(selectedSport);
    console.log('registerdPlayerData::::--->', registerdPlayerData);
    console.log('selectedSport::::--->', selectedSport);

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
      game_fee: {
        fee: Number(parseFloat(basicFee).toFixed(2)),
        currency_type: currencyType,
      },
    };

    console.log('Fee team:', bodyParams);

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
    if (basicFee < 1 && basicFee > 0) {
      Alert.alert('User should not allow less than $1 match fee.');
    } else if (
      comeFrom === 'InviteChallengeScreen' ||
      comeFrom === 'EditChallenge'
    ) {
      navigation.navigate(comeFrom, {
        gameFee: {
          fee: Number(parseFloat(basicFee).toFixed(2)),
          currency_type: currencyType,
        },
      });
    } else if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };

  const renderCurrencyType = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setCurruencyType(item?.value);
        setTimeout(() => {
          setVisibleCurrencyModal(false);
        }, 300);
      }}
      style={{
        paddingHorizontal: 25,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text style={{marginTop: 15, marginBottom: 15}}>{item.label}</Text>
      <Image
        source={
          currencyType === item?.value
            ? images.radioCheckYellow
            : images.radioUnselect
        }
        style={{height: 22, width: 22}}
      />
    </TouchableOpacity>
  );

  const IsNumeric = (num) => num >= 0 || num < 0;
  return (
    <View>
      <ActivityLoader visible={loading} />
      <TCLabel title={strings.gameFeeTitle} />
      <View style={styles.matchFeeView}>
        <TextInput
          placeholder={strings.enterFeePlaceholder}
          style={styles.feeText}
          onChangeText={(text) => {
            if (IsNumeric(text)) {
              setBasicFee(text);
            }
          }}
          value={basicFee.toString()}
          keyboardType={'decimal-pad'}></TextInput>
        <Text
          style={[styles.curruency, {textDecorationLine: 'underline'}]}
          onPress={() => {
            setVisibleCurrencyModal(true);
          }}>
          {currencyType}
        </Text>
      </View>
      <Modal
        isVisible={visibleCurrencyModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleCurrencyModal(false)}
        onRequestClose={() => setVisibleCurrencyModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={10}
        backdropTransitionOutTiming={10}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={Utility.getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setVisibleCurrencyModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Currency Setting
            </Text>

            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.themeColor,
              }}></Text>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider width="92%" />}
            showsVerticalScrollIndicator={false}
            data={DataSource.CurrencyType}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCurrencyType}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  matchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,

    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    flexDirection: 'row',
    fontFamily: fonts.RRegular,
    fontSize: 16,
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  feeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    height: 40,
    width: '96%',
  },
  curruency: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

  closeButton: {
    alignSelf: 'center',
    width: 15,
    height: 15,
    marginLeft: 5,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,

    width: wp('100%'),
  },
});
