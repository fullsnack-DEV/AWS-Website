/* eslint-disable no-shadow */
// @flow
import React, {useEffect, useState, useContext} from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from 'react-native';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCFollowerList from '../TCFollowerList';
import TCThinDivider from '../TCThinDivider';
import ActivityLoader from '../loader/ActivityLoader';
import CustomIosAlert from '../CustomIosAlert';
import TCSearchBox from '../TCSearchBox';
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import Verbs from '../../Constants/Verbs';
import {
  getGroupDetails,
  groupUnpaused,
  groupValidate,
  joinTeam,
} from '../../api/Groups';
import AuthContext from '../../auth/context';
import {onResendRequest} from '../../utils/accountUtils';

const MemberListModal = ({
  isVisible,
  closeList = () => {},
  sportsList = [],
  sport = null,
  title = '',
  doubleSport,
}) => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const [follower, setFollower] = useState();
  const [players, Setplayers] = useState(sportsList);
  const [followersSelection, setFollowersSelection] = useState();
  const [CustomeAlertTitle, setCustomeAlertTitle] = useState();
  const [Visiblealert, setVisibleAlert] = useState(false);
  const [grpIdforTermination, setGrpIdForTermination] = useState();
  const [doubleExist, setDoubleExist] = useState(true);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setFollowersSelection('');
    if (sportsList.length > 0) {
      Setplayers(sportsList);
    }
  }, [isFocused, sportsList]);

  const seLoaderHandler = (val) => {
    setLoading(val);
  };

  const onCancelTermination = (context, group_id) => {
    const caller_id = group_id;
    const caller = Verbs.entityTypeTeam;

    const headers = [caller_id, caller];

    groupUnpaused(context, headers)
      .then(() => {})
      .catch((e) => {
        setLoading(false);
        Alert.alert(
          e.message,
          '',
          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );
      });
  };

  const onJoinTeamPress = (grp_id) => {
    setLoading(true);
    const params = {};

    joinTeam(params, grp_id, authContext)
      .then(() => {
        setLoading(false);

        closeList();
        getGroupDetails(grp_id, authContext)
          .then((response) => {
            setLoading(false);

            navigation.push('HomeScreen', {
              uid: response.payload.group_id,
              role: response.payload.entity_type,
              backButtonVisible: false,
              menuBtnVisible: false,
              isEntityCreated: true,

              groupName: response.payload.group_name,
              entityObj: response.payload,
              userJoinTeam: true,
            });
          })
          .catch((e) => {
            setLoading(false);
            Alert.alert(
              e.message,
              '',
              [
                {
                  text: strings.OkText,
                  onPress: () => console.log('PRessed'),
                },
              ],
              {cancelable: false},
            );
          });
      })
      .catch((e) => {
        setLoading(false);
        Alert.alert(
          e.message,
          '',
          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );
      });
  };

  const validateIfDoubleExist = (p1, p2, _sport) => {
    const obj = {
      player1: p1,
      player2: p2.user_id,
      sport: _sport.sport,
      sport_type: _sport.sport_type,
      entity_type: Verbs.entityTypeTeam,
    };

    setLoading(true);

    groupValidate(obj, authContext)
      .then((response) => {
        if (typeof response.payload === 'boolean' && response.payload) {
          setDoubleExist(false);

          setLoading(false);
        } else if (
          response.payload.error_code === Verbs.REQUESTALREADYEXIST &&
          'action' in response.payload
        ) {
          setLoading(false);

          const {player1, player2, sport, sport_type, request_id} =
            response.payload.data;

          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',

            [
              {
                text: strings.resendRequest,
                onPress: () => {
                  onResendRequest(
                    player1,
                    player2,
                    sport,
                    sport_type,
                    request_id,
                    seLoaderHandler,
                    closeList,
                    authContext,
                  );
                },
              },
              {
                text: strings.goBack,
                onPress: () => console.log('Pressed'),
              },
            ],
            {cancelable: false},
          );
        } else if (response.payload.error_code === Verbs.REQUESTALREADYEXIST) {
          setLoading(false);

          // show custom Alert
          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',
            [
              {
                text: strings.respondToRequest,
                onPress: () => {
                  closeList();
                  const teamObject = response.payload.data;

                  delete teamObject.player1;
                  delete teamObject.player2;

                  teamObject.player1 = {
                    full_name: p2.full_name,

                    thumbnail: p2.thumbnail,
                  };

                  teamObject.player2 = {
                    full_name: authContext.entity.obj.full_name,
                    thumbnail: authContext.entity.obj.thumbnail,
                  };
                  teamObject.group_id = response.payload.data.request_id;

                  navigation.navigate('RespondToInviteScreen', {
                    teamObject,
                  });
                },
              },

              {
                text: strings.cancel,
                onPress: () => console.log('PRessed'),
              },
            ],
            {cancelable: false},
          );
        } else if (response.payload.error_code === Verbs.GROUPTERMINATION) {
          setLoading(false);
          setCustomeAlertTitle(response.payload.user_message);

          setGrpIdForTermination(response.payload.data.group_id);
          setVisibleAlert(true);
        } else if (
          response.payload?.data.player_leaved === true &&
          response.payload.error_code === 102
        ) {
          setLoading(false);
          Alert.alert(
            Platform.OS === 'android' ? '' : response.payload.user_message,
            Platform.OS === 'android' ? response.payload.user_message : '',
            [
              {
                text: strings.cancel,
                onPress: () => console.log('PRessed'),
                style: 'destructive',
              },
              {
                text: strings.rejoin,
                onPress: () => onJoinTeamPress(response.payload?.data.group_id),
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch((e) => {
        Alert.alert(
          Platform.OS === 'android' ? '' : e.message,
          Platform.OS === 'android' ? e.message : '',

          [
            {
              text: strings.OkText,
              onPress: () => console.log('PRessed'),
            },
          ],
          {cancelable: false},
        );

        setLoading(false);
      });
  };

  const renderFollowers = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setFollowersSelection(item.user_id);
        setFollower(item);

        setTimeout(() => {
          validateIfDoubleExist(
            authContext.entity.auth.user.user_id,
            item,
            doubleSport,
          );
        }, 10);

        console.log(
          followersSelection === item.user_id,
          item.user_id,
          'From foller selction',
        );
      }}>
      <View
        style={{
          paddingVertical: 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20,
          marginRight: 30,
        }}>
        <TCFollowerList
          type={'medium'}
          name={item.full_name}
          location={item.city}
          image={
            item?.thumbnail ? {uri: item.thumbnail} : images.profilePlaceHolder
          }
        />

        <View style={styles.checkbox}>
          {followersSelection === item.user_id ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const searchFilterFunction = (text) => {
    const result = sportsList.filter(
      (x) =>
        x.first_name.toLowerCase().includes(text.toLowerCase()) ||
        x.last_name.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      Setplayers(result);
    } else {
      Setplayers(sportsList);
    }
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style1}
      onRightButtonPress={() => {
        if (!doubleExist) {
          closeList();
          navigation.navigate('Account', {
            screen: 'CreateTeamForm1',
            params: {
              sports: doubleSport,
              double_Player: follower,
              showDouble: true,
            },
          });
        }
      }}
      headerRightButtonText={strings.next}
      title={sport?.sport ? strings.sportTextTitle : title}
      containerStyle={{padding: 0, width: '100%', height: '100%'}}
      showBackButton>
      <CustomIosAlert
        visibleAlert={Visiblealert}
        onGoBack={() => setVisibleAlert(false)}
        alertTitle={CustomeAlertTitle}
        onCancetTerminationPress={() =>
          onCancelTermination(authContext, grpIdforTermination)
        }
      />

      <ActivityLoader visible={loading} />

      <View style={styles.card}>
        <View style={styles.divider} />
        <View style={styles.container}>
          <Text style={styles.title}>
            {strings.whoDoYouwantToCreateTeamWith}
          </Text>

          <View
            style={{
              alignSelf: 'center',
              marginTop: 15,
            }}>
            <TCSearchBox
              onChangeText={(text) => searchFilterFunction(text)}
              placeholderText={strings.searchForTeamPartener}
              style={{
                height: 40,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: 75,
              marginTop: 10,
            }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              extraData={players}
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={players}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderFollowers}
            />
          </View>
        </View>
      </View>
    </CustomModalWrapper>
  );
};

export default MemberListModal;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  container: {
    marginTop: 22,
    flex: 1,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,

    marginHorizontal: 15,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
