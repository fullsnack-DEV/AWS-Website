import React from 'react';
import {
  View, StyleSheet, Text, Image, TouchableOpacity,
} from 'react-native';
import fonts from '../../Constants/Fonts';
import PATH from '../../Constants/ImagePath';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';
import colors from '../../Constants/Colors';

let actorName = '';
let placeHolder = '';
let notificationText = '';
let notificationCreatedAt = '';
let jsonObject = '';
let leftButtonTitle = 'ACCEPT';
let rightButtonTitle = 'DECLINE';
let actorImage = '';

function NotificationInviteCell(props) {
  actorName = '';
  placeHolder = '';
  notificationText = '';
  notificationCreatedAt = '';
  jsonObject = '';
  leftButtonTitle = 'ACCEPT';
  rightButtonTitle = 'DECLINE';
  actorImage = '';
  if (props.data.actor_count > 0) {
    const activity = props.data.activities[0];
    // For referee reservation case
    if (props && activity.object) {
      jsonObject = JSON.parse(activity.object);
      notificationText = jsonObject.text;
    }
    if (props && props.data.created_at) {
      notificationCreatedAt = props.data.created_at
    }
    if (activity.actor.data.entity_type === 'player') {
      placeHolder = PATH.profilePlaceHolder;
    } else if (activity.actor.data.entity_type === 'team') {
      placeHolder = PATH.teamPlaceholder;
    } else if (activity.actor.data.entity_type === 'club') {
      placeHolder = PATH.clubPlaceholder;
    }
    actorName = activity.actor.data.full_name;
    console.log('actor name -->', activity.actor.data.full_name);
    actorImage = activity.actor.data.thumbnail
  }
  return (
    <View>
      <TouchableOpacity onPress={props.card}>
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
          <TouchableOpacity style={styles.acceptBtnStyle} onPress={props.onAccept}>
            <Text style={{ color: colors.whiteColor, textAlign: 'center' }}>{leftButtonTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtnStyle} onPress={props.onDecline}>
            <Text style={{ color: colors.lightBlackColor, textAlign: 'center' }}>{rightButtonTitle}</Text>
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
  acceptBtnStyle: {
    width: 140,
    height: 25,
    borderWidth: 1,
    borderColor: '#FF8A01',
    borderRadius: 5,
    left: 70,
    justifyContent: 'center',
    backgroundColor: colors.themeColor,
  },
  declineBtnStyle: {
    width: 140,
    height: 25,
    borderWidth: 1,
    borderColor: colors.veryLightBlack,
    borderRadius: 5,
    alignSelf: 'flex-end',
    right: 15,
    justifyContent: 'center',
  },
});

export default NotificationInviteCell;
