import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import Header from '../../components/Home/Header';
import {strings} from '../../../Localization/translation';

function EditEventModal({
  isModalVisible,
  onBackdropPress,
  cancelImageSource,
  onCancelImagePress,
  headerCenterText,
  onDonePress,
  children,
}) {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={'height'}>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{margin: 0, justifyContent: 'flex-end'}}
        hasBackdrop
        onBackdropPress={onBackdropPress}
        backdropOpacity={0}>
        <View style={styles.containerStyle}>
          <Header
            mainContainerStyle={styles.headerMainContainerStyle}
            leftComponent={
              <TouchableOpacity onPress={onCancelImagePress}>
                <Image
                  source={cancelImageSource}
                  style={styles.cancelImageStyle}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.headerCenterStyle}>{headerCenterText}</Text>
            }
            rightComponent={
              <TouchableOpacity style={{padding: 2}} onPress={onDonePress}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.RRegular,
                    color: colors.lightBlackColor,
                  }}>
                  {strings.done}
                </Text>
              </TouchableOpacity>
            }
          />
          <View style={styles.sepratorStyle} />
          <ScrollView bounces={false}>{children}</ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: hp('75%'),
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
  },
  cancelImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.lightBlackColor,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
  sepratorStyle: {
    height: 1,
    width: wp('100%'),
    backgroundColor: colors.writePostSepratorColor,
  },
});

export default EditEventModal;
