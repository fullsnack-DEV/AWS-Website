import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import fonts from '../../Constants/Fonts';
import PATH from '../../Constants/ImagePath';
import Colors from '../../Constants/Colors';
import {formatTimestampForDisplay} from '../../utils/formatTimestampForDisplay';
import TCFollowButton from '../TCFollowButton';

function FollowNotification(data) {
  const activity = data.data.activities[0];
  let actorName = '';
  let placeHolder = '';
  let notificationText = '';
  let notificationCreatedAt = '';
  if (data && data.data.created_at) {
    notificationCreatedAt = data.data.created_at;
  }
  if (data && activity.object) {
    const jsonObject = JSON.parse(activity.object);
    notificationText = jsonObject.text;
  }
  if (activity.actor.data.entity_type === 'player') {
    placeHolder = PATH.profilePlaceHolder;
  } else if (activity.actor.data.entity_type === 'team') {
    placeHolder = PATH.teamPlaceholder;
  } else if (activity.actor.data.entity_type === 'club') {
    placeHolder = PATH.clubPlaceholder;
  }
  actorName = activity.actor.data.full_name;
  const actorImage = activity.actor.data.thumbnail;

  return (
    <View>
      <TouchableOpacity onPress={data.card}>
        <View style={styles.viewFirstStyle}>
          <Image
            source={actorImage ? {uri: actorImage} : placeHolder}
            style={styles.imageContainer}></Image>
          <Text style={styles.textContainerStyle}>
            <Text
              style={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                color: Colors.lightBlackColor,
              }}>
              {' '}
              {actorName}{' '}
            </Text>
            <Text
              style={{
                fontFamily: fonts.RLight,
                fontSize: 16,
                color: Colors.lightBlackColor,
              }}>
              {notificationText}{' '}
              {formatTimestampForDisplay(notificationCreatedAt)}
            </Text>
          </Text>
          <TCFollowButton
            title={'Follow'}
            width={75}
            alignSelf="center"
            marginTop={25}
          />
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
    margin: 15,
  },
  viewFirstStyle: {
    flexDirection: 'row',
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

export default FollowNotification;
