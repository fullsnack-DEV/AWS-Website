import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import QB from 'quickblox-react-native-sdk';
import FastImage from 'react-native-fast-image';
import {QBgetUserDetail} from '../../utils/QuickBlox';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';

const MessageOccupantsProfilePic = ({occupantsIds}) => {
  const [occupantsData, setOccupantsData] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (occupantsIds.length > 0) {
      getUserData();
    }
  }, [occupantsIds]);

  const getUserData = useCallback(() => {
    QBgetUserDetail(
      QB.users.USERS_FILTER.FIELD.ID,
      QB.users.USERS_FILTER.TYPE.STRING,
      [occupantsIds].join(),
    )
      .then((res) => {
        const myQBID = authContext?.entity?.QB?.id;
        const users = res?.users?.filter((item) => item?.id !== myQBID);
        setOccupantsData([...users]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [authContext?.entity?.QB?.id, occupantsIds]);

  return (
    <View>
      <ProfileView data={occupantsData} />
    </View>
  );
};

const ProfileView = ({data}) => {
  const [occupantData, setOccupantData] = useState([]);
  useEffect(() => {
    if (data?.length > 0) {
      const imgArray = data
        .slice(0, 2)
        .map((item) => JSON.parse(item.customData));
      setOccupantData([...imgArray]);
    }
  }, [data]);

  if (occupantData?.length >= 2) {
    return (
      <View style={styles.mainContainer}>
        <View style={{position: 'absolute', left: 0, top: 0}}>
          <ProfilePreview data={occupantData?.[1]} />
        </View>
        <View style={{position: 'absolute', right: 0, bottom: 0}}>
          <ProfilePreview data={occupantData?.[0]} />
        </View>
      </View>
    );
  }
  let entity_small_icon_image = null;
  if (occupantData?.[0]?.entity_type === 'team')
    entity_small_icon_image = images.teamSmallIcon;
  if (occupantData?.[0]?.entity_type === 'club')
    entity_small_icon_image = images.clubSmallIcon;
  if (occupantData?.[0]?.entity_type === 'league')
    entity_small_icon_image = images.leagueSmallIcon;

  return (
    <View style={styles.mainContainer}>
      <View style={{zIndex: -1}}>
        <ProfilePreview data={occupantData?.[0]} isSingle={true} />
      </View>
      {entity_small_icon_image ? (
        <View style={{zIndex: 1}}>
          <FastImage
            source={entity_small_icon_image}
            resizeMode={'contain'}
            style={styles.entitySmallIconImage}
          />
        </View>
      ) : null}
    </View>
  );
};

const ProfilePreview = ({data, isSingle = false}) => {
  const outerCircleSize = isSingle ? 45 : 38;
  const innerCircleSize = isSingle ? 42 : 35;

  let defaultImage = images.profilePlaceHolder;
  if (data?.entity_type === 'team') defaultImage = images.teamCover;
  else if (data?.entity_type === 'club') defaultImage = images.clubCover;
  else if (data?.entity_type === 'league') defaultImage = images.leagueCover;

  const display_first_character = !['user', 'player']?.includes(
    data?.entity_type,
  );

  let imageSize = '100%';
  if (!['user', 'player']?.includes(data?.entity_type) && !data?.full_image)
    imageSize = '100%';

  return (
    <View
      style={{
        ...styles.profilePreViewContainer,
        height: outerCircleSize,
        width: outerCircleSize,
      }}
    >
      <View
        style={{
          ...styles.imageContainer,
          height: innerCircleSize,
          width: innerCircleSize,
        }}
      >
        <FastImage
          resizeMode={'contain'}
          source={data?.full_image ? {uri: data?.full_image} : defaultImage}
          style={{...styles.image, height: imageSize, width: imageSize}}
        />
        {display_first_character ? (
          <View style={styles.display_first_characterContainer}>
            <Text style={styles.display_first_character}>
              {data?.full_name?.[0]}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 15,
    height: 45,
    width: 45,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  profilePreViewContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    elevation: 5,
    flexDirection: 'row',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entitySmallIconImage: {
    height: 15,
    width: 15,
    position: 'absolute',
    bottom: -3,
    right: 0,
  },
  display_first_characterContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  display_first_character: {
    fontSize: 12,
    padding: 0,
    margin: 0,
    top: -2,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    textAlign: 'center',
  },
});
export default MessageOccupantsProfilePic;
