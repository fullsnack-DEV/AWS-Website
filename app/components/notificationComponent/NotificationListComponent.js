// import { includes } from 'lodash';
import React, { useEffect } from 'react';
import {
  View, StyleSheet, Text, Image, TouchableOpacity,
} from 'react-native';
import fonts from '../../Constants/Fonts';
import PATH from '../../Constants/ImagePath';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';
import * as Utility from '../../utils/index';

function NotificationListComponent({ data, selectedEntity }) {
  let actorName = '';
  let teamName = '';
  let placeHolder = '';
  let notificationText = '';
  let notificationCreatedAt = '';
  let jsonObject = '';
  let actorImage = '';
  let challengeObject;
  const leftButtonTitle = 'Details';
  const rightButtonTitle = 'Message';
  let team;
  let selectedDomainId = '';
  let loginUserId = '';
  useEffect(() => {
    getLoggedInEntity();
  }, []);

  const getLoggedInEntity = async () => {
    const entity = await Utility.getStorage('loggedInEntity');
    loginUserId = { ...entity.auth.user_id };
  };

  if (data.actor_count > 0) {
    selectedDomainId = selectedEntity.group_id;

    const activity = data.activities[0]
    if (activity.object) {
      jsonObject = JSON.parse(activity.object);
      notificationText = jsonObject.text;
    }
    const chalObject = jsonObject.challengeObject;
    const newChallengeObject = jsonObject.newChallengeObject;
    const reservationObject = jsonObject.reservationObject;

    if (chalObject || newChallengeObject) {
      if (chalObject) {
        challengeObject = chalObject;
      } else if (newChallengeObject) {
        challengeObject = newChallengeObject;
      }
      team = challengeObject.away_team;
      if (team.group_id) {
        if (team.group_id === selectedDomainId) {
          team = challengeObject.home_team;
        }
        teamName = team.group_name;
        actorName = activity.actor.data.fullName
      } else if (team.user_id === loginUserId) {
        team = challengeObject.home_team;
        const firstName = team.first_name;
        const lastName = team.last_name;
        teamName = firstName + lastName;
      }
    } else if (reservationObject) {
      console.log('teamName', teamName);
    }

    if (data && data.created_at) {
      notificationCreatedAt = data.created_at
    }

    if (activity.actor.data.entity_type === 'player') {
      placeHolder = PATH.profilePlaceHolder;
      actorName = activity.actor.data.full_name;
    } else if (activity.actor.data.entity_type === 'team') {
      placeHolder = PATH.teamPlaceholder;
    } else if (activity.actor.data.entity_type === 'club') {
      placeHolder = PATH.clubPlaceholder;
    }
    actorName = activity.actor.data.full_name;
    actorImage = activity.actor.data.thumbnail
  }

  return (
    <View>
      <TouchableOpacity onPress={data.card}>
        <View style={styles.viewFirstStyle}>
          <Image
            source={ actorImage ? { uri: actorImage } : placeHolder }
            style={styles.imageContainer}></Image>
          <Text style={styles.textContainerStyle}>
            <Text style={{ fontFamily: fonts.RBold, fontSize: 16 }}>
              {' '}
              {actorName}{' '}
            </Text>
            <Text>{notificationText} {commentPostTimeCalculate(notificationCreatedAt)}</Text>
          </Text>
        </View>
        <View style={styles.viewSecondStyle}>
          <TouchableOpacity style={styles.detailBtnStyle} onPress={data.cta1}>
            <Text style={{ color: '#FF8A01', textAlign: 'center' }}>{leftButtonTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageBtnStyle} onPress={data.cta2}>
            <Text style={{ color: '#45C1C0', textAlign: 'center' }}>{rightButtonTitle}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorView}></View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    borderWidth: 0,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 15,

  },
  viewFirstStyle: {
    flexDirection: 'row',
  },
  viewSecondStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailBtnStyle: {
    width: 140,
    height: 25,
    borderWidth: 1,
    borderColor: '#FF8A01',
    borderRadius: 5,
    left: 70,
    justifyContent: 'center',
  },
  messageBtnStyle: {
    width: 140,
    height: 25,
    borderWidth: 1,
    borderColor: '#45C1C0',
    borderRadius: 5,
    alignSelf: 'flex-end',
    right: 15,
    justifyContent: 'center',
  },
  textContainerStyle: {
    marginTop: 15,
    marginBottom: 12,
    marginRight: 15,
    fontFamily: fonts.RLight,
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
  },

  separatorView: {
    marginTop: 16,
    width: '100%',
    height: 1,
    backgroundColor: '#D3D3D3',
    alignSelf: 'center',
  },
});

export default NotificationListComponent;
