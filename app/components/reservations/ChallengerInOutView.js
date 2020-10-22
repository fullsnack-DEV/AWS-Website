import React, { useEffect } from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import * as Utility from '../../utils/index';

let switchEntity = '';
let myID = '';
let user = {};
let team = {};
export default function ChallengerInOutView({ data }) {
  useEffect(() => {
    userDetailFromStorage();
  }, []);

  const userDetailFromStorage = async () => {
    switchEntity = await Utility.getStorage('switchBy');
    if (switchEntity === 'user') {
      user = await Utility.getStorage('user');
      myID = user.user_id;
    } else if (switchEntity === 'team') {
      team = await Utility.getStorage('team');
      myID = team.group_id;
    }
  };
  return (
    <>
      {data.responsible_to_secure_venue
      && data.invited_by === myID
      && data.invited_to === data.home_team.user_id ? (
        <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
          <Image source={images.requestOut} style={styles.inOutImageView} />
          <View style={styles.entityView}>
            {data.home_team.thumbnail && (
              <Image
                source={{ uri: data.home_team.thumbnail }}
                style={styles.profileImage}
              />
            )}
            {data.home_team && (
              <Text style={styles.entityName}>
                {data.home_team.full_name}
                <Text style={[styles.requesterText, { color: colors.greeColor }]}>
                  {' '}
                  (challenger){' '}
                </Text>
              </Text>
            )}
          </View>
        </View>
        ) : (
          <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
            <Image source={images.requestIn} style={styles.inOutImageView} />
            <View style={styles.entityView}>
              <Image source={images.teamPlaceholder} style={styles.profileImage} />
              {/* {data.away_team.thumbnail && <Image source={{uri: data.away_team.thumbnail}} style={styles.profileImage} />} */}
              {data.away_team && (
                <Text style={styles.entityName}>
                  {data.away_team.full_name}
                  <Text style={[styles.requesterText, { color: colors.greeColor }]}>
                    {' '}
                    (challengee){' '}
                  </Text>
                </Text>
              )}
            </View>
          </View>
        )}

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
