// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import GroupIcon from '../../../components/GroupIcon';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {TAB_ITEMS} from '../constants';

const ReactionsModal = ({
  isVisible = false,
  closeModal = () => {},
  reactionsList = [],
}) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [reactions, setReactions] = useState({});

  useEffect(() => {
    if (isVisible && reactionsList.length > 0) {
      const obj = {};

      reactionsList.forEach((reaction) => {
        const keys = Object.keys(obj);
        obj.all = {
          count: obj.all?.count ?? 0 + reaction.score,
          user: [
            ...(obj.all?.user ?? []),
            {...reaction.user, reaction_type: reaction.type},
          ],
        };
        if (keys.includes(obj[reaction.type])) {
          obj[reaction.type] = {
            count: obj[reaction.type].count + reaction.score,
            user: [...obj[reaction.type].user, reaction.user],
          };
        } else {
          obj[reaction.type] = {
            count: 1,
            user: [reaction.user],
          };
        }
      });
      setReactions(obj);
    }
  }, [isVisible, reactionsList]);

  const getEmoji = (type) => {
    const emoji = TAB_ITEMS.find((item) => item.type === type);
    return emoji.url;
  };

  return (
    <CustomModalWrapper
      modalType={ModalTypes.default}
      isVisible={isVisible}
      closeModal={closeModal}
      containerStyle={{padding: 0}}>
      <View style={styles.tabContanier}>
        {Object.keys(reactions).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabItem,
              selectedTab === item
                ? {borderBottomWidth: 3, borderBottomColor: colors.tabFontColor}
                : {},
            ]}
            onPress={() => setSelectedTab(item)}>
            {item === 'all' ? (
              <Text style={[styles.tabText, {marginRight: 5}]}>
                {strings.all}
              </Text>
            ) : (
              <Image source={getEmoji(item)} style={styles.emoji} />
            )}

            <Text style={[styles.tabText, {color: colors.lightBlackColor}]}>
              {reactions[item].count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab ? (
        <View style={{padding: 25}}>
          <FlatList
            data={reactions[selectedTab]?.user ?? []}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View
                style={[
                  styles.row,
                  {justifyContent: 'space-between', marginBottom: 15},
                ]}>
                <View style={styles.row}>
                  <GroupIcon
                    imageUrl={item.image}
                    entityType={item.entityType}
                    groupName={item.group_name}
                    containerStyle={styles.profileIcon}
                  />
                  <View style={{flex: 1}}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {item.group_name ?? item.name}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.profileIcon,
                    {marginRight: 0, marginLeft: 10},
                  ]}>
                  <Image
                    source={getEmoji(
                      selectedTab === 'all' ? item.reaction_type : selectedTab,
                    )}
                    style={styles.image}
                  />
                </View>
              </View>
            )}
          />
        </View>
      ) : null}
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  tabContanier: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
    marginBottom: 5,
  },
  tabItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.tabFontColor,
    fontFamily: fonts.RBold,
  },
  emoji: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default ReactionsModal;
