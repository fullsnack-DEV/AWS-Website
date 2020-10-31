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
import { getStatusBarHeight } from 'react-native-status-bar-height';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import MultipleVideoWithLoader from './MultipleVideoWithLoader';

export default function SingleVideoModal({ backBtnPress, data }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.blackColor }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.searchViewStyle}>
          <MultipleVideoWithLoader
              data={data}
          />
        </View>
        <View style={ styles.containerStyle }>
          <TouchableOpacity onPress={backBtnPress}>
            <Image source={ images.cancelImage } style={ styles.backImage } />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: hp('1%'),
    width: wp('94%'),
    position: 'absolute',
    marginTop: getStatusBarHeight() + 10,
  },
  backImage: {
    height: hp('2%'),
    tintColor: colors.whiteColor,
    width: hp('2%'),
    marginRight: wp('3%'),
  },
  searchViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
