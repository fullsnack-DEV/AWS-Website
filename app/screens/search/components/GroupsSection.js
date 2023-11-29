// @flow
import React, {useContext} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {format} from 'react-string-format';
import SectionHeader from './SectionHeader';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getGroupSportName} from '../../../utils/sportsActivityUtils';
import AuthContext from '../../../auth/context';

const GroupsSection = ({
  list = [],
  onPress = () => {},
  onPressSection = () => {},
}) => {
  const authContext = useContext(AuthContext);
  return (
    <View style={styles.parent}>
      <SectionHeader title={strings.groupsTitleText} onNext={onPressSection} />

      {list.length > 0 && (
        <View style={{marginTop: 20}}>
          {list.map((item, index) => (
            <View key={index}>
              <Pressable
                style={styles.card}
                onPress={() => {
                  onPress(item);
                }}>
                <GroupIcon
                  containerStyle={styles.iconContainer}
                  entityType={item.entity_type}
                  groupName={item.group_name}
                  placeHolderStyle={{bottom: -3, right: -2}}
                  textstyle={{fontSize: 14}}
                />

                <View>
                  <Text style={styles.userName}>{item.group_name}</Text>
                  <Text style={styles.city}>
                    {`${item.city} · ${getGroupSportName(
                      item,
                      authContext.sports,
                      1,
                    )}`}
                  </Text>
                  <Text style={styles.city}>
                    {`${format(strings.levelCount, item.point)} · ${
                      item.setting?.game_fee?.fee
                    } ${item.setting?.game_fee?.currency_type}`}
                  </Text>
                </View>
              </Pressable>
              {index !== list.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
    marginLeft: 50,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  city: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default GroupsSection;
