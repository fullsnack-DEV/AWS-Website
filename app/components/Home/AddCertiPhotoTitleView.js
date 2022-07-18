import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import EventTextInput from '../Schedule/EventTextInput';

function AddCertiPhotoTitleView({
  placeholder,
  multiline,
  onChangeText,
  value,
  onPickImagePress,
}) {
  return (
    <View style={styles.containerStyle}>
      <EventTextInput
        placeholder={placeholder}
        multiline={multiline}
        onChangeText={onChangeText}
        value={value}
        containerStyle={styles.textInputStyle}
      />
      <View style={styles.pickImageViewStyle}>
        <TouchableOpacity onPress={onPickImagePress}>
          <Image
            source={images.certiImagePick}
            style={styles.pickIconStyle}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    marginTop: 20,
  },
  textInputStyle: {
    alignSelf: 'flex-start',
    width: wp('78%'),
    marginTop: 0,
  },
  pickImageViewStyle: {
    width: wp('14%'),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pickIconStyle: {
    width: 44,
    height: 44,
  },
});

export default AddCertiPhotoTitleView;
