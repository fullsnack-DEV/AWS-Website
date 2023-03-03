import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// import images from '../Constants/ImagePath';
import {strings} from '../../Localization/translation';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCSearchBox({
  testID,
  onChangeText,
  style,
  value,
  placeholderText = strings.searchHereText,
  editable = true,
  textInputRef,
  onPressClear,
  ...props
}) {
  console.log(value, 'Frommmm');

  return (
    <View style={{...styles.sectionStyle, ...style}} {...props}>
      {/* <Image source={images.searchLocation} style={styles.searchImg} /> */}
      <TextInput
        testID={testID}
        ref={textInputRef}
        editable={editable}
        autoCapitalize={'none'}
        autoCompleteType={'off'}
        textContentType={'none'}
        autoCorrect={false}
        value={value}
        style={styles.textInput}
        placeholder={placeholderText}
        clearButtonMode="always"
        placeholderTextColor={colors.userPostTimeColor}
        onChangeText={onChangeText}
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={onPressClear} style={styles.clearContainer}>
          <Image source={images.closeRound} style={styles.clearImg} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 25,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 17,
    paddingRight: 5,
    width: wp('90%'),
  },
  //   searchImg: {
  //     alignSelf: 'center',
  //     height: 15,
  //     tintColor: colors.magnifyIconColor,
  //     resizeMode: 'contain',
  //     width: 15,
  //   },
  clearImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    marginRight: 12,
    alignSelf: 'center',
  },
  clearContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
});
