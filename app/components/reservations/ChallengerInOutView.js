/* eslint-disable consistent-return */
import React, { useEffect, useContext } from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import AuthContext from '../../auth/context'
import strings from '../../Constants/String';

let entity = {};
export default function ChallengerInOutView({ data }) {
  const authContext = useContext(AuthContext)
  useEffect(() => {
    entity = authContext.entity
  }, []);
  const getChallengerOrChallengee = () => {
    if (data.responsible_to_secure_venue) {
      if (data.invited_by === entity.uid) {
        return strings.challengee
      }
      return strings.challenger
    }
    if (data.referee || data.scorekeeper) {
      if (data.initiated_by === entity.uid) {
        return strings.requestee
      }
      return strings.requester
    }
  }
  const getEntityObject = () => {
    if (data.responsible_to_secure_venue) {
      if (data.invited_by === entity.uid) {
        if (data.userChallenge) {
          if (data.invited_by === data.home_team.user_id) {
            return { name: `${data.away_team.first_name} ${data.away_team.last_name}`, thumbnail: data?.away_team?.thumbnail }
          }

          return { name: `${data.home_team.first_name} ${data.home_team.last_name}`, thumbnail: data?.home_team?.thumbnail }
        }

        if (data.invited_by === data?.home_team?.group_id) {
          return { name: data?.away_team?.group_name, thumbnail: data?.away_team?.thumbnail }
        }

        return { name: data?.home_team?.group_name, thumbnail: data?.home_team?.thumbnail }
      }

      if (data.userChallenge) {
        if (data.invited_by === data.home_team.user_id) {
          return { name: `${data.home_team.first_name} ${data.home_team.last_name}`, thumbnail: data?.home_team?.thumbnail }
        }

        return { name: `${data.away_team.first_name} ${data.away_team.last_name}`, thumbnail: data?.away_team?.thumbnail }
      }

      if (data.invited_by === data?.home_team?.group_id) {
        return { name: data?.home_team?.group_name, thumbnail: data?.home_team?.thumbnail }
      }

      return { name: data?.away_team?.group_name, thumbnail: data?.away_team?.thumbnail }
    }
    if (data.referee) {
      if (data.initiated_by === entity.uid) {
        return { name: `${data.referee.first_name} ${data.referee.last_name}`, thumbnail: data.referee.thumbnail }
      }

      if (data.game.singlePlayerGame) {
        if (data.initiated_by === data.game.home_team.user_id) {
          return { name: `${data.game.home_team.first_name} ${data.game.home_team.last_name}`, thumbnail: data?.game?.home_team?.thumbnail }
        }

        return { name: `${data.game.away_team.first_name} ${data.game.away_team.last_name}`, thumbnail: data?.game?.away_team?.thumbnail }
      }

      if (data.initiated_by === data?.game?.home_team?.group_id) {
        return { name: data?.game?.home_team?.group_name, thumbnail: data?.game?.home_team?.thumbnail }
      }

      return { name: data?.game?.away_team?.group_name, thumbnail: data?.game?.away_team?.thumbnail }
    }
    if (data.scorekeeper) {
      if (data.initiated_by === entity.uid) {
        return { name: `${data.scorekeeper.first_name} ${data.scorekeeper.last_name}`, thumbnail: data.scorekeeper.thumbnail }
      }

      if (data.game.singlePlayerGame) {
        if (data.initiated_by === data.game.home_team.user_id) {
          return { name: `${data.game.home_team.first_name} ${data.game.home_team.last_name}`, thumbnail: data?.game?.home_team?.thumbnail }
        }

        return { name: `${data.game.away_team.first_name} ${data.game.away_team.last_name}`, thumbnail: data?.game?.away_team?.thumbnail }
      }

      if (data.initiated_by === data?.game?.home_team?.group_id) {
        return { name: data?.game?.home_team?.group_name, thumbnail: data?.game?.home_team?.thumbnail }
      }

      return { name: data?.game?.away_team?.group_name, thumbnail: data?.game?.away_team?.thumbnail }
    }
  }
  return (
    <>
      <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
        <Image source={(getChallengerOrChallengee() === strings.challenger || getChallengerOrChallengee() === strings.requester) ? images.requestIn : images.requestOut} style={styles.inOutImageView} />
        <View style={styles.entityView}>
          {getEntityObject().thumbnail ? (
            <Image
                    source={{ uri: getEntityObject().thumbnail }}
                    style={styles.profileImage}
                  />
          ) : (
            <Image
                    source={images.teamPlaceholder}
                    style={styles.profileImage}
                  />
          )}
          <Text style={styles.entityName}>
            {`${getEntityObject().name}   ` }
            <Text style={[styles.requesterText, { color: (getChallengerOrChallengee() === strings.challenger || getChallengerOrChallengee() === strings.requester) ? colors.themeColor : colors.greeColor }]}>
              {getChallengerOrChallengee()}
            </Text>
          </Text>
        </View>
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  entityView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
  },
  inOutImageView: {
    alignSelf: 'center',
    height: 30,
    resizeMode: 'cover',
    width: 30,
  },

  profileImage: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 5,
  },
  requesterText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,

  },
});
