import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCImage from '../../TCImage';

export default function UserInfoMemberItem({
  title,
  imageData,
}) {
  return (
    <View style={{ width: 55, height: 'auto', marginLeft: 26 }}>
      <View style={styles.imageContainerStyle}>
        <TCImage
        containerStyle={styles.mainImageStyle}
        resizeMode={'cover'}
        imageStyle={styles.mainImageStyle}
        defaultSource={images.profilePlaceHolder}
        source={imageData}/>
      </View>
      <Text style={styles.titleStyle} numberOfLines={ 2 }>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainerStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
  mainImageStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
  },
  titleStyle: {
    marginTop: 5,
    color: colors.lightBlackColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
})
