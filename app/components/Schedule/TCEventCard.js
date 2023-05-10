import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback, ImageBackground, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getJSDate, getSportName} from '../../utils';
import AuthContext from '../../auth/context';
import { strings } from '../../../Localization/translation';

export default function TCEventCard({
  onPress,
  data,
  owners,
  allUserData
}) {
  const authContext = useContext(AuthContext);
  const isGame = !!(data?.game_id && data?.game);
  const startDate = getJSDate(data.start_datetime);
  const [ownerDetails, setOwnerDetails] = useState({});

  const location =
    data?.location?.location_name ??
    data?.game?.venue?.address ??
    data?.game?.venue?.description ??
    '';
  const title = isGame ? getSportName(data.game, authContext) : data.title;

  useEffect(() => {
    owners.forEach(item => {
      if(item.user_id === data?.created_by?.uid) {
        setOwnerDetails(item);
      }
    });
  });


  const getUserFullName = () => {
    let name = '';
    allUserData.forEach((item) => {
      if(item.id === data.owner_id) {
        name = item.name
      }
    })
    return name;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.backgroundView}>
        <View>
          <ImageBackground 
          imageStyle={styles.imageBorder}
          source={data?.background_thumbnail
            ? {uri: data?.background_thumbnail}
            : images.backgroudPlaceholder} 
          resizeMode="cover" 
          style={styles.eventImage}>
               <Image
                  source={
                    images.threeDotIcon
                  }
                  style={{height: 20, width:4, alignSelf: 'flex-end', marginRight:15, marginTop:15}}
                />
              <View style={{height: 50}}/>
              <View style={styles.eventTitlewithDot}>
                <Text
                  style={styles.eventTitle}
                  numberOfLines={1}>
                  {title.toUpperCase()}
                </Text>
              </View>
          </ImageBackground>
        </View>
        <View style={styles.eventText}>
            <View style={styles.bottomView}>
                  <Text style={styles.eventTime}>{`${moment(startDate).format(
                  'ddd, MMM DD',
                )} - `}</Text>
                <Text style={styles.eventTime}>{`${moment(startDate).format(
                  'h:mma'
                )} `}</Text>
               
                <Text style={styles.eventTime}> | </Text>

                {
                data?.is_Offline ? (
                <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
                  {location}
                </Text>
                ):(
                  <Text style={{...styles.onlineText, flex: 1}}>
                  { strings.onlineText }
                </Text>
                )}
            </View>
            <View style={styles.bottomView}>
              <View style={styles.eventImageViewStyle}>
                <Image
                  source={
                    ownerDetails?.thumbnail ? {uri: ownerDetails?.thumbnail} : images.profilePlaceHolder
                  }
                  style={{height: 25, width: 25, borderRadius: 70}}
                />
              </View>
              <Text style={styles.ownerText}>{getUserFullName()}</Text>
            </View>
          </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
 
  imageBorder: { 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 7,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  eventText: {
    padding: 10,
    paddingVertical: 15,
    width: wp('83%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.darkBlackColor,
    fontFamily: fonts.RLight,
  },
  ownerText: {
    fontSize: 12,
    color: colors.darkBlackColor,
    fontFamily: fonts.RBold,
    marginLeft: 10
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    width: wp('70%'),
    color: colors.whiteColor,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 7,
  },
  eventTitlewithDot: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  onlineText:{
    color: colors.themeColor,
    fontWeight: '500'
  }
});
