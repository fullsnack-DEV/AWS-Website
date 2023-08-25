// @flow
import React, {useEffect, useState} from 'react';

import {
  Image,
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import images from '../../../Constants/ImagePath';

import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import GroupIcon from '../../GroupIcon';

const GroupList = ({
  list = [],
  onCheck = () => {},
  onAllPress = () => {},
  containerStyle = {},
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (list.length > 0) {
      const selectedList = list.filter((item) => item.isSelected);
      setIsAllSelected(selectedList.length === list.length);
    }
  }, [list]);

  return (
    <FlatList
      data={list}
      contentContainerStyle={containerStyle}
      ListHeaderComponent={() => (
        <View style={styles.listContainer}>
          <TouchableOpacity
            style={styles.checkBoxContainer}
            onPress={() => onAllPress(isAllSelected)}>
            <Image
              source={isAllSelected ? images.orangeCheckBox : images.uncheckBox}
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={{marginLeft: 16, flex: 1}}>
            <Text style={styles.listLabel} numberOfLines={1}>
              {strings.all}
            </Text>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({item, index}) => (
        <View
          style={[
            styles.listContainer,
            index === list.length - 1 ? {marginBottom: 0} : {},
          ]}>
          <TouchableOpacity
            style={styles.checkBoxContainer}
            onPress={() => onCheck(index)}>
            <Image
              source={
                item.isSelected ? images.orangeCheckBox : images.uncheckBox
              }
              style={styles.image}
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <GroupIcon
              imageUrl={item.thumbnail}
              groupName={item.group_name}
              entityType={item.entity_typ}
              containerStyle={styles.iconContainer}
              textstyle={{fontSize: 8}}
              placeHolderStyle={styles.iconPlaceholder}
            />
            <View style={{flex: 1}}>
              <Text style={styles.listLabel} numberOfLines={1}>
                {item.group_name}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  checkBoxContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  listLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  iconContainer: {
    width: 25,
    height: 25,
    borderWidth: 1,
    marginRight: 10,
    paddingTop: 2,
  },
  iconPlaceholder: {
    width: 10,
    height: 10,
    right: -3,
    bottom: -2,
  },
  container: {
    marginLeft: 16,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default GroupList;
