import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {displayLocation} from '../../../utils';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import images from '../../../Constants/ImagePath';

const TCRemoveUser = ({
  item = {},
  isOwner = false,
  onRemovePress = () => {},
  onProfilePress = () => {},
}) => (
  <View style={{paddingHorizontal: 15}}>
    <View style={[styles.row, {justifyContent: 'space-between'}]}>
      <TouchableOpacity style={styles.row} onPress={onProfilePress}>
        <GroupIcon
          imageUrl={item.full_image ?? item.thumbnail}
          entityType={item.entity_type}
          showPlaceholder={false}
          containerStyle={styles.profileImage}
        />
        {isOwner && (
          <Image
            source={images.starProfile}
            style={{
              width: 15,
              height: 15,
              position: 'absolute',
              left: 22,
              bottom: 0,
            }}
          />
        )}

        <View>
          <Text style={styles.entityName}>
            {item.full_name ?? item.group_name}
          </Text>
          <Text style={styles.location}>{displayLocation(item)}</Text>
        </View>
      </TouchableOpacity>
      <>
        {!isOwner && (
          <TouchableOpacity
            onPress={onRemovePress}
            style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{strings.remove}</Text>
          </TouchableOpacity>
        )}
      </>
    </View>
    <View style={styles.seperateContainer} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entityName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  location: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  seperateContainer: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 15,
  },
  buttonContainer: {
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: colors.textFieldBackground,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
  },
});
export default TCRemoveUser;
