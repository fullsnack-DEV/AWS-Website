import React, {
 useState, useLayoutEffect, useCallback,
 } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';
// import AuthContext from '../../../../auth/context';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import TCLabel from '../../../../components/TCLabel';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCTextInputClear from '../../../../components/TCTextInputClear';
import images from '../../../../Constants/ImagePath';
import { getNumberSuffix } from '../../../../utils/gameUtils';

// const entity = {};
export default function GameDuration({ navigation }) {
  // const isFocused = useIsFocused();
  // const authContext = useContext(AuthContext);
  const [firstPeriod, setFirstPeriod] = useState('');

  const [withOverTime, setWithOverTime] = useState(true);
  const [details, setDetails] = useState('');
  const [period, setPeriod] = useState([
    {
      id: 0,
      interval: '',
      secondPeriod: '',
    },
  ]);
  const [overTime, setOverTime] = useState([
    {
      id: 0,
      interval: '',
      firstOverTime: '',
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => Alert.alert('Save')}>
          Save
        </Text>
      ),
    });
  }, [navigation]);

  const addPeriod = () => {
    if (period.length < 10) {
      const obj = {
        id: period.length === 0 ? 0 : period.length,
        interval: '',
        secondPeriod: '',
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
        interval: '',
        firstOverTime: '',
      };
      setOverTime([...overTime, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxOverTime);
    }
  };

  const renderPeriods = useCallback(
    ({ index }) => (
      <View>
        <View style={styles.viewTitleContainer}>
          <Text></Text>
          {index !== 0 && (
            <Text
              style={styles.deleteButton}
              onPress={() => {
                period.splice(index, 1);
                setPeriod([...period]);
              }}>
              Delete
            </Text>
          )}
        </View>

        <View style={styles.viewContainer}>

          <View style={styles.textTitle}>
            <Text style={[styles.minText, { marginLeft: 10, flex: 0.4 }]}>
              {strings.intervalText}
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
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
            <Text style={[styles.minText, { marginLeft: 10, flex: 0.4 }]}>
              {/* {strings.secondPeriodText} */}
              {`${getNumberSuffix(index + 2)} Period`}
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={(text) => {
                  const per = [...period];
                  period[index].secondPeriod = text;
                  setPeriod(per);
                }}
                value={period[index].secondPeriod}
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
    ({ index }) => (
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
              Delete
            </Text>
          )}
        </View>

        <View style={styles.viewContainer}>
          <View style={styles.textTitle}>
            <Text style={[styles.minText, { marginLeft: 10, flex: 0.4 }]}>
              {strings.intervalText}

            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={(text) => {
                  const over = [...overTime];
                  overTime[index].interval = text;
                  setOverTime(over);
                }}
                value={overTime[index].interval}
              />
              <Text style={styles.minText}> {strings.minuteText}</Text>
            </View>
          </View>

          <View style={styles.textTitle}>
            <Text style={[styles.minText, { marginLeft: 10, flex: 0.4 }]}>
              {/* {strings.firstOverTimeText} */}
              {`${getNumberSuffix(index + 1)} Overtime`}
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={(text) => {
                  const over = [...overTime];
                  overTime[index].firstOverTime = text;
                  setOverTime(over);
                }}
                value={overTime[index].firstOverTime}
              />
              <Text style={styles.minText}> {strings.minuteText}</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [overTime],
  );
  return (
    <TCKeyboardView>
      <SafeAreaView>
        <View>
          <TCLabel
            title={strings.gameDurationTitle1}
            style={{ marginRight: 15 }}
          />
          <View style={[styles.textTitle, { marginLeft: 15, marginRight: 15, marginBottom: -10 }]}>
            <Text style={[styles.minText, { marginLeft: 10, flex: 0.4 }]}>
              {strings.firstPeriodText}
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={(text) => {
                  setFirstPeriod(text)
                }}
                value={firstPeriod}
              />
              <Text style={styles.minText}>{strings.minuteText}</Text>
            </View>
          </View>
          <FlatList
            data={period}
            renderItem={renderPeriods}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: 15 }}
          />
          <TCMessageButton
            title={'+ Add Interval & Period'}
            width={150}
            alignSelf={'center'}
            marginTop={15}
            marginBottom={40}
            onPress={() => addPeriod()}
          />
          <TCLabel
            title={strings.gameDurationTitle2}
            style={{ marginRight: 15 }}
          />
          <View
            style={{
              justifyContent: 'center',
              marginBottom: 5,
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={styles.checkBoxContainer}
              onPress={() => {
                setWithOverTime(!withOverTime);
              }}>
              <Text style={[styles.minText, { marginLeft: 10 }]}>
                {strings.withoutOverTimeText}
              </Text>
              <View>
                {withOverTime === false ? (
                  <Image
                    source={images.radioCheckYellow}
                    style={styles.checkboxImg}
                  />
                ) : (
                  <Image
                    source={images.radioUnselect}
                    style={styles.checkboxImg}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={styles.checkBoxContainer}
              onPress={() => {
                setWithOverTime(!withOverTime);
              }}>
              <Text style={[styles.minText, { marginLeft: 10 }]}>
                {strings.withOverTimeText}
              </Text>
              <View>
                {withOverTime === true ? (
                  <Image
                    source={images.radioCheckYellow}
                    style={styles.checkboxImg}
                  />
                ) : (
                  <Image
                    source={images.radioUnselect}
                    style={styles.checkboxImg}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          {withOverTime ? <View>
            <FlatList
            data={overTime}
            renderItem={renderOverTime}
            keyExtractor={(item, index) => index.toString()}
            style={{ marginBottom: 15 }}
          />
            <TCMessageButton
            title={'+ Add Interval & Overtime'}
            width={160}
            alignSelf={'center'}
            marginTop={15}
            marginBottom={40}
            onPress={() => addOverTime()}
          />
          </View> : <View style={{ marginBottom: 40 }}/>}
          <View style={styles.totalTimeContainer}>
            <Text style={[styles.minText, { marginLeft: 10, flex: 0.4 }]}>
              {strings.totalTimeTitle}
            </Text>

            <Text style={styles.totalTimeText}> 3h 30m</Text>
          </View>
          <TCLabel title={strings.detailsTitleText} style={{ marginRight: 15 }} />
          <TCTextInputClear
            placeholder={strings.venueDetailsPlaceholder}
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
    marginLeft: 15,
    marginRight: 15,
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
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  textInputContainer: {
    flex: 0.6,
    flexDirection: 'row',
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    // width: '70%',
    alignItems: 'center',
    marginBottom: 2,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,
    justifyContent: 'space-between',
  },
  textInput: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '76%',
    alignSelf: 'center',
    color: colors.lightBlackColor,
  },
  minText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  textTitle: {
    flexDirection: 'row',
    alignItems: 'center',
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

    justifyContent: 'space-between',
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
    marginLeft: 5,
    justifyContent: 'space-between',
  },
  totalTimeText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
});
