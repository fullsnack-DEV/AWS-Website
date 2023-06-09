import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import GroupIcon from '../GroupIcon';

const TagItemView = ({
  source = '',
  entityName = '',
  userLocation = '',
  onSelect = () => {},
  onClickProfile = () => {},
  entityType = Verbs.entityTypePlayer,
  selectedList = [],
  entityId = '',
  sportName = '',
}) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (selectedList.length > 0) {
      const obj = selectedList.find(
        (item) => item.user_id === entityId || item.group_id === entityId,
      );

      if (obj) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    }
  }, [selectedList, entityId]);

  return (
    <View style={styles.mainContainerStyle}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={onClickProfile}>
        <GroupIcon
          imageUrl={source}
          groupName={entityName}
          entityType={entityType}
          containerStyle={styles.imageStyle}
          textstyle={{fontSize: 12}}
        />
        <View style={styles.textViewStyle}>
          <Text style={styles.userNameTextStyle}>{entityName}</Text>
          {entityType === Verbs.entityTypePlayer ||
          entityType === Verbs.entityTypeUser ? (
            <Text style={styles.userLocationTextStyle}>{userLocation}</Text>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.userLocationTextStyle}>{userLocation}</Text>
              <View
                style={{
                  width: StyleSheet.hairlineWidth,
                  height: 12,
                  marginHorizontal: 10,
                  backgroundColor: colors.placeHolderColor,
                }}
              />
              <Text style={styles.userLocationTextStyle}>{sportName}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imageCheckBoxStyle} onPress={onSelect}>
        <Image
          source={isSelected ? images.checkWhiteLanguage : images.uncheckWhite}
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainerStyle: {
    paddingHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
  textViewStyle: {
    marginLeft: 12,
  },
  userNameTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  userLocationTextStyle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  imageCheckBoxStyle: {
    height: 22,
    width: 22,
  },
});

export default TagItemView;
