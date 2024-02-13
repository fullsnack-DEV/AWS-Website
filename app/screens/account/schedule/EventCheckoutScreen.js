import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {formatCurrency} from 'country-currency-map';
import {format} from 'react-string-format';
import ReadMore from '@fawazahmed/react-native-read-more';
import moment from 'moment';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import EventBackgroundPhoto from '../../../components/Schedule/EventBackgroundPhoto';
import colors from '../../../Constants/Colors';
import TCProfileView from '../../../components/TCProfileView';
import Verbs from '../../../Constants/Verbs';
import TCThinDivider from '../../../components/TCThinDivider';
import {strings} from '../../../../Localization/translation';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import AuthContext from '../../../auth/context';
import {
  countNumberOfWeekFromDay,
  getDayFromDate,
  getJSDate,
  ordinal_suffix_of,
} from '../../../utils';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';

export default function EventCheckoutScreen({route, navigation}) {
  const [eventData] = useState(route?.params?.data ?? {});
  const [organizer] = useState(route.params?.organizer ?? false);
  const [loading] = useState(false);
  const authContext = useContext(AuthContext);
  const [snapPoints, setSnapPoints] = useState([]);
  const [infoModal, setInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('');
  const isOrganizer = eventData.owner_id === authContext.entity.uid;

  const getOrganizerProfile = (data = {}) => {
    if (data?.thumbnail) {
      return {uri: data.thumbnail};
    }
    if (data.entity_type === Verbs.entityTypeTeam) {
      return images.teamPH;
    }
    if (data.entity_type === Verbs.entityTypeClub) {
      return images.newClubLogo;
    }
    return images.profilePlaceHolder;
  };
  let repeatString = strings.never;

  let startTime = '';
  let endTime = '';
  let untilTime = '';

  if (eventData) {
    if (eventData.start_datetime) {
      startTime = getJSDate(eventData.start_datetime);
    }
    if (eventData.end_datetime) {
      endTime = getJSDate(eventData.end_datetime);
    }
    if (eventData.untilDate) {
      untilTime = getJSDate(eventData.untilDate);
    }
    if (eventData.repeat === Verbs.eventRecurringEnum.Daily) {
      repeatString = strings.daily;
    } else if (eventData.repeat === Verbs.eventRecurringEnum.Weekly) {
      repeatString = strings.weekly;
    } else if (eventData.repeat === Verbs.eventRecurringEnum.WeekOfMonth) {
      repeatString = format(
        strings.monthlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.DayOfMonth) {
      repeatString = format(
        strings.monthlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.WeekOfYear) {
      repeatString = format(
        strings.yearlyOnText,
        `${countNumberOfWeekFromDay(startTime)} ${getDayFromDate(startTime)}`,
      );
    } else if (eventData.repeat === Verbs.eventRecurringEnum.DayOfYear) {
      repeatString = format(
        strings.yearlyOnDayText,
        ordinal_suffix_of(startTime.getDate()),
      );
    }

    if (eventData.repeat !== Verbs.eventRecurringEnum.Never) {
      if (untilTime) {
        repeatString = format(
          strings.repeatTime,
          repeatString,
          moment(untilTime).format('MMM DD, YYYY hh:mm a'),
        );
      }
    }
  }

  const clickInfoIcon = (type) => {
    setInfoType(type);
    setInfoModal(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={'Book Event'}
        leftIcon={images.backArrow}
        leftIconPress={() =>
          navigation.navigate('EventScreen', {
            data: eventData,
          })
        }
      />
      <ScrollView style={{marginBottom: 20, flex: 1}}>
        <View
          style={{
            marginLeft: 15,
          }}>
          <Text
            style={{
              fontFamily: fonts.RMedium,
              fontSize: 20,
              lineHeight: 30,
              marginTop: 20,
            }}>
            {strings.reviewEventDetailText}
          </Text>
        </View>
        <View style={{marginHorizontal: 15, marginTop: 20}}>
          <EventBackgroundPhoto
            isEdit={!!eventData.background_thumbnail}
            isPreview={true}
            isImage={!!eventData.background_thumbnail}
            imageURL={{uri: eventData?.background_thumbnail}}
          />
        </View>
        <Text style={styles.eventTitleStyle}>{eventData.title}</Text>

        {organizer && !loading && (
          <View style={{marginLeft: 15}}>
            <TCProfileView
              type="medium"
              name={organizer.group_name ?? organizer.full_name ?? ''}
              location={`${organizer.city ?? ''}, ${
                organizer.state_abbr ? organizer.state_abbr : ''
              }${organizer.state_abbr ? ',' : ''} ${organizer.country ?? ''}`}
              image={getOrganizerProfile(organizer)}
              alignSelf={'flex-start'}
              marginTop={10}
              profileImageStyle={{width: 40, height: 40}}
              profileContainerStyle={{
                marginRight: 10,
              }}
            />

            <Image source={images.starProfile} style={styles.starProfile} />
          </View>
        )}

        {/* divider */}
        <TCThinDivider marginTop={25} marginBottom={15} />
        {}
        <View style={styles.containerStyle}>
          <Text style={styles.headerTextStyle}>{strings.about}</Text>
          <ReadMore
            numberOfLines={3}
            style={styles.longTextStyle}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeLessStyle={styles.moreLessText}
            seeMoreStyle={styles.moreLessText}>
            {eventData.descriptions}
          </ReadMore>
        </View>

        <TCThinDivider marginTop={15} height={7} width={'100%'} />

        <EventItemRender title={strings.venue}>
          {eventData.is_Offline ? (
            <>
              <Text style={[styles.textValueStyle, {fontFamily: fonts.RBold}]}>
                {eventData.location?.venue_name}
              </Text>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {eventData.location?.location_name}
              </Text>

              <Text style={[styles.textValueStyle, {marginTop: 10}]}>
                {eventData.location?.venue_detail}
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.textValueStyle,
                eventData.online_url && styles.textUrl,
              ]}>
              {eventData.online_url
                ? eventData.online_url
                : strings.emptyEventUrl}
            </Text>
          )}
        </EventItemRender>

        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />

        <View style={styles.containerStyle}>
          <Text style={styles.headerTextStyle}>{strings.timeText}</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}>
            <View>
              <Text style={styles.textValueStyle}>{strings.starts}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {`${moment(startTime).format('MMM DD, YYYY')}`}
              </Text>
              <Text
                style={[
                  styles.textValueStyle,
                  {fontFamily: fonts.RRegular, marginLeft: 25},
                ]}>{`${moment(startTime).format('hh:mm a')}`}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}>
            <View>
              <Text style={styles.textValueStyle}>{strings.ends}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
                {`${moment(endTime).format('MMM DD, YYYY')}`}
              </Text>
              <Text
                style={[
                  styles.textValueStyle,
                  {fontFamily: fonts.RRegular, marginLeft: 25},
                ]}>{`${moment(endTime).format('hh:mm a')}`}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
            }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                color: colors.lightBlackColor,
                fontFamily: fonts.RLight,
              }}>
              {strings.timezone} &nbsp;
            </Text>
            <TouchableOpacity
              onPress={() => {
                //   Alert.alert(strings.timezoneAvailability);
              }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  color: colors.lightBlackColor,
                  fontFamily: fonts.RRegular,
                  textDecorationLine: 'underline',
                }}>
                {Intl.DateTimeFormat()
                  ?.resolvedOptions()
                  .timeZone.split('/')
                  .pop()}
              </Text>
            </TouchableOpacity>
          </View>

          <TCThinDivider marginTop={25} />

          {isOrganizer && (
            <>
              <View style={[styles.divider, {marginVertical: 15}]} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.textValueStyle}>{strings.repeat}</Text>
                <Text
                  style={[
                    styles.textValueStyle,
                    {fontFamily: fonts.RRegular, textAlign: 'right'},
                  ]}>
                  {repeatString}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                  marginTop: 25,
                }}>
                <View
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={
                      !eventData.blocked ? images.roundTick : images.roundCross
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text
                  style={[
                    styles.textValueStyle,
                    {
                      color: !eventData.blocked
                        ? colors.greeColor
                        : colors.veryLightBlack,
                      fontFamily: fonts.RRegular,
                    },
                  ]}>
                  {!eventData.blocked
                    ? strings.available
                    : strings.blockedForChallenge}
                </Text>
              </View>
            </>
          )}
        </View>
        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />
        <EventItemRender
          title={strings.eventFee}
          clickInfoIcon={clickInfoIcon}
          type={'fee'}>
          <Text style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
            {`${formatCurrency(
              parseFloat(eventData.event_fee?.value).toFixed(2),
              eventData.event_fee?.currency_type,
            )} ${eventData.event_fee?.currency_type}`}
          </Text>
        </EventItemRender>
        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />
        <EventItemRender
          title={strings.numberAttend}
          icon={images.infoIcon}
          clickInfoIcon={clickInfoIcon}
          type={'attendee'}>
          <Text style={[styles.textValueStyle, {fontFamily: fonts.RRegular}]}>
            {format(
              strings.minMaxText_dy,
              `${
                eventData.min_attendees === 0 ? '-' : eventData.min_attendees
              }   `,
              `${
                eventData.max_attendees === 0 ? '-' : eventData.max_attendees
              }`,
            )}
          </Text>
        </EventItemRender>
        <TCThinDivider
          marginTop={25}
          marginBottom={25}
          height={7}
          width={'100%'}
        />
        {/* Checkout button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BookEventScreen', {
              data: eventData,
            })
          }
          style={{
            marginTop: 25,
            backgroundColor: colors.reservationAmountColor,
            marginHorizontal: 15,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RBold,
              lineHeight: 24,
              alignSelf: 'center',
              marginVertical: 8,
              color: colors.whiteColor,
            }}>
            {eventData?.eventFee > 0
              ? ' Continue to Checkout'
              : 'Complete Booking'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomModalWrapper
        isVisible={infoModal}
        modalType={ModalTypes.style2}
        closeModal={() => {
          setInfoModal(false);
        }}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;

            setSnapPoints([
              // '50%',
              contentHeight,
              contentHeight,
              // Dimensions.get('window').height - 40,
            ]);
          }}>
          {infoType === Verbs.attendeeVerb ? (
            <View>
              <Text style={styles.titleText}>{strings.numberOfAttend}</Text>
              <Text style={styles.contentText}>{strings.attendyText}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.titleText}>{strings.eventFeeTitle}</Text>
              <Text style={styles.contentText}>{strings.feeText}</Text>
            </View>
          )}
        </View>
      </CustomModalWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eventTitleStyle: {
    fontSize: 25,
    lineHeight: 35,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  textValueStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  textUrl: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  starProfile: {
    width: 15,
    height: 15,
    position: 'absolute',
    left: 26,
    bottom: 0,
  },
  headerTextStyle: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  containerStyle: {
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: colors.blackColor,
    fontFamily: fonts.RBold,
  },
  contentText: {
    color: colors.blackColor,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
  },
});
