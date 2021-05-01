import React from 'react';
import {
 StyleSheet, Text, View, Image,
 } from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

function SecureRefereeView({
    entityName,
    entity,
    entityNumber = 1,
  style,
}) {
  return (
    <View style={[styles.teamContainer, style]}>
      <Text style={styles.venueTitle}>{entity}{entityNumber} {entityNumber === 1 ? '(chief)' : ''}</Text>
      <View style={styles.teamViewStyle}>
        <Image source={images.teamPlaceholder} style={styles.imageView} />
        <View style={styles.teamTextContainer}>
          <Text style={styles.teamNameLable}>{entityName} <Text style={styles.refereeExtraText}>will secure {entity}{entityNumber} at its own expense.</Text></Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    teamContainer: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
      },
      teamNameLable: {
        fontFamily: fonts.RMedium,
        fontSize: 16,
        color: colors.lightBlackColor,
        marginLeft: 5,
      },
      refereeExtraText: {
        fontFamily: fonts.RRegular,
        fontSize: 16,
        color: colors.lightBlackColor,
      },
      teamViewStyle: {
        flex: 0.86,
        flexDirection: 'row',
        alignItems: 'center',
      },

      imageView: {
        height: 40,
        width: 40,
        resizeMode: 'cover',
        borderRadius: 20,
        shadowColor: colors.googleColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
      },
      venueTitle: {
        fontFamily: fonts.RMedium,
        fontSize: 16,
        color: colors.lightBlackColor,
        marginBottom: 5,
      },
});

export default SecureRefereeView;
