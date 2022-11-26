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
  Image,
  Pressable,
} from 'react-native';

import {format} from 'react-string-format';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import {sendInvitationInGroup} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ProfileCheckView from '../../../components/groupConnections/ProfileCheckView';
import TCTags from '../../../components/TCTags';
import {getUserIndex} from '../../../api/elasticSearch';
import TCThinDivider from '../../../components/TCThinDivider';
import images from '../../../Constants/ImagePath';

let stopFetchMore = true;

export default function InviteMembersBySearchScreen({navigation}) {
  const [loading, setloading] = useState(true);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  const [filters, setFilters] = useState();
  const [searchText, setSearchText] = useState('');
  const selectedPlayers = [];
  useEffect(() => {
    getUsers(filters);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.sendButtonStyle} onPress={() => sendInvitation()}>
          Send
        </Text>
      ),
    });
  }, [navigation, selectedList]);

  const sendInvitation = () => {
    setloading(true);
    const entity = authContext.entity;
    const obj = {
      entity_type: entity.role,
      userIds: selectedList,
      uid: entity.uid,
    };
    console.log('Obj::', obj);
    sendInvitationInGroup(obj, authContext)
      .then((response) => {
        setloading(false);
        console.log('Response of Invitation sent:', response);
        navigation.navigate('InvitationSentScreen');
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onScrollHandler = () => {
    if (!stopFetchMore) {
      getUsers(filters);
      stopFetchMore = true;
    }
  };
  const getUsers = useCallback(
    (filterPlayer) => {
      const membersQuery = {
        size: pageSize,
        from: pageFrom,
        query: {
          bool: {
            must: [],
          },
        },
      };
      if (filterPlayer?.searchText?.length > 0) {
        membersQuery.query.bool.must.push({
          query_string: {
            query: `*${filterPlayer?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }
      getUserIndex(membersQuery)
        .then((response) => {
          console.log('User list:->', response);
          setloading(false);
          if (response.length > 0) {
            const result = response.map((obj) => {
              // eslint-disable-next-line no-param-reassign
              obj.isChecked = false;
              return obj;
            });
            setPlayers([...players, ...result]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((error) => {
          setloading(false);
          Alert.alert(error);
        });
    },
    [pageFrom, pageSize, players],
  );
  const selectPlayer = ({item, index}) => {
    players[index].isChecked = !item.isChecked;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
    setSelectedList(selectedPlayers);
    console.log('Selected Item:', selectedPlayers);
  };

  const renderPlayer = ({item, index}) => (
    <ProfileCheckView
      playerDetail={item}
      isChecked={item.isChecked}
      onPress={() => selectPlayer({item, index})}
    />
  );
  const handleTagPress = ({index}) => {
    players[index].isChecked = false;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
  };

  const applyFilter = useCallback((fil) => {
    getUsers(fil);
  }, []);
  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noPlayer}
      </Text>
    </View>
  );

  const ItemSeparatorComponent = useCallback(() => <TCThinDivider />, []);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Text style={styles.infoTextStyle}>
        {format(strings.inviteSearchText, authContext.entity.role)}
      </Text>
      <TCSearchBox
        width={'90%'}
        alignSelf="center"
        onChangeText={(text) => {
          // searchFilterFunction(text)

          const tempFilter = {...filters};

          if (text?.length > 0) {
            tempFilter.searchText = text;
          } else {
            delete tempFilter.searchText;
          }
          setFilters({
            ...tempFilter,
          });
          setPageFrom(0);
          setPlayers([]);
          applyFilter(tempFilter);
          setSearchText(text);
        }}
      />

      <TCTags
        dataSource={players}
        titleKey={'full_name'}
        onTagCancelPress={handleTagPress}
      />

      {players.filter((obj) => obj.isChecked).length <= 0 &&
        searchText.length <= 0 && (
          <View>
            <Pressable
              style={styles.imageTextContainer}
              onPress={() => {
                navigation.navigate('InviteMembersByEmailScreen');
              }}>
              <Image source={images.inviteEmail} style={styles.imageIcon} />
              <Text style={styles.textTitle}>{strings.inviteByEmail}</Text>
            </Pressable>
            <TCThinDivider />
            <View style={styles.imageTextContainer}>
              <Image source={images.copyUrl} style={styles.imageIcon} />
              <Text style={styles.textTitle}>{strings.copyInviteUrl}</Text>
            </View>
            <TCThinDivider />
          </View>
        )}

      <FlatList
        extraData={players}
        showsVerticalScrollIndicator={false}
        data={players}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderPlayer}
        onScroll={onScrollHandler}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListEmptyComponent={listEmptyComponent}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoTextStyle: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  sendButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  imageIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  textTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 25,
    marginBottom: 15,
    marginTop: 15,
  },
});
