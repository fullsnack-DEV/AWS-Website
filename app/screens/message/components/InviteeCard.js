// @flow
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import GroupIcon from '../../../components/GroupIcon';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const InviteeCard = ({item = {}, isChecked = false, onPress = () => {}}) => (
  <>
    <TouchableOpacity style={styles.parent} onPress={onPress}>
      <View style={styles.userDetails}>
        <GroupIcon
          imageUrl={item.image}
          entityType={item.entityType}
          groupName={item.name}
          containerStyle={styles.profileIcon}
          textstyle={{fontSize: 12}}
        />
        <View style={{flex: 1}}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cityText}>{item.city}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Image
          source={
            isChecked ? images.yellowCheckBox : images.messageCheckboxBorder
          }
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  userDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    height: 40,
    width: 40,
    borderWidth: 1,
    marginRight: 15,
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  nameText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cityText: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
  },
});
export default InviteeCard;
