import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';

const AuthScreenHeader = ({
  onNextPress = () => {},
  title = '',
  onBackPress = () => {},
  showNext = true,
}) => (
  <View
    style={{
      marginHorizontal: 15,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 8,
    }}>
    <View
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          onBackPress();
        }}>
        <Image
          source={images.arrowSignUpBack}
          style={{
            tintColor: colors.whiteColor,
            height: 25,
            width: 25,
            marginTop: 9,
          }}
        />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <Text
          allowFontScaling
          style={{
            marginLeft: 5,

            fontSize: 23,
            fontFamily: fonts.RBold,
            color: colors.whiteColor,
            lineHeight: 38,
          }}>
          {title}
        </Text>
      </View>
    </View>
    {showNext && (
      <TouchableOpacity style={{marginLeft: 5}} onPress={() => onNextPress()}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 20,
            fontFamily: fonts.RMedium,
            color: colors.whiteColor,
            marginTop: 10,
          }}>
          {strings.next}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default AuthScreenHeader;
