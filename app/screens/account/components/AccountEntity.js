// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {displayLocation} from '../../../utils';

const AccountEntity = ({
  entity = {},
  onPress = () => {},
  onSwitchAccount = () => {},
}) => {
  const [isBgImage, setIsBgImage] = useState(false);

  useEffect(() => {
    if (entity.group_id && entity.background_full_image) {
      setIsBgImage(true);
    } else {
      setIsBgImage(false);
    }
  }, [entity]);

  const renderView = () => (
    <View
      style={
        isBgImage
          ? [styles.innerView, {backgroundColor: colors.maskViewColor}]
          : [styles.parent, styles.innerView]
      }>
      <TouchableOpacity
        style={[styles.row, {marginBottom: 3}]}
        onPress={onPress}>
        <GroupIcon
          entityType={entity.entity_type}
          imageUrl={entity.thumbnail}
          groupName={entity.group_name}
          containerStyle={styles.iconContainer}
        />
        <View style={{flex: 1}}>
          <View style={[styles.row, {paddingRight: 15}]}>
            <Text
              style={[
                styles.entityName,
                isBgImage ? {color: colors.whiteColor} : {},
              ]}
              numberOfLines={1}>
              {entity.full_name || entity.group_name}
            </Text>
            <View style={styles.arrowIcon}>
              <Image
                source={images.nextArrow}
                style={[
                  styles.image,
                  isBgImage ? {tintColor: colors.whiteColor} : {},
                ]}
              />
            </View>
          </View>
          <Text
            style={[
              styles.location,
              isBgImage ? {color: colors.whiteColor} : {},
            ]}>
            {displayLocation(entity)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.row, {alignSelf: 'flex-end'}]}
        onPress={onSwitchAccount}>
        <View style={styles.switchIcon}>
          <Image
            source={images.switchAccount}
            style={[
              styles.image,
              isBgImage ? {tintColor: colors.whiteColor} : {},
            ]}
          />
        </View>
        <Text
          style={[
            styles.location,
            {fontFamily: fonts.RBold, lineHeight: 18},
            isBgImage ? {color: colors.whiteColor} : {},
          ]}>
          {strings.switchAccount.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return isBgImage ? (
    <ImageBackground
      style={styles.parent}
      source={{
        uri:
          entity.entity_type === Verbs.entityTypePlayer ||
          entity.entity_type === Verbs.entityTypeUser
            ? entity.full_image
            : entity.background_full_image,
      }}
      imageStyle={{resizeMode: 'stretch'}}>
      {renderView()}
    </ImageBackground>
  ) : (
    renderView()
  );
};

const styles = StyleSheet.create({
  parent: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.blocklightgraycolor,
    backgroundColor: colors.lightGrayBackground,
  },
  innerView: {
    paddingLeft: 20,
    paddingTop: 23,
    paddingRight: 10,
    paddingBottom: 5,
  },
  entityName: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  location: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  iconContainer: {
    marginRight: 20,
    width: 55,
    height: 55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  switchIcon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    marginRight: 5,
  },
});
export default AccountEntity;
