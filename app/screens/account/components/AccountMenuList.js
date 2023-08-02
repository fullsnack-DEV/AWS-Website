// @flow
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import MenuSectionRow from './MenuSectionRow';

const AccountMenuList = ({
  menuList = [],
  isAccountDeactivated = false,
  onPressSetting = () => {},
  onPressSport = () => {},
  onPressCancelRequest = () => {},
  onLogout = () => {},
}) => {
  const [expandedSections, setExpandedSections] = useState([]);

  const handleLogOut = () => {
    Alert.alert(
      strings.appName,
      strings.logoutText,
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: strings.okTitleText,
          onPress: onLogout,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.parent}>
      <FlatList
        data={menuList}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => {
          const isExpanded = expandedSections.includes(item.key);

          return (
            <MenuSectionRow
              item={item}
              isSectionOpen={isExpanded}
              onPress={() => {
                if (item.member?.length > 0) {
                  let list = [];
                  if (expandedSections.includes(item.key)) {
                    list = expandedSections.filter((ele) => ele !== item.key);
                  } else {
                    list = [...expandedSections, item.key];
                  }
                  setExpandedSections(list);
                } else if (
                  item.key === strings.transactions ||
                  item.key === strings.leagues
                ) {
                  // return;
                } else {
                  onPressSport(item);
                }
              }}
              isAccountDeactivated={isAccountDeactivated}
              onPressSetting={onPressSetting}
              onPressSport={onPressSport}
              onPressCancelRequest={onPressCancelRequest}
            />
          );
        }}
        ListFooterComponent={() => (
          <>
            <View style={styles.dividor} />
            <Pressable style={styles.row} onPress={handleLogOut}>
              <View style={styles.iconContainer}>
                <Image source={images.logoutIcon} style={styles.icon} />
              </View>
              <View>
                <Text style={styles.label}>{strings.logOut}</Text>
              </View>
            </Pressable>
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 15,
    flex: 1,
  },
  dividor: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
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
    resizeMode: 'cover',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
});
export default AccountMenuList;
