import Modal from 'react-native-modal';
import React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../utils';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';

const CommonAlert = ({alertData}) => (
  <Modal
    animationIn={'fade'}
    animationOut={'fade'}
    animationType={'fade'}
    isVisible={alertData?.visible}
    backdropColor="black"
    style={{margin: 0}}
    backdropOpacity={0}>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: wp(100),
        height: hp(100),
      }}>
      <View
        style={{
          width: 145,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          height: 90,
          backgroundColor: colors.lightWhite,
        }}>
        <FastImage
          style={{height: 25, width: 25}}
          source={alertData?.iconImage ?? images.linkCopied}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.darkYellowColor,
            marginTop: 5,
          }}>
          {alertData?.message ?? strings.linkedCopied}
        </Text>
      </View>
    </View>
  </Modal>
);

export default CommonAlert;
