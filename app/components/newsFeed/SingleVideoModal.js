import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import MultipleVideoWithLoader from './MultipleVideoWithLoader';

export default function SingleImageModal({ backBtnPress, data }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.blackColor }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <SafeAreaView>
        <View style={ styles.containerStyle }>
          <View style={ styles.backIconViewStyle } />
          <View style={ styles.writePostViewStyle } />
          <View style={ styles.doneViewStyle }>
            <TouchableOpacity onPress={backBtnPress}>
              <Image source={ images.cancelImage } style={ styles.backImage } />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.searchViewStyle}>
        <MultipleVideoWithLoader
            data={data}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    width: wp('92%'),
  },
  backIconViewStyle: {
    justifyContent: 'center',
    width: wp('17%'),
  },
  backImage: {
    height: hp('2%'),
    tintColor: colors.whiteColor,
    width: hp('2%'),
    marginRight: wp('3%'),
  },
  doneViewStyle: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: wp('17%'),
    paddingVertical: hp('0.5%'),
  },
  writePostViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('58%'),
  },
  searchViewStyle: {
    flex: 1,
    backgroundColor: colors.blackColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
