// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import GroupIcon from '../../../components/GroupIcon';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const SelectedInviteeCard = ({
  item = {},
  onCancel = () => {},
  containerStyle = {},
}) => (
  <View style={[styles.parent, containerStyle]}>
    <TouchableOpacity style={styles.closeIcon} onPress={onCancel}>
      <Image source={images.closeRound} style={styles.image} />
    </TouchableOpacity>

    <GroupIcon
      containerStyle={styles.profileContainer}
      imageUrl={item.image}
      entityType={item.entityType}
      groupName={item.name}
      textstyle={{fontSize: 12}}
    />
    <Text style={styles.nameText} numberOfLines={2}>
      {item.name}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
    marginBottom: 7,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  nameText: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    textAlign: 'center',
  },
  closeIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});
export default SelectedInviteeCard;
