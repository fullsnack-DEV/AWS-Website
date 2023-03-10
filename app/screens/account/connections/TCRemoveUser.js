import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {heightPercentageToDP as hp} from '../../../utils';
import TCGroupNameBadge from '../../../components/TCGroupNameBadge';
import {strings} from '../../../../Localization/translation';

const TCRemoveUser = ({
  title,
  subTitle,
  profileImage,
  onRemovePress,
  entityType,
  onProfilePress = () => {},
}) => (
  <View>
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 15,
      }}>
      <TouchableOpacity
        onPress={onProfilePress}
        style={{flex: 0.18, alignItems: 'flex-start'}}>
        <FastImage
          resizeMode={'cover'}
          source={
            profileImage ? {uri: profileImage} : images.profilePlaceHolder
          }
          style={{width: 45, height: 45, borderRadius: 25}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onProfilePress}
        style={{flex: 0.65, paddingVertical: 10, justifyContent: 'center'}}>
        <TCGroupNameBadge name={title} groupType={entityType} />
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.RRegular,
            color: colors.userPostTimeColor,
          }}>
          {subTitle}
        </Text>
      </TouchableOpacity>
      <View style={{flex: 0.35, alignItems: 'center'}}>
        <View style={{backgroundColor: colors.lightGrey, padding: 5, borderRadius: 5}}>
          <TouchableOpacity onPress={onRemovePress}>
            <Text style={{color: colors.darkThemeColor}}>
            {strings.remove}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={styles.seperateContainer} />
  </View>
);

const styles = StyleSheet.create({
  seperateContainer: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: colors.grayBackgroundColor,
    marginVertical: hp(0.7),
  },
});
export default TCRemoveUser;
