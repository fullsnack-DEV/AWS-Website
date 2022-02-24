/* eslint-disable no-nested-ternary */
import React, {useState, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import * as Utility from '../../../../utils';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCThinDivider from '../../../../components/TCThinDivider';
import images from '../../../../Constants/ImagePath';
import TCKeyboardView from '../../../../components/TCKeyboardView';

export default function ScorekeepersSetting({navigation, route}) {
  console.log(
    'route?.params?.settingObj?.responsible_for_scorekeeper',
    route?.params?.settingObj?.responsible_for_scorekeeper,
  );
  const {comeFrom, sportName, sportType} = route?.params;
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const [selection, setSelection] = useState(
    
    route?.params?.settingObj && route?.params?.settingObj?.responsible_for_scorekeeper && route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure
      ? route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure?.length
      : 'None',
  );

  const [scorekeeper, setScorekeeper] = useState(
    route?.params?.settingObj?.responsible_for_scorekeeper &&
      route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure
      ? route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure
      : [],
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
  }, [comeFrom, navigation, scorekeeper, selection]);

  const renderNumbersOf = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        if (item !== 'None') {
          setSelection(item);
          const arr = [];

          for (let i = 0; i < item; i++) {
            const obj = {
              id: i,
              responsible_to_secure_scorekeeper: 'challengee',
              is_chief: i === 0,
            };
            arr.push(obj);
          }
          setScorekeeper(arr);
          setTimeout(() => {
            setVisibleModal(false);
          }, 300);
        } else {
          setSelection(item);
          const arr = [];

          for (let i = 0; i < item; i++) {
            const obj = {
              id: i,
              responsible_to_secure_scorekeeper: 'None',
              is_chief: i === 0,
            };
            arr.push(obj);
          }
          setScorekeeper(arr);
          setTimeout(() => {
            setVisibleModal(false);
          }, 300);
        }
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item}</Text>
        <View>
          {selection === item ? (
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

  const saveUser = () => {
    let bodyParams;
    if (selection === 'None') {
      bodyParams = {
        sport: sportName,
        sport_type: sportType,
        entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
        responsible_for_scorekeeper: {},
      };
    } else {
      let score;
      for (let i = 0; i < selection; i++) {
        score = [...scorekeeper];
        score[i].responsible_to_secure_scorekeeper = 'challengee';
        score[i].is_chief = i === 0;
      }
      setScorekeeper(score);
      bodyParams = {
        sport: sportName,
        sport_type: sportType,
        entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
        responsible_for_scorekeeper: {
          who_secure: scorekeeper.map((e) => {
            delete e.id;
            return e;
          }),
        },
      };
    }

    console.log('scorekeeper secure:=>', bodyParams);

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
          Alert.alert('Towns Cup', response.messages);
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
    let bodyParams;
    console.log('selection',selection);
    if (selection === 'None') {
      bodyParams = {
        sport: sportName,
        sport_type: sportType,
        entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
        responsible_for_scorekeeper: {},
      };
    } else {
      let score;
      for (let i = 0; i < selection; i++) {
        score = [...scorekeeper];
        score[i].responsible_to_secure_scorekeeper = 'challengee';
        score[i].is_chief = i === 0;
      }
      setScorekeeper(score);

      bodyParams = {
        sport: sportName,
        sport_type: sportType,
        entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
        responsible_for_scorekeeper: {
          who_secure: scorekeeper.map((e) => {
            delete e.id;
            return e;
          }),
        },
      };
    }

    console.log('scorekeeper secure:=>', bodyParams);
    
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
          Alert.alert('Towns Cup', response.messages);
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
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
      navigation.navigate(comeFrom, {
        scorekeeperSetting:
          selection !== 'None'
            ? {
                who_secure: scorekeeper.map((e) => {
                  delete e.id;
                  return e;
                }),
              }
            : {},
      });
    } else if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };

  return (
    <TCKeyboardView style={{flex: 1}}>
      <SafeAreaView>
        <ActivityLoader visible={loading} />

        <TCLabel
          title={strings.scorekeeperSettingTitle}
          style={{marginRight: 15}}
        />

        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
            marginLeft: 15,
            marginRight: 15,
            marginTop: 15,
          }}>
          {strings.scorekeeperRules1}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
            margin: 15,
          }}>
          {strings.scorekeeperRules2}
        </Text>
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => setVisibleModal(true)}>
          <Text style={styles.itemView}> {selection || '-'}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.itemView}>{'Scorekeeper(s)'}</Text>
            <Image
              source={images.dropDownArrow}
              style={styles.downArrowImage}
            />
          </View>
        </TouchableOpacity>

        {/* <View
          style={{
            flexDirection: 'row',
            margin: 15,
            marginTop: 35,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            {strings.AvailibilitySubTitle}
          </Text>
        </View> */}
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.darkThemeColor,
            margin: 15,
          }}>
          {
            'In order to complete this part, please click the Save button on the right top after choosing your preference.'
          }
        </Text>
        <Modal
          isVisible={visibleModal}
          backdropColor="black"
          onBackdropPress={() => setVisibleModal(false)}
          onRequestClose={() => setVisibleModal(false)}
          backdropOpacity={0}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.scorekeeperTitle}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={['None', 1, 2, 3, 4, 5]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderNumbersOf}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  itemView: {
    alignSelf: 'center',
    color: colors.blackColor,
  },
  viewContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    flexDirection: 'row',

    height: 40,
    width: '92%',
    marginTop: 12,
    paddingHorizontal: 15,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: '92%',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  downArrowImage: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 10,
  },
  modalViewContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
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
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  modalStyle: {
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
