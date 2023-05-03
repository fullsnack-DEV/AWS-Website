import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

import {getJSDate} from '../../../utils';
import TCThinDivider from '../../../components/TCThinDivider';
import Verbs from '../../../Constants/Verbs';

export default function LogDetailModal({isVisible, invoice, log, closeList}) {
  const onDeletePress = () => {
    Alert.alert(
      Platform.OS === 'android' ? '' : strings.deleteLogText,
      Platform.OS === 'android' ? strings.deleteLogText : '',

      [
        {
          text: strings.cancel,
          onPress: () => console.log('invoice', invoice),
        },
        {
          text: strings.delete,
          onPress: () => console.log('log', log),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style3}
      onRightButtonPress={() => console.log('NextPressed')}
      headerRightButtonText={strings.done}
      title={strings.log}
      containerStyle={{padding: 0, width: '100%', height: '90%'}}
      showBackButton>
      <View
        style={{
          paddingHorizontal: 20,
          marginTop: 20,
          flex: 1,
        }}>
        {/* transction */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={styles.textStyle}>{strings.transctionNumber}</Text>
          <Text style={styles.textStyle}>88890</Text>
        </View>

        {/* logged by */}

        <View
          style={{
            flexDirection: 'row',
            marginTop: 6,
          }}>
          <Text
            style={[
              styles.textStyle,
              {color: colors.userPostTimeColor, fontSize: 12, lineHeight: 18},
            ]}>
            {strings.loggedbytxt}{' '}
          </Text>
          <Text
            style={[
              styles.textStyle,
              {color: colors.userPostTimeColor, fontSize: 12, lineHeight: 18},
            ]}>
            PP
          </Text>
        </View>

        {/* lig Detail */}

        <View
          style={{
            marginTop: 29,
            marginBottom: 25,
          }}>
          <View style={styles.rowStyle}>
            <Text style={styles.textStyle}>{strings.type}</Text>
            <Text style={styles.statusTextStyle}> Refund </Text>
          </View>
          <View style={[styles.rowStyle, {marginTop: 10}]}>
            <Text style={styles.textStyle}>{strings.amountTitle}</Text>
            <Text
              style={[styles.statusTextStyle, {color: colors.darkThemeColor}]}>
              {' '}
              Refund
            </Text>
          </View>
          <View style={[styles.rowStyle, {marginTop: 10}]}>
            <Text style={styles.textStyle}>{strings.method}</Text>
            <Text style={styles.statusTextStyle}> By check </Text>
          </View>
          <View style={[styles.rowStyle, {marginTop: 10}]}>
            <Text style={styles.textStyle}>{strings.loggedat}</Text>
            <Text style={styles.statusTextStyle}>
              {moment(getJSDate(1682922780)).format(Verbs.DATE_FORMAT)}
            </Text>
          </View>
        </View>

        <TCThinDivider width={'100%'} />

        <View style={{marginTop: 25}}>
          <Text style={styles.textStyle}>{strings.noteTitle}</Text>
          <Text style={[styles.textStyle, {marginTop: 10, marginLeft: 5}]}>
            Member ship canceled
          </Text>
        </View>

        {/* Delete Log */}

        <TouchableOpacity
          onPress={() => onDeletePress()}
          style={styles.btnstyle}>
          <Text style={styles.btntextstyle}>{strings.deletelogbtntext}</Text>
        </TouchableOpacity>
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  statusTextStyle: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    flex: 1,
    textAlign: 'right',
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnstyle: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  btntextstyle: {
    color: colors.darkThemeColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
});
