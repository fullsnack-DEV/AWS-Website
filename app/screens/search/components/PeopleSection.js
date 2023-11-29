// @flow
import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import SectionHeader from './SectionHeader';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const PeopleSection = ({
  list = [],
  onPress = () => {},
  onPressSection = () => {},
}) => (
  <View style={styles.parent}>
    <SectionHeader title={strings.peopleTitleText} onNext={onPressSection} />

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
                entityType={item.entity_type ?? Verbs.entityTypePlayer}
              />

              <View>
                <Text style={styles.userName}>{item.full_name}</Text>
                <Text style={styles.city}>{item.city}</Text>
              </View>
            </Pressable>
            {index !== list.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    )}
  </View>
);

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
export default PeopleSection;
