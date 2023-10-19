// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';
import {strings} from '../../../../../Localization/translation';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import {ShimmerView} from '../../../../components/shimmer/commonComponents/ShimmerCommonComponents';

const InfoSection = ({
  description = '',
  onMore = () => {},
  containerStyle = {},
  loading = false,
}) => (
  <View style={containerStyle}>
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      <View>
        <Text style={styles.title}>{strings.infoTitle}</Text>
      </View>
      <TouchableOpacity style={styles.nextIcon} onPress={onMore}>
        <Image
          source={images.rightArrow}
          style={[styles.image, {borderRadius: 0}]}
        />
      </TouchableOpacity>
    </View>
    {loading ? (
      <View style={{marginTop: 10}}>
        <ShimmerView
          style={{width: '100%', marginVertical: 0, marginBottom: 4}}
        />
        <ShimmerView
          style={{width: '100%', marginVertical: 0, marginBottom: 4}}
        />
        <ShimmerView
          style={{width: '100%', marginVertical: 0, marginBottom: 4}}
        />
      </View>
    ) : (
      <ReadMore
        style={styles.description}
        numberOfLines={3}
        seeMoreText={strings.moreText}
        seeLessText={strings.lessText}
        seeLessStyle={styles.moreText}
        seeMoreStyle={styles.moreText}
        onSeeMoreBlocked={onMore}>
        {description}
      </ReadMore>
    )}
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    marginTop: 10,
    fontFamily: fonts.RRegular,
  },
  moreText: {
    fontSize: 12,
    // lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  nextIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 4,
    backgroundColor: colors.grayBackgroundColor,
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 23,
  },
});
export default InfoSection;
