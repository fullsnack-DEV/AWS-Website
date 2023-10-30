import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import {FlatList} from 'react-native-gesture-handler';
// eslint-disable-next-line import/no-extraneous-dependencies

import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import {getSportName} from '../../utils';
import {getGroupIndex} from '../../api/elasticSearch';
import TCThinDivider from '../../components/TCThinDivider';
import Verbs from '../../Constants/Verbs';
import TCTeamSearchView from '../../components/TCTeamSearchView';
import images from '../../Constants/ImagePath';
import {joinTeam} from '../../api/Groups';
import {ErrorCodes} from '../../utils/constant';

import {acceptRequest, declineRequest} from '../../api/Notificaitons';
import JoinButtonModal from '../home/JoinButtomModal';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ScreenHeader from '../../components/ScreenHeader';

function JoinClubScreen({route}) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setloading] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [activityId, setActibityId] = useState();
  const [locations] = useState(route.params.locations);
  const [sport] = useState(route.params.sport);
  const [sporttype] = useState(route.params.sporttype);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const cancelReqActionSheet = useRef();
  const actionSheet = useRef();
  const [smallLoader, setSmallLoader] = useState(false);
  const [isInvited] = useState(false);

  // Team list

  const modifiedClubElasticSearchResult = useCallback(
    (response) => {
      const modifiedData = [];
      for (const item of response) {
        const clubSports = item.sports.map((obj) => ({
          ...obj,
          sport_name: getSportName(obj, authContext),
        }));
        item.sports = clubSports;
        modifiedData.push(item);
      }
      return modifiedData;
    },
    [authContext],
  );

  const getClubList = useCallback(() => {
    setSmallLoader(true);
    const clubsQuery = {
      query: {
        bool: {
          must: [{match: {entity_type: Verbs.entityTypeClub}}],
        },
      },
    };

    if (locations !== strings.worldTitleText) {
      clubsQuery.query.bool.must.push({
        multi_match: {
          query: `${locations?.toLowerCase()}`,
          fields: ['city', 'country', 'state', 'state_abbr'],
        },
      });
    }

    if (sport !== strings.allSport) {
      clubsQuery.query.bool.must.push({
        term: {
          'sports.sport.keyword': {
            value: `${sport?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
      clubsQuery.query.bool.must.push({
        term: {
          'sports.sport_type.keyword': {
            value: `${sporttype?.toLowerCase()}`,
            case_insensitive: true,
          },
        },
      });
    }
    // club search filter
    if (searchQuery !== '') {
      // simple search with group name
      clubsQuery.query.bool.must.push({
        match_phrase_prefix: {
          group_name: `*${searchQuery.toLowerCase()}*`,
        },
      });
    }
    getGroupIndex(clubsQuery)
      .then((res) => {
        setSmallLoader(false);
        if (res.length > 0) {
          const modifiedResult = modifiedClubElasticSearchResult(res);
          const fetchedData = [...modifiedResult];
          setClubs(fetchedData);
        }
      })
      .catch((e) => {
        setSmallLoader(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [
    locations,
    sport,
    searchQuery,
    sporttype,
    modifiedClubElasticSearchResult,
  ]);

  useEffect(() => {
    getClubList();
  }, [getClubList, locations, sport]);

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {smallLoader ? (
        <ActivityIndicator
          style={styles.loaderStyle}
          size="small"
          color={colors.blackColor}
        />
      ) : (
        <Text
          style={{
            fontFamily: fonts.RRegular,
            color: colors.grayColor,
            fontSize: 15,
          }}>
          {strings.noRecordFoundText}
        </Text>
      )}
    </View>
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderSeparator = () => (
    <TCThinDivider
      marginTop={0}
      marginBottom={0}
      marginLeft={65}
      marginRight={15}
      backgroundColor={colors.grayBackgroundColor}
    />
  );

  const userJoinGroup = (groupId) => {
    setloading(true);
    const params = {};

    joinTeam(params, groupId, authContext)
      .then((response) => {
        setShowJoinModal(false);

        setloading(false);

        if (response.payload.error_code === ErrorCodes.MEMBEREXISTERRORCODE) {
          Alert.alert(
            '',
            response.payload.user_message,
            [
              {
                text: strings.join,
                onPress: () => {
                  joinTeam({...params, is_confirm: true}, groupId, authContext)
                    .then(() => {})
                    .catch((error) => {
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, error.message);
                      }, 10);
                    });
                },
                style: 'destructive',
              },
              {
                text: strings.cancel,
                onPress: () => {},
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERALREADYERRORCODE
        ) {
          Alert.alert(
            strings.alertmessagetitle,
            response.payload.user_message,
            [{text: strings.okTitleText}],
          );
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYINVITEERRORCODE
        ) {
          setloading(false);

          const messageStr = response.payload.user_message;
          setMessage(messageStr);
          setTimeout(() => {
            setActibityId(response.payload.data.activity_id);
            setloading(false);
            actionSheet.current.show();
          }, 50);
        } else if (
          response.payload.error_code ===
          ErrorCodes.MEMBERALREADYREQUESTERRORCODE
        ) {
          const messageStr = response.payload.user_message;
          setActibityId(response.payload.data.activity_id);
          setMessage(messageStr);
          setTimeout(() => {
            cancelReqActionSheet.current.show();
          }, 50);
        } else if (
          response.payload.error_code === ErrorCodes.MEMBERINVITEONLYERRORCODE
        ) {
          Alert.alert(strings.alertmessagetitle, response.payload.user_message);
          setShowJoinModal(false);
        } else if (response.payload.action === Verbs.joinVerb) {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage, [
            {text: strings.okTitleText},
          ]);
        } else if (response.payload.action === Verbs.requestVerb) {
          Alert.alert(strings.alertmessagetitle, strings.sendRequest, [
            {text: strings.okTitleText},
          ]);
        } else {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage, [
            {text: strings.okTitleText},
          ]);
        }
      })
      .catch((error) => {
        setloading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message, [
            {text: strings.okTitleText},
          ]);
        }, 10);
      });
  };

  const renderItem = useCallback(
    ({item}) => (
      <View>
        <View style={[styles.topViewContainer, {height: 96}]}>
          <View style={[styles.separator, {flex: 1}]}>
            <TCTeamSearchView
              data={item}
              authContext={authContext}
              isClub={true}
              showStar={false}
              // showLevelOnly={currentSubTab === strings.teamsTitleText}
              sportFilter={route.params}
              onPress={() => {
                navigation.navigate('Account', {
                  screen: 'HomeScreen',
                  params: {
                    uid: [
                      Verbs.entityTypeUser,
                      Verbs.entityTypePlayer,
                    ]?.includes(item?.entity_type)
                      ? item?.user_id
                      : item?.group_id,
                    role: [
                      Verbs.entityTypeUser,
                      Verbs.entityTypePlayer,
                    ]?.includes(item?.entity_type)
                      ? Verbs.entityTypeUser
                      : item.entity_type,
                    backButtonVisible: true,
                    menuBtnVisible: false,
                    comeFrom: 'LocalHomeScreen',
                  },
                });
              }}
              onPressJoinButton={() => {
                setGroupData(item);
                setShowJoinModal(true);
              }}
            />
          </View>
        </View>
      </View>
    ),
    [authContext, navigation],
  );

  const onAccept = (requestId) => {
    setloading(true);

    acceptRequest({}, requestId, authContext)
      .then(() => {
        setloading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.acceptRequestMessage);
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onDecline = (requestId) => {
    setloading(true);

    declineRequest(requestId, authContext)
      .then(() => {
        setloading(false);
        setShowJoinModal(false);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            strings.declinedRequestMessage,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <>
        <ActivityLoader visible={loading} />

        <ScreenHeader
          title={strings.joinClubText}
          leftIcon={images.backArrow}
          leftIconPress={() => {
            navigation.goBack();
          }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={colors.userPostTimeColor}
            style={styles.textInputStyle}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);

              setClubs([]);
            }}
            placeholder={strings.searchText}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
              }}>
              <Image
                source={images.closeRound}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: 15,
          }}>
          <FlatList
            data={clubs}
            style={{marginTop: 15}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={listEmptyComponent}
          />
        </View>

        <ActionSheet
          ref={actionSheet}
          title={message}
          options={[
            strings.acceptInvite,
            strings.declineInvite,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              onAccept(activityId);
            } else if (index === 1) {
              onDecline(activityId);
            }
          }}
        />
        <ActionSheet
          ref={cancelReqActionSheet}
          title={message}
          options={[strings.cancelRequestTitle, strings.cancel]}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              onDecline(activityId);
            }
          }}
        />

        <JoinButtonModal
          isVisible={showJoinModal}
          closeModal={() => setShowJoinModal(false)}
          currentUserData={groupData}
          onJoinPress={() => userJoinGroup(groupData.group_id)}
          onAcceptPress={() => userJoinGroup(groupData.group_id)}
          isInvited={isInvited}
        />
      </>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 75,
  },
  separator: {
    borderRightWidth: 0,
    borderColor: colors.whiteColor,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,

    marginTop: 15,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
});

export default React.memo(JoinClubScreen);
