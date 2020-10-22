import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function TCSearchBox({ ...props }) {
  return (
    <View style={ styles.sectionStyle }>
      <Image source={ images.searchLocation } style={ styles.searchImg } />
      <TextInput
            style={ styles.textInput }
            placeholder={ strings.searchHereText }
            clearButtonMode="always"
            placeholderTextColor={ colors.userPostTimeColor }
            {...props}/>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: wp('80%'),

    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

  },
  searchImg: {
    alignSelf: 'center',
    height: 15,
    tintColor: colors.magnifyIconColor,
    resizeMode: 'contain',
    width: 15,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 17,
    paddingLeft: 10,
  },
});
