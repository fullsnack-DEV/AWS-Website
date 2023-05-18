import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import {format} from 'react-string-format';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import {getUserIndex} from '../../../api/elasticSearch';
import {inviteToEvent} from '../../../api/Schedule';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import GroupIcon from '../../../components/GroupIcon';
import Verbs from '../../../Constants/Verbs';

export default function InviteToEventScreen({navigation, route}) {
  const [loading, setloading] = useState(true);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getUsers = useCallback(() => {
    const membersQuery = {
      query: {
        bool: {
          must: [],
        },
      },
    };
    // if (filterPlayer.searchText) {
    //   membersQuery.query.bool.must.push({
    //     query_string: {
    //       query: `*${filterPlayer.searchText}*`,
    //       fields: ['full_name'],
    //     },
    //   });
    // }
    getUserIndex(membersQuery)
      .then((response) => {
        setloading(false);
        setPlayers([...response]);
        setFilteredList([...response]);
      })
      .catch((error) => {
        setloading(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (searchText) {
      const list = players.filter((item) =>
        item.full_name.includes(searchText),
      );
      setFilteredList(list);
    } else {
      setFilteredList(players);
    }
  }, [players, searchText]);

  const sendInvitation = () => {
    setloading(true);
    const data = {
      userIds: selectedList,
      start_datetime: route.params.start_datetime,
      end_datetime: route.params.end_datetime,
    };
    inviteToEvent(route.params.eventId, data, authContext)
      .then((response) => {
        setloading(false);
        Alert.alert(
          response.payload.to.length > 1
            ? format(strings.nInvitationSent, response.payload.to.length)
            : strings.inviteWasSendText,
          '',
          [
            {
              text: strings.okTitleText,
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const selectPlayer = (item) => {
    let newList = [...selectedList];

    const isChecked = newList.includes(item.user_id);

    if (isChecked) {
      newList = selectedList.filter((ele) => ele !== item.user_id);
    } else {
      newList.push(item.user_id);
    }

    setSelectedList(newList);
  };

  const renderPlayer = ({item}) => {
    const isChecked = selectedList.includes(item.user_id);
    return (
      <>
        <Pressable
          style={[
            styles.row,
            {paddingHorizontal: 5, justifyContent: 'space-between'},
          ]}
          onPress={() => selectPlayer(item)}>
          <View style={styles.row}>
            <GroupIcon
              imageUrl={item.thumbnail}
              entityType={Verbs.entityTypePlayer}
              containerStyle={styles.playerProfile}
            />
            <View>
              <Text style={styles.name}>{item.full_name}</Text>
              <Text style={styles.city}>{item.city}</Text>
            </View>
          </View>
          <View style={styles.checkBox}>
            <Image
              source={isChecked ? images.orangeCheckBox : images.uncheckBox}
              style={styles.image}
            />
          </View>
        </Pressable>
        <View style={styles.separator} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={strings.invite}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.send}
        onRightButtonPress={() => sendInvitation()}
      />

      <ActivityLoader visible={loading} />

      <View style={styles.mainContainer}>
        <Text style={styles.infoTextStyle}>{strings.inviteEventText}</Text>

        <TextInput
          placeholder={strings.searchText}
          style={styles.inputStyle}
          placeholderTextColor={colors.userPostTimeColor}
          onChangeText={(text) => {
            setSearchText(text);
          }}
        />

        {selectedList.length > 0 ? (
          <View style={[styles.row, {marginBottom: 25}]}>
            {selectedList.map((item, index) => {
              const user = players.find((obj) => obj.user_id === item);
              return (
                <View key={index} style={styles.tag}>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      borderRightWidth: 1,
                      borderRightColor: colors.bgColor,
                    }}>
                    <Text style={styles.tagLabel}>{user.full_name}</Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      style={{width: 10, height: 10}}
                      onPress={() => {
                        selectPlayer(user);
                      }}>
                      <Image source={images.crossImage} style={styles.image} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        <FlatList
          data={filteredList}
          renderItem={renderPlayer}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyView}>
              <Text style={styles.emptyViewText}>{strings.noPlayer}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  infoTextStyle: {
    fontSize: 21,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 13,
  },
  inputStyle: {
    backgroundColor: colors.textFieldBackground,
    paddingHorizontal: 26,
    borderRadius: 25,
    height: 40,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginBottom: 15,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyViewText: {
    fontFamily: fonts.RRegular,
    color: colors.grayColor,
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerProfile: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  city: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  tag: {
    height: 25,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  tagLabel: {
    fontSize: 12,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
