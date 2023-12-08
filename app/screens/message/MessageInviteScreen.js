import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import _ from 'lodash';
import ScreenHeader from '../../components/ScreenHeader';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import {strings} from '../../../Localization/translation';
import {getGroupIndex, getUserIndex} from '../../api/elasticSearch';
import Verbs from '../../Constants/Verbs';
import TabBarForInvitee from './components/TabBarForInvitee';
import InviteeCard from './components/InviteeCard';
import SelectedInviteeCard from './components/SelectedInviteeCard';
import useStreamChatUtils from '../../hooks/useStreamChatUtils';

const MessageInviteScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const {createChannel, isCreatingChannel} = useStreamChatUtils();

  const [currentTab, setCurrentTab] = useState(strings.allType);
  const [loading, setLoading] = useState(false);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [list, setList] = useState([]);
  const [searchedList, setSearchedList] = useState([]);

  const inputRef = useRef();
  const searchRef = useRef();

  const TAB_ITEMS = [
    strings.allType,
    strings.peopleTitleText,
    strings.teamsTitleText,
    strings.clubsTitleText,
  ];

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
          (item) => item.group_id ?? item.user_id !== authContext.entity.uid,
        );

        const newList = data.map((item) => ({
          id: item.group_id ?? item.user_id,
          name: item.group_name ?? item.full_name,
          image: item.full_image ?? item.thumbnail,
          entityType: item.entity_type ?? Verbs.entityTypePlayer,
          city: item.city,
        }));

        const sortedList = _.sortBy(newList, 'name');

        setList(sortedList);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [authContext.entity.uid]);

  useEffect(() => {
    getInviteesData();
  }, [getInviteesData]);

  const getConditionsForSearch = useCallback(
    (entityType) => {
      switch (currentTab) {
        case strings.peopleTitleText:
          return (
            entityType === (Verbs.entityTypePlayer || Verbs.entityTypeUser)
          );

        case strings.teamsTitleText:
          return entityType === Verbs.entityTypeTeam;

        case strings.clubsTitleText:
          return entityType === Verbs.entityTypeClub;

        default:
          return true;
      }
    },
    [currentTab],
  );

  useEffect(() => {
    if (searchText.length > 0) {
      clearTimeout(searchRef.current);
      searchRef.current = setTimeout(() => {
        const filteredData = list.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) &&
            getConditionsForSearch(item.entityType),
        );

        setSearchedList(filteredData);
      }, 300);
    } else {
      setSearchedList([]);
    }

    return () => clearTimeout(searchRef.current);
  }, [searchText, list, getConditionsForSearch]);

  const getInviteeList = (option) => {
    switch (option) {
      case strings.allType:
        return [...list];

      case strings.peopleTitleText:
        return list.filter(
          (item) =>
            item.entityType === Verbs.entityTypePlayer ||
            item.entityType === Verbs.entityTypeUser,
        );

      case strings.teamsTitleText:
        return list.filter((item) => item.entityType === Verbs.entityTypeTeam);

      case strings.clubsTitleText:
        return list.filter((item) => item.entityType === Verbs.entityTypeClub);

      default:
        return [...list];
    }
  };

  const toggleSelection = (isChecked, user) => {
    let newData = [];
    if (isChecked) {
      newData = selectedInvitees.filter((item) => item.id !== user.id);
    } else {
      newData = [user, ...selectedInvitees];
    }
    setSelectedInvitees([...newData]);
  };

  const ListEmptyComponent = () => (
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
  );

  const handlePress = () => {
    if (selectedInvitees.length === 1) {
      createChannel(selectedInvitees)
        .then(async (channel) => {
          if (channel !== null) {
            await channel.watch();
            navigation.navigate('MessageChatScreen', {
              channel,
            });
          }
        })
        .catch((err) => {
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    } else if (selectedInvitees.length > 1) {
      navigation.navigate('MessageNewGroupScreen', {
        selectedInviteesData: selectedInvitees,
      });
    }
  };

  useEffect(() => {
    if (route.params?.selectedInviteesData) {
      setSelectedInvitees([...route.params.selectedInviteesData]);
    }
  }, [route.params?.selectedInviteesData]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScreenHeader
        title={strings.invite}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        isRightIconText
        rightButtonText={
          selectedInvitees.length > 1 ? strings.next : strings.create
        }
        rightButtonTextStyle={
          selectedInvitees.length === 0 ? {color: colors.userPostTimeColor} : {}
        }
        onRightButtonPress={() => {
          if (selectedInvitees.length > 0) {
            handlePress();
          }
        }}
        loading={isCreatingChannel}
      />
      <Pressable
        style={styles.textInputStyle}
        onPress={() => inputRef.current.focus()}>
        <TextInput
          ref={inputRef}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          style={styles.textInput}
          placeholder={strings.searchText}
        />
        {searchText.length > 0 && (
          <Pressable
            onPress={() => {
              clearTimeout(searchRef.current);
              setSearchText('');
            }}>
            <Image source={images.closeRound} style={styles.closeIcon} />
          </Pressable>
        )}
      </Pressable>
      {/* Selected invitees list */}
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

      <TabBarForInvitee
        activeTab={currentTab}
        onChange={(selectedTab) => {
          setCurrentTab(selectedTab);
          setSearchText('');
        }}
        TAB_ITEMS={TAB_ITEMS}
      />
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
            ListEmptyComponent={ListEmptyComponent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  textInputStyle: {
    backgroundColor: colors.textFieldBackground,
    // paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    paddingVertical: 10,
    flex: 1,
  },
  closeIcon: {
    width: 15,
    height: 15,
  },
});
export default MessageInviteScreen;
