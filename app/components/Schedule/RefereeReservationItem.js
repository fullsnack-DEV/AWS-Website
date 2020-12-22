import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function RefereeReservationItem({
  data,
}) {
  console.log('Data :-', data);
  let refereeImage = null;
  let refereeName = '';
  let status = '';
  if (data && data.referee) {
    if (data.referee.thumbnail) {
      refereeImage = data.referee.thumbnail;
    }
    if (data.referee.full_name) {
      refereeName = data.referee.full_name;
    }
  }
  if (data.status === 'pendingpayment') {
    status = 'Awaiting Payment';
  }
  if (data.status === 'offered') {
    status = 'Request Sent';
  }
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.chiefTextStyle}>{'CHIEF REFEREE'}</Text>
      <View style={styles.refereeDataViewStyle}>
        <Image
            source={refereeImage ? { uri: refereeImage } : images.profilePlaceHolder}
            style={styles.refereeImageStyle}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.refereeNameTextStyle}>{refereeName}</Text>
          <Text style={styles.statusTextStyle}>{status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    marginVertical: 15,
    paddingHorizontal: 20,
    width: wp('100%'),
    alignItems: 'center',
  },
  chiefTextStyle: {
    width: wp('20%'),
    fontSize: 14,
    color: colors.grayEventColor,
    fontFamily: fonts.RRegular,
  },
  refereeDataViewStyle: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    width: wp('80%'),
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
