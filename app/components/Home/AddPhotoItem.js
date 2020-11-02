import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function AddPhotoItem({
  onAddPhotoPress,
  disabled,
}) {
  return (
    <TouchableOpacity
        style={styles.headerImagePickerView}
        onPress={onAddPhotoPress}
        disabled={disabled}
    >
      <Image
        style={styles.plusImageStyle}
        source={images.plus}
      />
      <Text style={styles.addPhotoTextStyle}>Add</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerImagePickerView: {
    margin: 1.5,
    backgroundColor: colors.activeIndexColor,
    height: wp(32.3),
    width: wp(32.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoTextStyle: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  plusImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.whiteColor,
  },
});

export default AddPhotoItem;
