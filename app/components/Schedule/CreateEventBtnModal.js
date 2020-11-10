import React from 'react';
import {
  Image, TouchableOpacity, Modal, StyleSheet, View, Text,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function CreateEventBtnModal({
  visible = false,
  onCancelPress,
  onChallengePress,
  onCreateEventPress,
}) {
  if (!visible) return null;
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType={'slide'}
    >
      <View style={styles.containerStyle}>
        <View style={styles.indicatorViewStyle}>
          <View style={styles.eventViewStyle}>
            <Text style={styles.textStyle}>Set challenge availability</Text>
            <TouchableOpacity style={styles.createEventBtnStyle} onPress={onChallengePress}>
              <Image source={images.createEventImage} style={styles.imageStyle} resizeMode={'contain'} />
            </TouchableOpacity>
          </View>
          <View style={[styles.eventViewStyle, { marginVertical: 10 }]}>
            <Text style={styles.textStyle}>Create an event</Text>
            <TouchableOpacity style={styles.createEventBtnStyle} onPress={onCreateEventPress}>
              <Image source={images.createEventImage} style={styles.imageStyle} resizeMode={'contain'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cancelBtnStyle} onPress={onCancelPress}>
            <Image source={images.cancelImage} style={styles.cancelImageStyle} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.15)',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  indicatorViewStyle: {
    borderRadius: wp(3),
    right: 22,
    bottom: hp('12%'),
  },
  cancelBtnStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    shadowOpacity: 0.6,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    elevation: 10,
    shadowColor: colors.googleColor,
  },
  createEventBtnStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.orangeColor,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    shadowOpacity: 0.6,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    borderColor: colors.whiteColor,
    borderWidth: 2.5,
    elevation: 10,
    shadowColor: colors.googleColor,
  },
  cancelImageStyle: {
    height: 16,
    width: 16,
    tintColor: colors.orangeColor,
  },
  eventViewStyle: {
    flexDirection: 'row',
    paddingRight: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    marginRight: 10,
    color: colors.themeColor,
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
});

export default CreateEventBtnModal;
