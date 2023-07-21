// @flow
import _ from 'lodash';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {getGroupIndex, getUserIndex} from '../../../api/elasticSearch';
import AuthContext from '../../../auth/context';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import UserListShimmer from '../../../components/shimmer/commonComponents/UserListShimmer';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import Verbs from '../../../Constants/Verbs';
import InviteeCard from './InviteeCard';
import SelectedInviteeCard from './SelectedInviteeCard';

const TAB_ITEMS = [
  strings.peopleTitleText,
  strings.groupsTitleText,
  strings.matchesTitleText,
];

const InviteModal = ({
  isVisible = false,
  closeModal = () => {},
  addMembers = () => {},
}) => {
  const authContext = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [currentTab, setCurrentTab] = useState(strings.peopleTitleText);
  const [loading, setLoading] = useState(false);
  const [searchedList, setSearchedList] = useState([]);

  const getInviteesData = useCallback(() => {
    setLoading(true);
    const groupQuery = {
      size: 1000,
      query: {bool: {must: [{term: {is_pause: false}}]}},
    };

    const promiseArr = [getUserIndex({size: 1000}), getGroupIndex(groupQuery)];

    Promise.all(promiseArr)
      .then(([users, groupsList]) => {
        const response = [...users, ...groupsList];

        const data = response.filter(
          (item) =>
            item.group_id !== authContext.entity.uid ||
            item.user_id !== authContext.entity.uid,
        );

        const newList = data.map((item) => ({
          id: item.group_id ?? item.user_id,
          name: item.group_name ?? item.full_name,
          image: item.full_image ?? item.thumbnail,
          entityType: item.entity_type,
          city: item.city,
        }));

        setList(_.sortBy(newList, 'name'));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [authContext.entity.uid]);

  useEffect(() => {
    if (isVisible) {
      getInviteesData();
    }
  }, [isVisible, getInviteesData]);

  const getInviteeList = (option) => {
    switch (option) {
      case strings.peopleTitleText:
        return list.filter(
          (item) =>
            item.entityType === Verbs.entityTypePlayer ||
            item.entityType === Verbs.entityTypeUser,
        );
      case strings.groupsTitleText:
        return list.filter(
          (item) =>
            item.entityType === Verbs.entityTypeTeam ||
            item.entityType === Verbs.entityTypeClub,
        );

      default:
        return [];
    }
  };

  useEffect(() => {
    if (searchText.length > 0) {
      const filteredData = list.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) &&
          item.entityType ===
            (currentTab === strings.peopleTitleText
              ? Verbs.entityTypePlayer || Verbs.entityTypeUser
              : Verbs.entityTypeTeam || Verbs.entityTypeClub),
      );

      setSearchedList(filteredData);
    } else {
      setSearchedList([]);
    }
  }, [searchText, list, currentTab]);

  const toggleSelection = (isChecked, user) => {
    if (isChecked) {
      const uIndex = selectedInvitees.findIndex(
        (item) => user?.id === item?.id,
      );
      if (uIndex !== -1) selectedInvitees.splice(uIndex, 1);
    } else {
      selectedInvitees.push(user);
    }
    setSelectedInvitees([...selectedInvitees]);
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style4}
      title={strings.invite}
      headerRightButtonText={strings.create}
      containerStyle={styles.parent}
      onRightButtonPress={() => {
        if (selectedInvitees.length > 0) {
          addMembers(selectedInvitees);
        }
      }}>
      <TextInput
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        style={styles.textInputStyle}
        placeholder={strings.searchText}
      />

      {selectedInvitees.length > 0 ? (
        <View style={{marginBottom: 15, paddingHorizontal: 15}}>
          <FlatList
            data={selectedInvitees}
            renderItem={({item}) => (
              <SelectedInviteeCard
                item={item}
                onCancel={() => toggleSelection(true, item)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      <View style={styles.row}>
        {TAB_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabItem,
              currentTab === item ? styles.activeTabItem : {},
            ]}
            onPress={() => {
              setCurrentTab(item);
              setSearchText('');
            }}>
            <Text
              style={[
                styles.tabText,
                currentTab === item ? styles.activeTabText : {},
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{flex: 1}}>
        {loading ? (
          <UserListShimmer />
        ) : (
          <FlatList
            data={
              searchText.length >= 3 ? searchedList : getInviteeList(currentTab)
            }
            renderItem={({item}) => {
              const isChecked = selectedInvitees.some(
                (val) => val.id === item.id,
              );
              return (
                <InviteeCard
                  item={item}
                  onPress={() => toggleSelection(isChecked, item)}
                  isChecked={isChecked}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  minHeight: 200,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    fontFamily: fonts.RMedium,
                    color: colors.userPostTimeColor,
                  }}>
                  {strings.noRecordFoundText}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: '92%',
    padding: 15,
  },
  textInputStyle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    backgroundColor: colors.textFieldBackground,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.grayBackgroundColor,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
    paddingBottom: 7,
  },
  activeTabText: {
    color: colors.tabFontColor,
    fontFamily: fonts.RBold,
  },
});
export default InviteModal;
