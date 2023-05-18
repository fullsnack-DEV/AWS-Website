// @flow
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Pressable, Text} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

const MemberList = ({
  list = [],
  isAdmin = false,
  onPressMember = () => {},
  onPressMore = () => {},
  containerStyle = {},
}) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (list.length > 0) {
      const newList = [...list];
      const slicedList =
        newList.length > 9 ? newList.splice(0, 9) : [...newList];
      setMembers(slicedList);
    }
  }, [list]);

  if (list?.length > 0) {
    return (
      <View
        style={[
          styles.parent,
          list.length < 9 ? {} : {justifyContent: 'space-between'},
          containerStyle,
        ]}>
        {members.map((item, index) => (
          <Pressable
            style={[
              styles.memberIcon,
              list.length < 9 ? {marginRight: 10} : {},
            ]}
            onPress={() => onPressMember(item)}
            key={index}>
            <Image
              source={
                item.thumbnail
                  ? {uri: item.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.image}
            />
            {list.length > 9 && index === members.length - 1 && (
              <Pressable style={styles.maskView} onPress={onPressMore}>
                <Text style={styles.moreDots}>···</Text>
              </Pressable>
            )}
          </Pressable>
        ))}
        {isAdmin && list.length < 9 && (
          <View style={styles.addIcon}>
            <Image source={images.plus} style={styles.image} />
          </View>
        )}
      </View>
    );
  }
  return <View style={{marginBottom: 25}} />;
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.whiteColor,
    padding: 1,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.16,
    // marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  addIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.textFieldBackground,
    padding: 10,
  },
  maskView: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.modalBackgroundColor,
    position: 'absolute',
  },
  moreDots: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
});
export default MemberList;
