/* eslint-disable no-nested-ternary */
import React, {memo} from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';

const AccountMenuRow = ({
  item,
  isAccountDeactivated,
  onPressSetting,
  onPressSport,
  onPressCancelRequest,
}) => (
  <View>
    {!isAccountDeactivated && (
      <View style={styles.listContainer}>
        <Pressable style={styles.listContainer} onPress={onPressSport}>
          <View
            style={
              item.icon && typeof item.icon === 'string'
                ? {...styles.subMenuContainer}
                : {...styles.subMenuPlaceHolderContainer}
            }>
            <Image
              source={
                item.icon && typeof item.icon === 'string'
                  ? {uri: item.icon}
                  : item.icon
              }
              style={
                item.icon && typeof item.icon === 'string'
                  ? {...styles.subMenuItem}
                  : {...styles.subMenuItemPlaceHolder}
              }
            />
          </View>
          <Text style={styles.listItems}>
            {item.option.group_name ?? item.option}
          </Text>
        </Pressable>
        <Pressable onPress={onPressSetting}>
          <Image source={item?.iconRight} style={styles.nextArrow} />
        </Pressable>
      </View>
    )}
    {item?.option?.request_id && (
      <TouchableWithoutFeedback onPress={onPressCancelRequest}>
        <View style={styles.buttonView}>
          <Text style={styles.textStyle}>
            {strings.teamCreationRequestSend}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )}
  </View>
);

const styles = StyleSheet.create({
  subMenuContainer: {
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginLeft: 45,
    width: 40,
    borderRadius: 20,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  subMenuPlaceHolderContainer: {
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginLeft: 45,
    width: 40,
    borderRadius: 20,
  },
  subMenuItem: {
    alignSelf: 'center',
    height: 35,
    resizeMode: 'contain',
    width: 35,
    borderRadius: 20,
    top: 1,
  },
  subMenuItemPlaceHolder: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
    borderRadius: 20,
  },
  buttonView: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 25,
    width: 250,
    marginBottom: 5,
    marginLeft: 80,
    backgroundColor: colors.whiteColor,

    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItems: {
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  nextArrow: {
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    height: 15,
    width: 15,
    marginRight: 15,
    resizeMode: 'contain',
  },
});
export default memo(AccountMenuRow);
