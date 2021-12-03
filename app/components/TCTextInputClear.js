import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCTextInputClear = ({
  multiline = false,
  onChangeText,
  placeholder,
  value,
  onPressClear,
}) => (
  <>
    {multiline ? (
      <View style={styles.detailsContainer}>
        <TextInput
          style={styles.detailsText}
          placeholder={placeholder}
          multiline={multiline}
          autoCorrect={false}
          autoCapitalize={false}
          numberOfLines={4}
          textAlignVertical={'top'}
          onChangeText={onChangeText}
          value={value}
        />
        {value?.length > 0 && <TouchableOpacity onPress={onPressClear}>
          <Image
            source={images.cancelWhite}
            style={{
              height: 10,
              width: 10,
              resizeMode: 'contain',
              tintColor: colors.lightBlackColor,
              alignSelf: 'baseline',
            }}
          />
        </TouchableOpacity>}
      </View>
    ) : (
      <View style={styles.detailsSingleContainer}>
        <TextInput
          style={styles.detailsSingleText}
          placeholder={placeholder}
          autoCorrect={false}
          autoCapitalize={false}
          onChangeText={onChangeText}
          value={value}
        />
        {value?.length > 0 && <TouchableOpacity onPress={onPressClear}>
          <Image
            source={images.cancelWhite}
            style={{
              height: 10,
              width: 10,
              resizeMode: 'contain',
              tintColor: colors.lightBlackColor,

            }}
          />
        </TouchableOpacity>}
      </View>
    )}
  </>
);
const styles = StyleSheet.create({
  detailsContainer: {
    height: 120,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '92%',
    alignSelf: 'center',
    // alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsSingleContainer: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 15,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsText: {
    flex: 1,
    height: 90,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignSelf: 'center',
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    marginVertical: 15,
  },
  detailsSingleText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    height: 40,
    fontFamily: fonts.RRegular,
    width: '92%',
  },
});

export default TCTextInputClear;
