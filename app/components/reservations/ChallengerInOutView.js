import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

export default function ChallengerInOutView({
  requestType = 'in',
  entityName = 'Vancouver Whitecaps FC',
}) {
  return (

    <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 20 }}>
      <Image source={images.requestOut} style={styles.inOutImageView} />
      <View style={styles.entityView}>
        <Image source={images.teamPlaceholder} style={styles.profileImage} />

        <Text style={styles.entityName}>
          {entityName}
          <Text style={[styles.requesterText, { color: colors.greeColor }]}>
            {' '}
            {requestType === 'in' ? '(challenger)' : '(challengee)'}{' '}
          </Text>
        </Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  entityView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
  },
  inOutImageView: {
    alignSelf: 'center',
    height: 30,
    resizeMode: 'cover',
    width: 30,
  },

  profileImage: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 5,
  },
  requesterText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,

  },
});
