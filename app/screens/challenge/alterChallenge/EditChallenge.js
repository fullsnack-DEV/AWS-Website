/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, {
  useEffect, useState, useContext, useCallback,
  } from 'react';
 import {
   StyleSheet,
   View,
   Text,
   Image,
   TouchableOpacity,
   Alert,
   FlatList,
  SafeAreaView,
} from 'react-native';
 import moment from 'moment';

 import { useIsFocused } from '@react-navigation/native';
 import {
   widthPercentageToDP as wp,
   heightPercentageToDP as hp,
 } from 'react-native-responsive-screen';
 import { parseInt } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
 import ChallengeHeaderView from '../../../components/challenge/ChallengeHeaderView';
 import GameFeeCard from '../../../components/challenge/GameFeeCard';
 import {
   getChallengeSetting,
   getFeesEstimation,
   createChallenge,
   updateChallenge,
 } from '../../../api/Challenge';

 import ActivityLoader from '../../../components/loader/ActivityLoader';

 import strings from '../../../Constants/String';
 import fonts from '../../../Constants/Fonts';
 import colors from '../../../Constants/Colors';
 import TCGradientButton from '../../../components/TCGradientButton';
 import TCKeyboardView from '../../../components/TCKeyboardView';
 import TCThickDivider from '../../../components/TCThickDivider';
 import images from '../../../Constants/ImagePath';
 import TCLabel from '../../../components/TCLabel';
 import AuthContext from '../../../auth/context';
 import TCChallengeTitle from '../../../components/TCChallengeTitle';
 import SecureRefereeView from '../../../components/SecureRefereeView';
 import { getNumberSuffix } from '../../../utils/gameUtils';
 import EventMapView from '../../../components/Schedule/EventMapView';
import TCSmallButton from '../../../components/TCSmallButton';
import { widthPercentageToDP } from '../../../utils';

 let entity = {};
 export default function EditChallenge({ navigation, route }) {
   const { sportName, groupObj } = route?.params;

   const authContext = useContext(AuthContext);
   const isFocused = useIsFocused();
   const [loading, setloading] = useState(false);
   const [totalZero, setTotalZero] = useState(false);
   const [feeObj, setFeeObj] = useState();
   const [venue, setVenue] = useState();

   const [startDate, setStartDate] = useState(
     new Date().setHours(new Date().getHours() + 1),
   );
   const [endDate, setEndDate] = useState(
     new Date().setHours(new Date().getHours() + 4),
   );

   const [challengeObj, setChallengeObj] = useState(route?.params?.challengeObj);

   const [teams, setteams] = useState([]);

  console.log('change challenge object:=>', route?.params?.challengeObj);

   useEffect(() => {
     if (route?.params?.selectedVenueObj) {
       setVenue(route?.params?.selectedVenueObj)
     }
     if (challengeObj?.venue?.length === 1) {
       setVenue(challengeObj?.venue?.[0])
     }
     }, [route?.params?.selectedVenueObj, challengeObj?.venue])

   useEffect(() => {
     entity = authContext.entity;
     if (groupObj) {
       setteams([{ ...entity.obj }, { ...groupObj }]);
     }
     if (challengeObj?.game_fee?.fee) {
       getFeeDetail();
     }
   }, [authContext.entity, groupObj, challengeObj?.game_fee?.fee]);

   useEffect(() => {
     console.log('useEffect Called');
     if (isFocused) {
       const settings = { ...challengeObj };
       if (route?.params?.gameType) {
         console.log('route?.params?.gameType', route?.params?.gameType);
         settings.game_type = route?.params?.gameType;
       }
       if (route?.params?.gameFee) {
         console.log('route?.params?.gameFee', route?.params?.gameFee);
         settings.game_fee = route?.params?.gameFee;
       }
       if (route?.params?.refundPolicy) {
         console.log('route?.params?.refundPolicy', route?.params?.refundPolicy);
         settings.refund_policy = route?.params?.refundPolicy;
       }
       if (route?.params?.homeAway) {
         settings.home_away = route?.params?.homeAway;
       }
       if (route?.params?.gameDuration) {
         settings.game_duration = route?.params?.gameDuration;
       }
       if (route?.params?.gameGeneralRules) {
         console.log(
           'route?.params?.gameGeneralRules',
           route?.params?.gameGeneralRules,
         );
         settings.general_rules = route?.params?.gameGeneralRules;
         settings.special_rules = route?.params?.gameSpecialRules;
       }
       if (route?.params?.refereeSetting) {
         settings.responsible_for_referee = route?.params?.refereeSetting;
       }
       if (route?.params?.scorekeeperSetting) {
         settings.responsible_for_scorekeeper = route?.params?.scorekeeperSetting;
       }

       setChallengeObj(settings);
     }
   }, [
     authContext.entity,
     groupObj,
     isFocused,
     route?.params?.gameDuration,
     route?.params?.gameFee,
     route?.params?.gameGeneralRules,
     route?.params?.gameSpecialRules,
     route?.params?.gameType,
     route?.params?.homeAway,
     route?.params?.refereeSetting,
     route?.params?.refundPolicy,
     route?.params?.scorekeeperSetting,
   ]);

   const renderPeriod = ({ item, index }) => (
     <>
       <TCChallengeTitle
         containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
         title={'Interval'}
         titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
         value={item.interval}
         valueStyle={{
           fontFamily: fonts.RBold,
           fontSize: 16,
           color: colors.greenColorCard,
           marginRight: 2,
         }}
         staticValueText={'min.'}
       />
       <TCChallengeTitle
         containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
         title={`${getNumberSuffix(index + 2)} Period`}
         titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
         value={item.period}
         valueStyle={{
           fontFamily: fonts.RBold,
           fontSize: 16,
           color: colors.greenColorCard,
           marginRight: 2,
         }}
         staticValueText={'min.'}
       />
     </>
   );

   const renderOverTime = ({ item, index }) => (
     <>
       <TCChallengeTitle
         containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
         title={'Interval'}
         titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
         value={item.interval}
         valueStyle={{
           fontFamily: fonts.RBold,
           fontSize: 16,
           color: colors.greenColorCard,
           marginRight: 2,
         }}
         staticValueText={'min.'}
       />
       <TCChallengeTitle
         containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
         title={`${getNumberSuffix(index + 1)} Over time`}
         titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
         value={item.overTime}
         valueStyle={{
           fontFamily: fonts.RBold,
           fontSize: 16,
           color: colors.greenColorCard,
           marginRight: 2,
         }}
         staticValueText={'min.'}
       />
     </>
   );

   const renderReferees = ({ item, index }) => (
     <SecureRefereeView
       entityName={
         item.responsible_to_secure_referee === 'challenger'
           ? teams[1]?.full_name ?? teams[1]?.group_name
           : teams[0]?.full_name ?? teams[0]?.group_name
       }
       entity={'Referee'}
       entityNumber={index + 1}
     />
   );

   const renderScorekeepers = ({ item, index }) => (
     <SecureRefereeView
       entityName={
         item.responsible_to_secure_scorekeeper === 'challenger'
           ? teams[1]?.full_name ?? teams[1]?.group_name
           : teams[0]?.full_name ?? teams[0]?.group_name
       }
       entity={'Scorekeeper'}
       entityNumber={index + 1}
     />
   );

   const getFeeDetail = () => {
     const feeBody = {};
     feeBody.challenge_id = challengeObj?.challenge_id;
     feeBody.payment_method_type = 'card';
     feeBody.currency_type = challengeObj?.game_fee?.currency_type?.toLowerCase();
     feeBody.total_game_fee = Number(challengeObj?.game_fee?.fee?.toString());
     setloading(true);
     getFeesEstimation(feeBody, authContext)
       .then((response) => {
         setFeeObj(response.payload);

         if (response.payload.total_game_fee === 0) {
           setTotalZero(true);
         }
         console.log('Body estimate fee:=>', response.payload);

         setloading(false);
       })
       .catch((e) => {
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };

   const updateChallengeDetail = () => {
     setloading(true);
    const body = { ...challengeObj, ...feeObj }
    const challengeID = body.challenge_id;
    // if (route?.params?.paymentMethod) {
    //   setDefaultCard(route?.params?.paymentMethod)
    // }
    delete body.created_at;
    delete body.created_by;
    delete body.entity_id;
    delete body.entity_type;
    delete body.offer_expiry;
    delete body.status;
    delete body.challenge_id;
    delete body.game_id;
    delete body.change_requested_by;
    delete body.updated_by;
    delete body.updated_at;
    delete body.version;
    delete body.reservations;

    // if(body?.home_away === 'Home'){
    //   const home_id =
    // }else{

    // }
    const home_id = body?.home_team?.group_id ?? body.home_team.user_id;
    const away_id = body?.away_team?.group_id ?? body.away_team.user_id;
    delete body.home_team;
    delete body.away_team;
    body.home_team = home_id;
    body.away_team = away_id;

    // if (defaultCard) {
    //   body.source = defaultCard.id;
    // }

    console.log('FINAL BODY PARAMS::', body);
    updateChallenge(challengeID, body, authContext)
      .then(() => {
        setloading(false);
        navigation.navigate('AlterRequestSent');
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

   return (
     <TCKeyboardView>
       <ActivityLoader visible={loading} />

       <View>

         <LinearGradient
                  colors={[colors.darkThemeColor, colors.themeColor]}
                  style={styles.containerStyle}>
           <Text style={styles.buttonText}>
             Please edit the reservation details below before you send the
             alteration request.
           </Text>
         </LinearGradient>

         <ChallengeHeaderView
           challenger={teams[1]}
           challengee={teams[0]}
           role={
             route?.params?.role === 'user' || route?.params?.role === 'player'
               ? 'user'
               : 'team'
           }
         />

         <TCThickDivider marginTop={15} />

         <View>
           <TCChallengeTitle
           title={'Home & Away'}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('HomeAway', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
           <View style={styles.teamContainer}>
             <Text style={styles.homeLableStyle}>Home</Text>
             <View style={styles.teamViewStyle}>
               <Image
               source={
                challengeObj?.home_away === 'Home'
                   ? authContext?.entity?.obj?.thumbnail
                     ? { uri: authContext?.entity?.obj?.thumbnail }
                     : authContext?.entity?.obj?.full_name
                     ? images.profilePlaceHolder
                     : images.teamPlaceholder
                   : groupObj?.thumbnail
                   ? { uri: groupObj?.thumbnail }
                   : groupObj?.full_name
                   ? images.profilePlaceHolder
                   : images.teamPlaceholder
               }
               style={styles.imageView}
             />

               <View style={styles.teamTextContainer}>
                 <Text style={styles.teamNameLable}>
                   {challengeObj?.home_away === 'Home'
                   ? authContext?.entity?.obj?.full_name
                     ?? authContext?.entity?.obj?.group_name
                   : groupObj?.full_name ?? groupObj?.group_name}
                 </Text>
                 <Text style={styles.locationLable}>
                   {challengeObj?.home_away === 'Home'
                   ? `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`
                   : `${groupObj?.city}, ${groupObj?.state_abbr}`}
                 </Text>
               </View>
             </View>
           </View>

           <View style={styles.teamContainer}>
             <Text style={styles.homeLableStyle}>Away</Text>
             <View style={styles.teamViewStyle}>
               <Image
               source={
                challengeObj?.home_away === 'Home'
                   ? groupObj?.thumbnail
                     ? { uri: groupObj?.thumbnail }
                     : groupObj?.full_name
                     ? images.profilePlaceHolder
                     : images.teamPlaceholder
                   : authContext?.entity?.obj?.thumbnail
                   ? { uri: authContext?.entity?.obj?.thumbnail }
                   : authContext?.entity?.obj?.full_name
                   ? images.profilePlaceHolder
                   : images.teamPlaceholder
               }
               style={styles.imageView}
             />

               <View style={styles.teamTextContainer}>
                 <Text style={styles.teamNameLable}>
                   {challengeObj?.home_away === 'Home'
                   ? groupObj?.full_name ?? groupObj?.group_name
                   : authContext?.entity?.obj?.full_name
                     ?? authContext?.entity?.obj?.group_name}
                 </Text>
                 <Text style={styles.locationLable}>
                   {challengeObj?.home_away === 'Home'
                   ? `${groupObj?.city}, ${groupObj?.state_abbr}`
                   : `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`}
                 </Text>
               </View>
             </View>
           </View>
           <TCThickDivider marginTop={20} />
         </View>

         <TCChallengeTitle
           title={'Game Duration'}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('GameDuration', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
         <TCChallengeTitle
           containerStyle={{ marginLeft: 25, marginTop: 15, marginBottom: 5 }}
           title={'1st period'}
           titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
           value={challengeObj?.game_duration?.first_period}
           valueStyle={{
             fontFamily: fonts.RBold,
             fontSize: 16,
             color: colors.greenColorCard,
             marginRight: 2,
           }}
           staticValueText={'min.'}
         />

         <FlatList
           data={challengeObj?.game_duration?.period}
           renderItem={renderPeriod}
           keyExtractor={(item, index) => index.toString()}
           style={{ marginBottom: 15 }}
         />
         {challengeObj?.game_duration?.period?.length > 0 && (
           <Text style={styles.normalTextStyle}>
             {strings.gameDurationTitle2}
           </Text>
         )}

         <FlatList
           data={challengeObj?.game_duration?.overtime}
           renderItem={renderOverTime}
           keyExtractor={(item, index) => index.toString()}
           style={{ marginBottom: 15 }}
         />
         <TCThickDivider marginTop={20} />

         <View>
           <TCChallengeTitle title={'Date & Time'}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('ChooseTimeSlotScreen');
           }}/>

           <View>
             <View style={styles.dateTimeValue}>
               <Text style={styles.dateTimeText}>Start </Text>
               <Text style={styles.dateTimeText}>
                 {moment(startDate).format('MMM DD, YYYY hh:mm a')}
               </Text>
             </View>
             <View style={styles.dateTimeValue}>
               <Text style={styles.dateTimeText}>End </Text>
               <Text style={styles.dateTimeText}>
                 {moment(endDate).format('MMM DD, YYYY hh:mm a')}
               </Text>
             </View>
             <View style={styles.dateTimeValue}>
               <Text style={styles.dateTimeText}> </Text>
               <Text style={styles.timeZoneText}>
                 Time zone{' '}
                 <Text style={{ fontFamily: fonts.RRegular }}>Vancouver</Text>
               </Text>
             </View>
           </View>

           {/* <TouchableOpacity
             onPress={() => {
               navigation.navigate('ChooseTimeSlotScreen');
             }}>
             <View style={[styles.borderButtonView, styles.shadowView]}>
               <View />
               <Text style={styles.detailButtonText}>{'CHOOSE DATE & TIME'}</Text>
               <Image
                 source={images.arrowGraterthan}
                 style={styles.arrowImage}
               />
             </View>
           </TouchableOpacity> */}
           <TCThickDivider marginTop={10} />
         </View>

         <View>
           <TCChallengeTitle title={'Venue'}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('ChooseVenueScreen', {
               venues: challengeObj?.venue || [],
               comeFrom: 'EditChallenge',
             });
           }}
            />

           <View style={styles.venueContainer}>
             <Text style={styles.venueTitle}>
               {challengeObj?.venue?.name}
             </Text>
             <Text style={styles.venueAddress}>
               {challengeObj?.venue?.address}
             </Text>

             <EventMapView
                 coordinate={challengeObj?.venue?.coordinate }
                 region={challengeObj?.venue?.region}
                 style={styles.map}
               />
           </View>

           <TCThickDivider marginTop={10} />
         </View>

         <TCChallengeTitle
           title={'Type of Game'}
           value={challengeObj?.game_type}
           tooltipText={
           'The game result has an effect on TC points of the challengee and you.'
           }
           tooltipHeight={hp('6%')}
           tooltipWidth={wp('50%')}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('GameType', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
         <TCThickDivider />

         <TCChallengeTitle
           title={'Game Fee'}
           value={challengeObj?.game_fee?.fee}
           staticValueText={`${challengeObj?.game_fee?.currency_type} /Game`}
           valueStyle={{
             fontFamily: fonts.RBold,
             fontSize: 16,
             color: colors.greenColorCard,
             marginRight: 2,
           }}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('GameFee', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
         <TCThickDivider />

         <TCChallengeTitle
           title={'Game Rules'}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('GameRules', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
         <Text style={styles.rulesTitle}>General Rules</Text>
         <Text style={styles.rulesDetail}>{challengeObj?.general_rules}</Text>
         <View style={{ marginBottom: 10 }} />
         <Text style={styles.rulesTitle}>Special Rules</Text>
         <Text style={styles.rulesDetail}>{challengeObj?.special_rules}</Text>
         <TCThickDivider marginTop={20} />

       </View>

       <View>

         <TCChallengeTitle
           title={'Referees'}
           value={challengeObj?.responsible_for_referee?.who_secure?.length}
           staticValueText={'Referees'}
           valueStyle={{
             fontFamily: fonts.RBold,
             fontSize: 16,
             color: colors.greenColorCard,
             marginRight: 2,
           }}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('RefereesSetting', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />

         <FlatList
           data={challengeObj?.responsible_for_referee?.who_secure}
           renderItem={renderReferees}
           keyExtractor={(item, index) => index.toString()}
           ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
           style={{ marginBottom: 15 }}
         />

         <TCThickDivider marginTop={20} />

         <TCChallengeTitle
           title={'Scorekeepers'}
           value={challengeObj?.responsible_for_scorekeeper?.who_secure?.length}
           staticValueText={'Scorekeepers'}
           valueStyle={{
             fontFamily: fonts.RBold,
             fontSize: 16,
             color: colors.greenColorCard,
             marginRight: 2,
           }}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('ScorekeepersSetting', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
         <FlatList
           data={challengeObj?.responsible_for_scorekeeper?.who_secure}
           renderItem={renderScorekeepers}
           keyExtractor={(item, index) => index.toString()}
           ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
           style={{ marginBottom: 15 }}
         />
         <TCThickDivider marginTop={20} />

         {!totalZero && (
           <View>
             <TCLabel title={'Income'} style={{ marginBottom: 15 }} />
             <GameFeeCard
               feeObject={feeObj}
               currency={challengeObj?.game_fee?.currency_type}
               isChallenger={false}
             />
             <TCThickDivider marginTop={20} />
           </View>
         )}
       </View>

       {/* <TCGradientButton
         title={strings.sendAlterRequest}
         onPress={() => {
           // navigation.push('ChallengePaymentScreen');
           // navigation.push('InviteToChallengeSentScreen');
           sendChallengeInvitation();
         }}
         outerContainerStyle={{
           marginBottom: 45,
           width: '92%',
           alignSelf: 'center',
           marginTop: 15,
         }}
       /> */}
       <TCChallengeTitle
           title={'Refund Policy'}
           value={challengeObj?.refund_policy}
           tooltipText={
           '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
           }
           tooltipHeight={hp('18%')}
           tooltipWidth={wp('50%')}
           isEdit={true}
           onEditPress={() => {
             navigation.navigate('RefundPolicy', {
               settingObj: challengeObj,
               comeFrom: 'EditChallenge',
               sportName,
             });
           }}
         />
       <TCThickDivider />
       <SafeAreaView>
         <View
          style={styles.bottomButtonView}>

           <TCGradientButton
         title={strings.sendAlterRequest}
         onPress={() => {
           // navigation.push('ChallengePaymentScreen');
           // navigation.push('InviteToChallengeSentScreen');
           updateChallengeDetail()
         }}
         outerContainerStyle={{

           width: '92%',
           alignSelf: 'center',

         }}
       />
           <TCSmallButton
            isBorderButton={true}
            borderstyle={{
              borderColor: colors.themeColor,
              borderWidth: 1,
              borderRadious: 80,
            }}
            textStyle={{ color: colors.themeColor }}
            title={strings.cancelTitle}
            onPress={() => {
              navigation.popToTop();
            }}

            style={{
              width: widthPercentageToDP('92%'),
              alignSelf: 'center',
            }}
          />

         </View>
       </SafeAreaView>
     </TCKeyboardView>
   );
 }

 const styles = StyleSheet.create({
   teamContainer: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     marginLeft: 15,
     marginRight: 15,
   },
   homeLableStyle: {
     flex: 0.14,
     margin: 15,
     marginRight: 20,
     fontFamily: fonts.RRegular,
     fontSize: 16,
     color: colors.lightBlackColor,
   },
   teamViewStyle: {
     flex: 0.86,
     flexDirection: 'row',
     alignItems: 'center',
   },

   imageView: {
     height: 40,
     width: 40,
     resizeMode: 'cover',
     borderRadius: 20,
     shadowColor: colors.googleColor,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.4,
     shadowRadius: 1,
   },

   teamNameLable: {
     fontFamily: fonts.RMedium,
     fontSize: 16,
     color: colors.lightBlackColor,
   },
   locationLable: {
     fontFamily: fonts.RLight,
     fontSize: 14,
     color: colors.lightBlackColor,
   },
   teamTextContainer: {
     marginLeft: 20,
   },

   venueTitle: {
     fontFamily: fonts.RMedium,
     fontSize: 16,
     color: colors.lightBlackColor,

     marginBottom: 5,
   },
   rulesTitle: {
     fontFamily: fonts.RMedium,
     fontSize: 16,
     color: colors.lightBlackColor,
     marginLeft: 15,
     marginBottom: 5,
   },
   dateTimeText: {
     fontFamily: fonts.RRegular,
     fontSize: 16,
     color: colors.lightBlackColor,
     marginLeft: 15,
     marginBottom: 5,
   },
   timeZoneText: {
     fontFamily: fonts.RLight,
     fontSize: 14,
     color: colors.lightBlackColor,
   },
   rulesDetail: {
     fontFamily: fonts.RRegular,
     fontSize: 16,
     color: colors.lightBlackColor,
     marginLeft: 15,
     marginRight: 15,
   },

   normalTextStyle: {
     marginLeft: 25,
     fontSize: 16,
     fontFamily: fonts.RRegular,
     color: colors.lightBlackColor,
   },
   dateTimeValue: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     margin: 25,
     marginBottom: 10,
     marginLeft: 15,
     marginTop: 0,
   },

   venueAddress: {
     fontFamily: fonts.RRegular,
     fontSize: 16,
     color: colors.lightBlackColor,
   },
   venueContainer: {
     marginLeft: 15,
     marginRight: 15,
   },
   containerStyle: {
    height: 61,
    justifyContent: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginRight: 15,
  },
  bottomButtonView: {
    marginTop: 15,
    marginBottom: 15,
    height: 95,
    justifyContent: 'space-between',
  },
 });
