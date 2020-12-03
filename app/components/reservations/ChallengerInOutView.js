import React, { useEffect, useContext } from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import AuthContext from '../../auth/context'

let uid = '';
export default function ChallengerInOutView({ data }) {
  const authContext = useContext(AuthContext)
  useEffect(() => {
    uid = authContext.entity
  }, []);

  return (
    <>
      {data.responsible_to_secure_venue
      && data.invited_by === uid
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
