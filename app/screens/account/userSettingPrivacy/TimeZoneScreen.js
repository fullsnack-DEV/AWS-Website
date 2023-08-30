// @flow
import moment from 'moment';
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import ScreenHeader from '../../../components/ScreenHeader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const TimeZoneScreen = ({navigation}) => (
  <SafeAreaView style={styles.parent}>
    <ScreenHeader
      title={strings.timezoneText}
      leftIcon={images.backArrow}
      leftIconPress={() => navigation.goBack()}
      isRightIconText
      rightButtonText={strings.save}
      onRightButtonPress={() => {
        navigation.goBack();
      }}
      containerStyle={styles.headerRow}
    />
    <View style={styles.container}>
      <Text style={styles.label}>{strings.timeZoneDescription}</Text>

      <Pressable style={styles.timezone}>
        <Text style={styles.label}>
          {moment().format('MMMM DD, YYYY, hh:mmA')}
        </Text>
      </Pressable>
      <View style={styles.linkButton}>
        <Text style={styles.timeZoneText}>
          {' '}
          {`${strings.time} ${strings.zone}  `}
        </Text>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              Platform.OS === 'android' ? '' : strings.datetimesetting,
              Platform.OS === 'android' ? strings.datetimesetting : '',
              [
                {
                  text: strings.okTitleText,
                },
              ],
            );
          }}>
          <Text style={styles.timeZoneUnderlineText}>
            {Intl.DateTimeFormat()?.resolvedOptions().timeZone.split('/').pop()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  headerRow: {
    paddingLeft: 10,
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 14,
  },
  container: {
    paddingTop: 25,
    paddingLeft: 20,
    paddingRight: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  timezone: {
    padding: 10,
    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
    marginTop: 13,
  },
  timeZoneText: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 23,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  timeZoneUnderlineText: {
    marginTop: 3,
    fontSize: 14,
    lineHeight: 23,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textDecorationLine: 'underline',
  },
  linkButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 15,
  },
});
export default TimeZoneScreen;
