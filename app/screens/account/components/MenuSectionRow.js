// @flow
import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import AccountMenuRow from '../connections/AccountMenuRow';

const MenuSectionRow = ({
  item = {},
  isSectionOpen = false,
  isAccountDeactivated = false,
  isLastItem = false,
  onPress = () => {},
  onPressSetting = () => {},
  onPressSport = () => {},
  onPressCancelRequest = () => {},
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <View
      style={
        isAccountDeactivated && item.key !== strings.settingsTitleText
          ? {opacity: 0.3}
          : {}
      }
      pointerEvents={
        isAccountDeactivated && item.key !== strings.settingsTitleText
          ? 'none'
          : 'auto'
      }>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.row,
          {justifyContent: 'space-between', paddingHorizontal: 15},
          isSectionOpen || isLastItem ? {} : {marginBottom: 15},
          {
            backgroundColor: isPressed
              ? colors.buttonClickBgEffect
              : 'transparent',
          },
        ]}
        onPress={() => {
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Image source={item.icon} style={styles.icon} />
          </View>
          <View>
            <Text textBreakStrategy="simple" style={styles.label}>
              {item.key}
            </Text>
          </View>
        </View>
        <View style={styles.arrowIcon}>
          {
            item.member?.length > 0 ? (
              <Image
                source={images.nextArrow}
                style={[
                  styles.icon,
                  {
                    // tintColor: colors.veryLightBlack,
                    transform: [{rotateZ: isSectionOpen ? '270deg' : '90deg'}],
                  },
                ]}
              />
            ) : null
            // <Image source={images.nextArrow} style={styles.icon} />
          }
        </View>
      </TouchableOpacity>
      {isSectionOpen && item.member?.length > 0
        ? item.member.map((rowItem, index) => (
            <AccountMenuRow
              key={index}
              item={rowItem}
              isAccountDeactivated={isAccountDeactivated}
              onPressSetting={() => {
                onPressSetting(rowItem);
              }}
              onPressCancelRequest={() => onPressCancelRequest(rowItem)}
              onPressSport={() => {
                onPressSport(rowItem);
              }}
            />
          ))
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MenuSectionRow;
