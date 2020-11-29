import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActivityLoader from '../../../../loader/ActivityLoader';
import { getGameLineUp } from '../../../../../api/Games';
import * as Utility from '../../../../../utils/index';
import GameStatus from '../../../../../Constants/GameStatus';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import TCLabel from '../../../../TCLabel';
import TCMessageButton from '../../../../TCMessageButton';
import TCSwitcher from '../../../../TCSwitcher';
import TCThickDivider from '../../../../TCThickDivider';
import LineUpPlayerView from './LineUpPlayerView';

let entity = {};
export default function LineUp({ navigation, gameData }) {
  const [loading, setLoading] = useState(false);
  const [roster, setRoster] = useState([]);
  const [starting, setStarting] = useState([]);
  const [subs, setSubs] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [selected, setSelected] = useState(1);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = await Utility.getStorage('loggedInEntity');
    };
    getAuthEntity();
    console.log('Game Object:::', gameData);
    if (selected === 1) {
      getLineUpOfTeams(gameData.home_team.group_id, gameData.game_id);
    }
    console.log('Roster Array:::', roster);
  }, []);
  // eslint-disable-next-line consistent-return
  const getTimeDifferent = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return (days > 0 && `${days}d ${hours}h ${minutes}m left`) || (hours > 0 && `${hours}h ${minutes}m left`) || (minutes > 0 && `${minutes}m left`);
  };
  const getLineUpOfTeams = (teamID, gameID) => {
    setLoading(true);
    getGameLineUp(teamID, gameID).then((response) => {
      const rosterData = response.payload.roster;
      setLoading(false);
      setRoster(rosterData);
      setStarting(
        rosterData.filter(
          (el) => el.role === 'player' && el.lineup === 'starting',
        ),
      );
      setSubs(
        rosterData.filter((el) => el.role === 'player' && el.lineup === 'subs'),
      );
      setCoaches(
        rosterData.filter(
          (el) => el.status === 'accepted' && el.role === 'coach',
        ),
      );
      console.log(JSON.stringify(response.payload));
    });
  };
  const renderRoster = ({ item }) => (
    <LineUpPlayerView
      buttonType={
        (item.member_id === entity.auth.user_id && 'nobutton')
        || (entity.role === 'team'
        && selected === 1
        && gameData.home_team.group_id === entity.uid
        && item.profile.connected
          && 'message'
        )
        || (entity.role === 'team'
        && selected === 1
        && gameData.home_team.group_id === entity.uid
        && !item.profile.connected
          && 'email'
        )
        || (entity.role === 'team'
        && selected === 2
        && gameData.away_team.group_id === entity.uid
        && item.profile.connected
          && 'message')
        || (entity.role === 'team'
        && selected === 2
        && gameData.away_team.group_id === entity.uid
        && !item.profile.connected
          && 'email')
        || (entity.role === 'club'
        && gameData.status === GameStatus.ended
        && new Date((new Date(gameData.actual_enddatetime) + 5).getTime()) < new Date().getTime()
        && item.review_id
          && 'editreview')
        || (entity.role === 'club'
        && gameData.status === GameStatus.ended
        && new Date((new Date(gameData.actual_enddatetime) + 5).getTime()) < new Date().getTime()
        && !item.review_id
          && 'review')
        || (entity.role === 'user'
        && gameData.status === GameStatus.ended
        && new Date((new Date(gameData.actual_enddatetime) + 5).getTime()) < new Date().getTime()
        && item.review_id
        && item.member_id !== entity.auth.user_id
          && 'editreview')
        || (entity.role === 'user'
        && gameData.status === GameStatus.ended
        && new Date((new Date(gameData.actual_enddatetime) + 5).getTime()) < new Date().getTime()
        && !item.review_id
        && item.member_id !== entity.auth.user_id
          && 'review')
        || (entity.role === 'user'
        && item.is_following
        && item.profile.connected
        && item.member_id !== entity.auth.user_id
          && 'following')
        || (entity.role === 'user'
        && !item.is_following
        && item.profile.connected
        && item.member_id !== entity.auth.user_id
          && 'follow')
            || 'nobutton'
      }
      userData={item}
      onButtonPress={(bType) => {
        console.log('ITEM BTYPE::', bType);
        console.log('ITEM PRESSED::', item);
      }}
    />
  );
  return (
    <View>
      <ActivityLoader visible={loading} />
      <TCSwitcher
        tabs={
          gameData && [
            gameData.home_team.group_name,
            gameData.away_team.group_name]
        }
        selectedTab={selected === 1 ? 0 : 1}
        onTabPress={(index) => {
          if (index === 0) {
            setSelected(1);
            getLineUpOfTeams(gameData.home_team.group_id, gameData.game_id);
          } else {
            setSelected(2);
            getLineUpOfTeams(gameData.away_team.group_id, gameData.game_id);
          }
        }}
      />
      {gameData.status === GameStatus.ended
        && new Date((new Date(gameData.actual_enddatetime) + 5).getTime()) < new Date().getTime() && <Text style={styles.reviewText}>
          Review period: <Text style={styles.reviewTime}>{getTimeDifferent(new Date().getTime(), new Date((new Date(gameData.actual_enddatetime) + 5).getTime()))}</Text>
        </Text>}

      <View>
        <View style={styles.editableView}>
          <TCLabel title={'Roster'} />
          {((selected === 1
            && gameData.home_team.group_id === entity.uid
            && gameData.status === GameStatus.accepted)
            || (selected === 2
              && gameData.away_team.group_id === entity.uid
              && gameData.status === GameStatus.accepted)) && (
                <TouchableOpacity
              style={styles.editTouchArea}
              hitSlop={{
                top: 15,
                bottom: 15,
                left: 15,
                right: 15,
              }}
              onPress={() => navigation.navigate('EditRosterNonRosterScreen', {
                screen: 'EditRosterNonRosterScreen',
              })
              }>
                  <Image source={images.editSection} style={styles.editButton} />
                </TouchableOpacity>
          )}
        </View>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
            marginLeft: 25,
          }}>
          Starting
        </Text>

        {starting.length === 0 ? (
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.grayColor,
              marginLeft: 35,
              marginTop: 10,
            }}>
            No Player
          </Text>
        ) : (
          <FlatList
            data={starting}
            renderItem={renderRoster}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}

        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
            marginLeft: 25,
            marginTop: 20,
          }}>
          Subs
        </Text>

        {subs.length === 0 ? (
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.grayColor,
              marginLeft: 35,
              marginTop: 10,
            }}>
            No Player
          </Text>
        ) : (
          <FlatList
            data={subs}
            renderItem={renderRoster}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}

        {((selected === 1
          && gameData.home_team.group_id === entity.uid
          && gameData.status === GameStatus.accepted)
          || (selected === 2
            && gameData.away_team.group_id === entity.uid
            && gameData.status === GameStatus.accepted)) && (
              <TCMessageButton
            title={'Invite Temporary Player'}
            width={167}
            alignSelf={'center'}
            marginTop={10}
          />
        )}

        <TCThickDivider marginTop={25} />
        <View style={styles.editableView}>
          <TCLabel title={'Coaches'} />
          {((selected === 1
            && gameData.home_team.group_id === entity.uid
            && gameData.status === GameStatus.accepted)
            || (selected === 2
              && gameData.away_team.group_id === entity.uid
              && gameData.status === GameStatus.accepted)) && (
                <TouchableOpacity
              style={styles.editTouchArea}
              hitSlop={{
                top: 15,
                bottom: 15,
                left: 15,
                right: 15,
              }}
              onPress={() => navigation.navigate('EditRosterCoacheScreen', {
                screen: 'EditRosterCoacheScreen',
              })
              }>
                  <Image source={images.editSection} style={styles.editButton} />
                </TouchableOpacity>
          )}
        </View>

        {coaches.length === 0 ? (
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.grayColor,
              marginLeft: 35,
              marginTop: 10,
            }}>
            No Coach
          </Text>
        ) : (
          <FlatList
            data={coaches}
            renderItem={renderRoster}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}
        {((selected === 1
          && gameData.home_team.group_id === entity.uid
          && gameData.status === GameStatus.accepted)
          || (selected === 2
            && gameData.away_team.group_id === entity.uid
            && gameData.status === GameStatus.accepted)) && (
              <TCMessageButton
            title={'Invite Temporary Coach'}
            width={167}
            alignSelf={'center'}
            marginTop={10}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  reviewText: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.themeColor,
    marginLeft: 15,
  },
  reviewTime: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.themeColor,
  },
  editButton: {
    height: 16,
    width: 16,
    resizeMode: 'center',
    alignSelf: 'center',
  },
  editableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
  },
  editTouchArea: {
    alignSelf: 'center',
  },
});
