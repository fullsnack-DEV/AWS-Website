import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback, ImageBackground} from 'react-native';
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
  // entity,
}) {
  const authContext = useContext(AuthContext);

  const isGame = !!(data?.game_id && data?.game);

  const startDate = getJSDate(data.start_datetime);

  const location =
    data?.location?.location_name ??
    data?.game?.venue?.address ??
    data?.game?.venue?.description ??
    '';
  const title = isGame ? getSportName(data.game, authContext) : data.title;

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
             <View style={{height: 100}}/>
          </ImageBackground>
        </View>
        <View style={styles.eventText}>
          <View style={styles.eventTitlewithDot}>
            <View>
              <Text
                style={styles.eventTitle}
                numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.bottomView}>
                  <Text style={styles.eventTime}>{`${moment(startDate).format(
                  'ddd, MMM DD',
                )} - `}</Text>
                <Text style={styles.eventTime}>{`${moment(startDate).format(
                  'h:mma'
                )} `}</Text>
               {data?.going?.length && (
                <>
                  <Text style={styles.eventTime}> | </Text>
                  <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
                    {' '}
                    {data?.going?.length ?? 0}
                    {strings.going}
                  </Text>
                </>
                )}
                
                {location !== '' && (
                  <Text style={styles.eventTime}> | </Text>
                )}
                <Text numberOfLines={1} style={{...styles.eventTime, flex: 1}}>
                  {location !== '' && location}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  eventImage:{
    flex: 1
  },
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
    shadowRadius: 5,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  eventText: {
    padding: 10,
    width: wp('83%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.darkBlackColor,
    fontFamily: fonts.RLight,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    width: wp('70%'),
    color: colors.darkBlackColor,
  },
  eventTitlewithDot: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
