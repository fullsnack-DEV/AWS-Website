/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, {useState, useLayoutEffect, useCallback, useContext} from 'react';
import {Alert, StyleSheet, View, Text, FlatList, SafeAreaView, TextInput, Image, TouchableOpacity} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../../../auth/context';

import {patchPlayer} from '../../../../api/Users';
import {patchGroup} from '../../../../api/Groups';

import * as Utility from '../../../../utils';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCLabel from '../../../../components/TCLabel';
// import TCMessageButton from '../../../../components/TCMessageButton';
import TCTextInputClear from '../../../../components/TCTextInputClear';
import images from '../../../../Constants/ImagePath';
import {getNumberSuffix} from '../../../../utils/gameUtils';
import ScreenHeader from '../../../../components/ScreenHeader';

const MAX_HOUR_LIMIT = 100;
// const entity = {};
export default function GameDuration({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);
  // const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [firstPeriod, setFirstPeriod] = useState(route?.params?.settingObj?.game_duration ? route?.params?.settingObj?.game_duration?.first_period : 0);

  const [loading, setloading] = useState(false);
  const [withOverTime, setWithOverTime] = useState(!!route?.params?.settingObj?.game_duration?.overtime);
  const [details, setDetails] = useState(route?.params?.settingObj?.game_duration ? route?.params?.settingObj?.game_duration?.details : '');
  const [period, setPeriod] = useState(
    route?.params?.settingObj?.game_duration?.period
      ? route?.params?.settingObj?.game_duration?.period
      : [
          {
            id: 0,
            interval: 0,
            period: 0,
          },
        ],
  );
  const [overTime, setOverTime] = useState(
    route?.params?.settingObj?.game_duration?.overtime
      ? route?.params?.settingObj?.game_duration?.overtime
      : [
          {
            id: 0,
            interval: 0,
            overTime: 0,
          },
        ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, firstPeriod, details, withOverTime, period, overTime]);

  const addPeriod = () => {
    if (period.length < 10) {
      const obj = {
        id: period.length === 0 ? 0 : period.length,
        interval: 0,
        period: 0,
      };
      setPeriod([...period, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxPeriod);
    }
  };
  const addOverTime = () => {
    if (overTime.length < 10) {
      const obj = {
        id: overTime.length === 0 ? 0 : overTime.length,
        interval: 0,
        overTime: 0,
      };
      setOverTime([...overTime, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxOverTime);
    }
  };

  const renderPeriods = useCallback(
    ({index}) => (
      <View>
        <View style={styles.viewTitleContainer}>
          {index !== 0 && (
            <Text
              style={styles.deleteButton}
              onPress={() => {
                period.splice(index, 1);
                setPeriod([...period]);
              }}>
              {strings.delete}
            </Text>
          )}
        </View>

        <View style={styles.viewContainer}>
          <View style={styles.textTitle}>
            <View style={{flex: 1}}>
              <Text style={[styles.minText, {marginLeft: 10}]}>{strings.intervalText}</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(text) => {
                  const per = [...period];
                  period[index].interval = text;
                  setPeriod(per);
                }}
                value={period[index].interval}
              />
              <Text style={styles.minText}>{strings.minuteText}</Text>
            </View>
          </View>

          <View style={styles.textTitle}>
            <View style={{flex: 1}}>
              <Text style={[styles.minText, {marginLeft: 10}]}>
                {/* {strings.secondPeriodText} */}
                {`${getNumberSuffix(index + 2)} Period`}
              </Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(text) => {
                  const per = [...period];
                  period[index].period = text;
                  setPeriod(per);
                }}
                value={period[index].period}
              />
              <Text style={styles.minText}> {strings.minuteText}</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [period],
  );
  const renderOverTime = useCallback(
    ({index}) => (
      <View>
        <View style={styles.viewTitleContainer}>
          <Text style={styles.venueCountTitle}></Text>
          {index !== 0 && (
            <Text
              style={styles.deleteButton}
              onPress={() => {
                overTime.splice(index, 1);
                setOverTime([...overTime]);
              }}>
              {strings.delete}
            </Text>
          )}
        </View>

        <View style={styles.viewContainer}>
          <View style={styles.textTitle}>
            <View style={{flex: 1}}>
              <Text style={styles.minText}>{strings.intermission}</Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(text) => {
                  const over = [...overTime];
                  over[index].interval = text;
                  setOverTime(over);
                }}
                value={overTime[index].interval}
              />
              <Text style={[styles.minText, {marginRight: 15}]}> {strings.minuteText}</Text>
            </View>
          </View>

          <View style={styles.textTitle}>
            <View style={{flex: 1}}>
              <Text style={styles.minText}>
                {/* {strings.firstOverTimeText} */}
                {format(strings.FirstPeriodOfOverTime, getNumberSuffix(index + 1))}
              </Text>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={(text) => {
                  const over = [...overTime];
                  over[index].overTime = text;
                  setOverTime(over);
                }}
                value={overTime[index].overTime}
              />
              <Text style={[styles.minText, {marginRight: 15}]}> {strings.minuteText}</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [overTime],
  );

  const calculateDuration = () => {
    let sum = Number(firstPeriod);

    period.map((e) => {
      if (e.interval !== 0) {
        sum += Number(e?.interval);
      }
      if (e.period !== 0) {
        sum += Number(e?.period);
      }
    });
    if (withOverTime) {
      overTime.map((e) => {
        if (e.interval !== 0) {
          sum += Number(e?.interval);
        }
        if (e.overTime !== 0) {
          sum += Number(e?.overTime);
        }
      });
    }

    return {hours: Math.floor(sum / 60), minutes: sum % 60};
  };

  const saveUser = () => {
    if (sportType === 'single' && comeFrom === 'IncomingChallengeSettings') {
      const settingObj = {
        game_duration: {
          period: period.map((e) => {
            delete e.id;
            return e;
          }),
          first_period: firstPeriod,
          details,
        },
      };
      if (withOverTime) {
        settingObj.game_duration.overtime = overTime.map((e) => {
          delete e.id;
          return e;
        });
      } else {
        delete settingObj.game_duration.overtime;
      }
      navigation.navigate(comeFrom, {
        settingObj,
        sportType,
        sportName,
      });
    } else {
      const bodyParams = {
        sport: sportName,
        sport_type: sportType,
        entity_type: 'player',
        game_duration: {
          period: period.map((e) => {
            delete e.id;
            return e;
          }),
          first_period: firstPeriod,
          details,
        },
      };
      if (withOverTime) {
        bodyParams.game_duration.overtime = overTime.map((e) => {
          delete e.id;
          return e;
        });
      } else {
        delete bodyParams.game_duration.overtime;
      }

      bodyParams.game_duration.totalHours = calculateDuration().hours;
      bodyParams.game_duration.totalMinutes = calculateDuration().minutes;
      console.log('body params:=>', bodyParams);

      setloading(true);
      const registerdPlayerData = authContext?.entity?.obj?.registered_sports?.filter((obj) => {
        if (obj.sport === sportName && obj.sport_type === sportType) {
          return null;
        }
        return obj;
      });

      let selectedSport = authContext?.entity?.obj?.registered_sports?.filter((obj) => obj?.sport === sportName && obj?.sport_type === sportType)[0];

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
      if (calculateDuration().hours > MAX_HOUR_LIMIT) {
        Alert.alert(`Please enter less than ${MAX_HOUR_LIMIT} hours`);
      } else {
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
                settingObj: response.payload.registered_sports.filter((obj) => obj.sport === sportName && obj.sport_type === sportType)[0].setting,
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
    }
  };

  const saveTeam = () => {
    const bodyParams = {
      sport: sportName,
      sport_type: sportType,
      entity_type: 'team',
      game_duration: {
        period: period.map((e) => {
          delete e.id;
          return e;
        }),
        first_period: firstPeriod,
        details,
      },
    };
    if (withOverTime) {
      bodyParams.game_duration.overtime = overTime.map((e) => {
        delete e.id;
        return e;
      });
    } else {
      delete bodyParams.game_duration.overtime;
    }

    bodyParams.game_duration.totalHours = calculateDuration().hours;
    bodyParams.game_duration.totalMinutes = calculateDuration().minutes;
    console.log('body params:=>', bodyParams);
    setloading(true);
    const selectedTeam = authContext?.entity?.obj;
    selectedTeam.setting = {...selectedTeam.setting, ...bodyParams};
    const body = {...selectedTeam};
    console.log('Body Team::::--->', body);

    if (calculateDuration().hours > MAX_HOUR_LIMIT) {
      Alert.alert(`Please enter less than ${MAX_HOUR_LIMIT} hours`);
    } else {
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
    }
  };

  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
      const gameDuration = {
        period: period.map((e) => {
          delete e.id;
          return e;
        }),
        first_period: firstPeriod,
        details,
      };
      if (withOverTime) {
        gameDuration.overtime = overTime.map((e) => {
          delete e.id;
          return e;
        });
      }

      gameDuration.totalHours = calculateDuration().hours;
      gameDuration.totalMinutes = calculateDuration().minutes;

      navigation.navigate(comeFrom, {
        gameDuration,
      });
    } else if (authContext.entity.role === 'team') {
      saveTeam();
    } else {
      saveUser();
    }
  };
  return (
    <TCKeyboardView>
      <SafeAreaView style={{flex: 1}}>
        <ScreenHeader
          title={strings.gameDuration}
          leftIcon={images.backArrow}
          isRightIconText
          rightButtonText={strings.save}
          onRightButtonPress={() => {
            onSavePressed();
          }}
          leftIconPress={() => navigation.goBack()}
        />
        <ActivityLoader visible={loading} />

        <View>
          <TCLabel title={strings.PeriodsAndIntermissions} required style={{marginRight: 15, marginTop: 20}} />
          <View style={[styles.viewContainer, {marginTop: 10}]}>
            <View style={styles.textTitle}>
              <View style={{flex: 1}}>
                <Text style={[styles.minText, {marginLeft: 10}]}>{strings.firstPeriodText}</Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  keyboardType="number-pad"
                  numeric
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setFirstPeriod(text);
                  }}
                  value={firstPeriod}
                />
                <View>
                  <Text style={styles.minText}>{strings.minuteText}</Text>
                </View>
              </View>
            </View>
          </View>
          <FlatList data={period} renderItem={renderPeriods} keyExtractor={(item, index) => index.toString()} style={{marginBottom: 15}} />
          {/* <TCMessageButton
            title={strings.addIntervalPeriod}
            width={180}
            alignSelf={'center'}
            // marginTop={15}
            // marginBottom={40}
            color="#000"
            onPress={() => addPeriod()}
          /> */}
          <TouchableOpacity onPress={() => addPeriod()}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 30,
                color: colors.lightBlackColor,
                fontSize: 14,
                paddingHorizontal: 10,
                paddingVertical: 5,
                fontFamily: fonts.RBold,
                backgroundColor: colors.textFieldBackground,
                borderRadius: 5,
                textAlign: 'center',
              }}>
              {strings.addIntervalPeriod}
            </Text>
          </TouchableOpacity>

          <TCLabel title={strings.Overtime} style={{marginHorizontal: 15, marginTop: 40}} />
          <TCLabel
            title={strings.gameDurationTitle2}
            style={{
              marginHorizontal: 25,
              fontFamily: fonts.RRegular,
              marginTop: 15,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 20,
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={styles.checkBoxContainer}
              onPress={() => {
                setWithOverTime(!withOverTime);
              }}>
              <View>{withOverTime === false ? <Image source={images.radioCheckYellow} style={styles.checkboxImg} /> : <Image source={images.radioUnselect} style={styles.checkboxImg} />}</View>
              <Text style={[styles.minText, {marginLeft: 10}]}>{strings.withoutOverTimeText}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginLeft: 20,
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={styles.checkBoxContainer}
              onPress={() => {
                setWithOverTime(!withOverTime);
              }}>
              <View>{withOverTime === true ? <Image source={images.radioCheckYellow} style={styles.checkboxImg} /> : <Image source={images.radioUnselect} style={styles.checkboxImg} />}</View>
              <Text style={[styles.minText, {marginLeft: 10}]}>{strings.withOverTimeText}</Text>
            </TouchableOpacity>
          </View>
          {withOverTime ? (
            <View style={{marginLeft: 54}}>
              <FlatList data={overTime} renderItem={renderOverTime} keyExtractor={(item, index) => index.toString()} style={{marginBottom: 15}} />

              <TouchableOpacity onPress={() => addOverTime()} style={styles.btnContainer}>
                <Text style={styles.btnText}>{strings.addIntervalOverTime}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.totalTimeContainer}>
            <Text style={[styles.minText, {marginLeft: 10, fontFamily: fonts.RMedium}]}>{strings.totalDuration}</Text>

            <Text style={styles.totalTimeText}>{format(strings.hmTime, calculateDuration().hours !== null && calculateDuration().hours, calculateDuration().minutes !== null && calculateDuration().minutes)}</Text>
          </View>
          <TCLabel title={strings.Tiebreakers} style={{marginRight: 15}} />
          <TCTextInputClear
            placeholder={strings.TiebreakersPlaceholder}
            onChangeText={(text) => {
              setDetails(text);
            }}
            value={details}
            onPressClear={() => {
              setDetails('');
            }}
            multiline={true}
          />
          <TCLabel title={strings.otherDetails} style={{marginRight: 15, marginTop: 35}} />
          <TCTextInputClear
            placeholder={strings.otherDetailsPlaceholder}
            onChangeText={(text) => {
              setDetails(text);
            }}
            value={details}
            onPressClear={() => {
              setDetails('');
            }}
            multiline={true}
          />
        </View>
      </SafeAreaView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  viewContainer: {
    marginHorizontal: 15,
    // marginBottom: 5,
  },

  deleteButton: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.darkThemeColor,
    marginRight: 25,
    marginTop: 15,
  },
  viewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputContainer: {
    width: 142,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    paddingHorizontal: 4,
    paddingVertical: 0,
    flex: 1,
    textAlign: 'right',
    marginRight: 16,
  },
  minText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  textTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 35,
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
    marginLeft: 5,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  totalTimeText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 25,
    backgroundColor: colors.textFieldBackground,
    alignSelf: 'flex-start',
    borderRadius: 5,
    marginLeft: 20,
  },

  btnText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
});
