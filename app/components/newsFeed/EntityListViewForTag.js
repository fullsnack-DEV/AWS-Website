// @flow
import React from 'react';
import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../Constants/Colors';
import GroupIcon from '../GroupIcon';
import {displayLocation} from '../../utils';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';

const EntityListViewForTag = ({entityList = [], onSelect = () => {}}) =>
  entityList.length > 0 ? (
    <View style={styles.parent}>
      <FlatList
        data={entityList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Pressable
            style={styles.listItem}
            onPress={() => {
              onSelect(item);
            }}>
            <GroupIcon
              imageUrl={item.thumbnail}
              containerStyle={styles.profileContainer}
              showPlaceholder={false}
              groupName={item.group_name}
              entityType={item.entity_type}
              textstyle={{fontSize: 8, marginTop: 0}}
            />

            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{maxWidth: '80%'}}>
                <Text style={styles.userTextStyle} numberOfLines={1}>
                  {item?.group_name
                    ? item?.group_name
                    : `${item.first_name} ${item.last_name}`}{' '}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text numberOfLines={1} style={styles.locationTextStyle}>
                  {displayLocation(item)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  ) : (
    <View
      style={[styles.parent, {alignItems: 'center', justifyContent: 'center'}]}>
      <Text style={styles.noDataText}>{strings.noRecordFoundText}</Text>
    </View>
  );

const styles = StyleSheet.create({
  parent: {
    position: 'absolute',
    bottom: 67,
    zIndex: 1,
    width: Dimensions.get('window').width - 30,
    maxHeight: 350,
    backgroundColor: colors.lightGrayBackground,
    padding: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignSelf: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileContainer: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  userTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 10,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationTextStyle: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    marginTop: 4,
    marginLeft: 5,
  },
  noDataText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
  },
});
export default EntityListViewForTag;
