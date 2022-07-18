import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import colors from '../Constants/Colors';
import images from '../Constants/ImagePath';
import TCGroupNameBadge from './TCGroupNameBadge';

export default function TCNavigationHeader({name, groupType, image}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
      }}
    >
      <View style={styles.profileView}>
        <Image
          source={image ? {uri: image} : images.teamPlaceholder}
          style={styles.profileImage}
        />
      </View>
      <TCGroupNameBadge name={name} groupType={groupType} />
    </View>
  );
}

const styles = StyleSheet.create({
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 22,
    width: 22,
    borderRadius: 54,
    marginRight: 5,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    alignSelf: 'center',
    height: 20,
    resizeMode: 'cover',
    width: 20,
    borderRadius: 50,
  },
});
