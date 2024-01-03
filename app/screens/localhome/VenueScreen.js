import {View, Text, SafeAreaView, Image} from 'react-native';
import React from 'react';
import ScreenHeader from '../../components/ScreenHeader';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';

export default function VenueScreen({navigation}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.venue}
        leftIconPress={() => navigation.goBack()}
        leftIcon={images.backArrow}
      />
      <View
        style={{
          flex: 1,

          alignItems: 'center',
          marginTop: 129,
        }}>
        <View
          style={{
            marginHorizontal: 75,
          }}>
          <Text
            style={{
              lineHeight: 30,
              textAlign: 'center',
              fontSize: 20,
              fontFamily: fonts.RBold,
              color: colors.googleColor,
            }}>
            {strings.venueText1}
          </Text>
          <Text
            style={{
              lineHeight: 24,
              fontFamily: fonts.RMedium,
              fontSize: 16,
              textAlign: 'center',
              color: colors.googleColor,
              marginTop: 5,
            }}>
            {strings.venueText2}
          </Text>
          <Image
            source={images.localHomeVenue}
            style={{
              width: 207,
              height: 225,
              resizeMode: 'cover',
              alignSelf: 'center',
              marginTop: 35,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
