import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Image} from 'react-native';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';

function RefereeReservationItem({data, onPressButton}) {
  let refereeImage = null;
  let refereeName = '';
  let status = '';
  let statusColor = '';
  if (data && data.referee) {
    if (data.referee.thumbnail) {
      refereeImage = data.referee.thumbnail;
    }
    if (data.referee.full_name) {
      refereeName = data.referee.full_name;
    }
  }
  if (data.status === strings.pendingPayment) {
    status = strings.awaitingPayment;
    statusColor = colors.orangeColor;
  }
  if (data.status === strings.offered) {
    status = strings.requestSent;
    statusColor = colors.orangeColor;
  }
  if (data.status === strings.cancelled) {
    status = strings.Cancelled;
    statusColor = colors.grayEventColor;
  }
  if (data.status === strings.requestCancelled) {
    status = strings.reqCan;
    statusColor = colors.orangeColor;
  }
  if (data.status === strings.accepted) {
    status = strings.Accept;
    statusColor = colors.greeColor;
  }
  if (data.status === strings.declined) {
    status = strings.Decline;
    statusColor = colors.grayEventColor;
  }
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={onPressButton}>
      <Text style={styles.chiefTextStyle}>{strings.chiefReferee}</Text>
      <View style={styles.refereeDataViewStyle}>
        <Image
          source={
            refereeImage ? {uri: refereeImage} : images.profilePlaceHolder
          }
          style={styles.refereeImageStyle}
        />
        <View style={{marginLeft: 10}}>
          <Text style={styles.refereeNameTextStyle}>{refereeName}</Text>
          <Text
            style={[
              styles.statusTextStyle,
              {
                color: statusColor,
              },
            ]}>
            {status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    marginVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  chiefTextStyle: {
    width: 85,
    fontSize: 14,
    color: colors.grayEventColor,
    fontFamily: fonts.RRegular,
  },
  refereeDataViewStyle: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  refereeImageStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  refereeNameTextStyle: {
    fontSize: 16,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
  },
  statusTextStyle: {
    fontSize: 12,
    color: colors.orangeColor,
    fontFamily: fonts.RBold,
  },
});

export default RefereeReservationItem;
