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
import Carousel from 'react-native-snap-carousel';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import MultipleImageWithLoader from './MultipleImageWithLoader';
import MultipleVideoWithLoader from './MultipleVideoWithLoader';

export default function MultipleImageModal({ backBtnPress, attachedImages }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.blackColor }}
      behavior={ Platform.OS === 'ios' ? 'padding' : null }>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.searchViewStyle}>
          <Carousel
            data={attachedImages}
            renderItem={({ item: multiAttachItem }) => {
              if (multiAttachItem.type === 'image') {
                return (
                  <MultipleImageWithLoader
                    data={multiAttachItem}
                  />
                );
              }
              if (multiAttachItem.type === 'video') {
                return (
                  <MultipleVideoWithLoader
                    data={multiAttachItem}
                  />
                );
              }
              return <View />;
            }}
            contentContainerCustomStyle={{ alignSelf: 'center' }}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={wp(100)}
            itemWidth={wp(100)}
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
  },
});
