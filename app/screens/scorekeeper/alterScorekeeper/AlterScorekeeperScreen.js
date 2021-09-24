import React, {
  useEffect, useState, useContext, useLayoutEffect,
  } from 'react';
 import {
   StyleSheet,
   View,
   Text,
   Image,
   Alert,
   TouchableOpacity,
   SafeAreaView,
 } from 'react-native';
 import moment from 'moment';
 import { useIsFocused } from '@react-navigation/native';
 import LinearGradient from 'react-native-linear-gradient';
 // eslint-disable-next-line no-unused-vars
 import _ from 'lodash';

 import {
   acceptDeclineAlterReservation,
   acceptDeclineReservation,
   getEntityFeesEstimation,
   updateReservation,
   cancelAlterReservation,
 } from '../../../api/Challenge';
 import * as Utility from '../../../utils';

 import { paymentMethods } from '../../../api/Users';
 import ActivityLoader from '../../../components/loader/ActivityLoader';
 import strings from '../../../Constants/String';
 import fonts from '../../../Constants/Fonts';
 import colors from '../../../Constants/Colors';
 import AuthContext from '../../../auth/context';
 import TCGradientButton from '../../../components/TCGradientButton';
 import TCKeyboardView from '../../../components/TCKeyboardView';
 import TCThickDivider from '../../../components/TCThickDivider';
 import images from '../../../Constants/ImagePath';
 import TCLabel from '../../../components/TCLabel';
 import TCInfoField from '../../../components/TCInfoField';
 import EventMapView from '../../../components/Schedule/EventMapView';
 import TCBorderButton from '../../../components/TCBorderButton';
 import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
 import ReservationNumber from '../../../components/reservations/ReservationNumber';
 import GameStatus from '../../../Constants/GameStatus';
 import TCGameCard from '../../../components/TCGameCard';
 import {
   getGameFromToDateDiff,
   getGameHomeScreen,
 } from '../../../utils/gameUtils';
 import ScorekeeperReservationStatus from '../../../Constants/ScorekeeperReservationStatus';
 import { getHitSlop, heightPercentageToDP, widthPercentageToDP } from '../../../utils';
 import TCTabView from '../../../components/TCTabView';
 import CurruentScorekeeperReservationView from './CurruentScorekeeperReservationView';
 import TCChallengeTitle from '../../../components/TCChallengeTitle';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import ScorekeeperReservationTitle from '../../../components/reservations/ScorekeeperReservationTitle';

 let entity = {};
 const scroll = React.createRef();
 export default function AlterScorekeeperScreen({ navigation, route }) {
   const authContext = useContext(AuthContext);
   const isFocused = useIsFocused();
   const [loading, setloading] = useState(false);
   const [homeTeam, setHomeTeam] = useState();
   const [awayTeam, setAwayTeam] = useState();
   const [bodyParams, setbodyParams] = useState();
   const [paymentCard, setPaymentCard] = useState();
   const [editRules, setEditRules] = useState(false);
   const [editVenue, setEditVenue] = useState(false);
   const [editScorekeeper, setEditScoreKeeper] = useState(false);
   const [oldVersion, setOldVersion] = useState();
   const [editInfo, setEditInfo] = useState(false);
   const [editPayment, setEditPayment] = useState(false);
   const [isPendingRequestPayment, setIsPendingRequestPayment] = useState();
   const [isOld, setIsOld] = useState(false);
   const [defaultCard, setDefaultCard] = useState();
   const [maintabNumber, setMaintabNumber] = useState(0);

   useLayoutEffect(() => {
     navigation.setOptions({
       title: 'Scorekeeper Reservation',
     });
   }, [navigation, bodyParams]);
   useEffect(() => {
     entity = authContext.entity;

     const { reservationObj } = route.params ?? {};
     if (reservationObj.length > 0) {
       setIsPendingRequestPayment(true);
       for (let i = 0; i < reservationObj.length; i++) {
         if (reservationObj[i].status === ScorekeeperReservationStatus.accepted) {
           if (isOld === false) {
             setbodyParams(reservationObj[0]);
             setOldVersion(reservationObj[i]);
             setIsOld(true);
           } else {
             setbodyParams(reservationObj[0]);
           }

           if (
             (reservationObj[0]?.game?.away_team?.group_id
               ?? reservationObj[0]?.game?.away_team?.user_id) === entity.uid
           ) {
             setHomeTeam(reservationObj[0]?.game?.away_team);
             setAwayTeam(reservationObj[0]?.game?.home_team);
           } else {
             setHomeTeam(reservationObj[0]?.game?.home_team);
             setAwayTeam(reservationObj[0]?.game?.away_team);
           }
           break;
         }
       }
       if (!paymentCard) {
         setPaymentCard({
           start_datetime: reservationObj[0]?.start_datetime,
           end_datetime: reservationObj[0]?.end_datetime,
           currency_type: reservationObj[0]?.currency_type,
           payment_method_type: reservationObj[0]?.payment_method_type,
           total_game_fee: reservationObj[0]?.total_game_fee,
           total_service_fee1: reservationObj[0]?.total_service_fee1,
           total_service_fee2: reservationObj[0]?.total_service_fee2,
           total_amount: reservationObj[0]?.total_amount,
           total_stripe_fee: reservationObj[0]?.total_stripe_fee,
           total_payout: reservationObj[0]?.total_payout,
           hourly_game_fee: reservationObj[0]?.hourly_game_fee,
           manual_fee: reservationObj[0]?.manual_fee,
         });
       }
       console.log('challenge Object::', reservationObj[0]);

       console.log('Payment Object::', paymentCard);
     } else {
       if (isOld === false) {
         setbodyParams(reservationObj);
         // oldVersion = { ...body };
         setOldVersion(reservationObj);
         setIsOld(true);
       } else {
         setbodyParams(reservationObj);
       }

       if (
         (reservationObj?.game?.away_team?.group_id
           ?? reservationObj?.game?.away_team?.user_id) === entity.uid
       ) {
         setHomeTeam(reservationObj?.game?.away_team);
         setAwayTeam(reservationObj?.game?.home_team);
       } else {
         setHomeTeam(reservationObj?.game?.home_team);
         setAwayTeam(reservationObj?.game.away_team);
       }
       if (!paymentCard) {
         setPaymentCard({
           start_datetime: reservationObj?.start_datetime,
           end_datetime: reservationObj?.end_datetime,
           currency_type: reservationObj?.currency_type,
           payment_method_type: reservationObj?.payment_method_type,
           total_game_fee: reservationObj?.total_game_fee,
           total_service_fee1: reservationObj?.total_service_fee1,
           total_service_fee2: reservationObj?.total_service_fee1,
           total_amount: reservationObj?.total_amount,
           total_stripe_fee: reservationObj?.total_stripe_fee,
           total_payout: reservationObj?.total_payout,
           hourly_game_fee: reservationObj?.hourly_game_fee,
           manual_fee: reservationObj?.manual_fee,
         });
       }
       console.log('challenge Object::', reservationObj);

       console.log('Payment Object::', paymentCard);
     }

     getPaymentMethods();
   }, [isFocused]);

   useLayoutEffect(() => {
     sectionEdited();
   }, [
     bodyParams,
     isOld,
     editVenue,
     editRules,
     editScorekeeper,
     editInfo,
   ]);

   const sectionEdited = () => {
     if (bodyParams && oldVersion) {
       if (bodyParams.special_rule !== oldVersion.special_rule) {
         setEditRules(true);
       } else {
         setEditRules(false);
       }
       // console.log('OLD:', oldVersion.responsible_to_secure_venue);
       // console.log('NEW:', bodyParams.responsible_to_secure_venue);
       if (
         bodyParams.responsible_to_secure_venue
         !== oldVersion.responsible_to_secure_venue
       ) {
         setEditVenue(true);
       } else {
         setEditVenue(false);
       }

       if (bodyParams.scorekeeper !== oldVersion.scorekeeper) {
         setEditScoreKeeper(true);
       } else {
         setEditScoreKeeper(false);
       }
       if (
         bodyParams?.home_team?.group_id !== oldVersion?.home_team?.group_id
         || bodyParams?.home_team?.user_id !== oldVersion?.home_team?.user_id
         || bodyParams?.away_team?.group_id !== oldVersion?.away_team?.group_id
         || bodyParams?.away_team?.user_id !== oldVersion?.away_team?.user_id
         || bodyParams?.start_datetime !== oldVersion?.start_datetime
         || bodyParams?.end_datetime !== oldVersion?.end_datetime
         || bodyParams?.venue?.address !== oldVersion?.venue?.address
       ) {
         setEditInfo(true);
       } else {
         setEditInfo(false);
       }
       if (
         bodyParams.total_game_charges !== oldVersion.total_game_charges
         || bodyParams.manual_fee !== oldVersion.manual_fee
       ) {
         setEditPayment(true);
         getFeesEstimationDetail();
       } else {
         setEditPayment(false);
       }
     }
   };

   const getFeesEstimationDetail = () => {
     const body = {};
     // parseFloat((bodyParams.start_datetime / 1000).toFixed(0)

     body.reservation_id = bodyParams.reservation_id;
     body.start_datetime = bodyParams?.start_datetime;
     body.end_datetime = bodyParams?.end_datetime;
     body.currency_type = bodyParams?.currency_type || 'CAD';
     body.payment_method_type = 'card';
     body.sport = bodyParams?.sport;
     body.manual_fee = bodyParams?.manual_fee;
     if (bodyParams?.manual_fee) {
       body.total_game_fee = bodyParams.total_game_fee;
     }

     setloading(true);
     getEntityFeesEstimation(
       'scorekeepers',
       bodyParams?.scorekeeper?.user_id,
       body,
       authContext,
     )
       .then((response) => {
         setloading(false);
         console.log('fee data :', response.payload);
         setPaymentCard({
           ...paymentCard,
           total_game_fee: response.payload.total_game_fee,
           total_amount: response.payload.total_amount,
           total_payout: response.payload.total_payout,
           total_service_fee1: response.payload.total_service_fee1,
           total_service_fee2: response.payload.total_service_fee2,
           total_stripe_fee: response.payload.total_stripe_fee,
           hourly_game_fee: bodyParams.hourly_game_fee,
           manual_fee: bodyParams.manual_fee,
         });
       })
       .catch((e) => {
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };

   const cancelAlterReservationOperation = (
     reservationId,
     callerID,
     versionNo,
   ) => {
     setloading(true);
     cancelAlterReservation(
       'scorekeepers',
       reservationId,
       callerID,
       versionNo,
       authContext,
     )
       .then((response) => {
         setloading(false);
         console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
         navigation.push('ScorekeeperRequestSent', {
           operationType: strings.reservationRequestCancelled,
           imageAnimation: false,
         });
       })
       .catch((e) => {
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };

   const acceptDeclineReservationOperation = (
     reservationId,
     callerID,
     versionNo,
     status,
     isRestored = false,
   ) => {
     setloading(true);
     acceptDeclineReservation(
       'scorekeepers',
       reservationId,
       callerID,
       versionNo,
       status,
       {},
       authContext,
     )
       .then((response) => {
         setloading(false);
         console.log('ACCEPT RESPONSE::', response.payload);

         if (status === 'accept') {
           navigation.navigate('ReservationAcceptDeclineScreen', {
             teamObj: {
               ...getOpponentEntity(bodyParams),
               game_id: bodyParams?.game_id,
               sport: bodyParams?.sport,
             },
             status: 'accept',
           });
         } else if (status === 'decline') {
           if (isRestored) {
             navigation.navigate('ReservationAcceptDeclineScreen', {
               teamObj: getOpponentEntity(bodyParams),
               status: 'restored',
             });
           } else {
             navigation.navigate('ReservationAcceptDeclineScreen', {
               teamObj: getOpponentEntity(bodyParams),
               status: 'decline',
             });
           }
         } else if (status === 'cancel') {
           navigation.navigate('ReservationAcceptDeclineScreen', {
             teamObj: getOpponentEntity(bodyParams),
             status: 'cancel',
           });
         }
       })
       .catch((e) => {
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };

   const acceptDeclineAlterReservationOperation = (
     reservationId,
     callerID,
     versionNo,
     status,
     paymentID,
   ) => {
     setloading(true);

     acceptDeclineAlterReservation(
       'scorekeepers',
       reservationId,
       callerID,
       versionNo,
       status,
       paymentID && { source: paymentID },
       authContext,
     )
       .then((response) => {
         setloading(false);
         console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));

         if (status === 'accept') {
           navigation.navigate('ReservationAcceptDeclineScreen', {
             teamObj: {
               ...getOpponentEntity(bodyParams),
               game_id: bodyParams?.game_id,
               sport: bodyParams?.sport,
             },
             status: 'accept',
           });
         } else if (status === 'decline') {
           navigation.navigate('ReservationAcceptDeclineScreen', {
             teamObj: getOpponentEntity(bodyParams),
             status: 'decline',
           });
         } else if (status === 'cancel') {
           navigation.navigate('ReservationAcceptDeclineScreen', {
             teamObj: getOpponentEntity(bodyParams),
             status: 'cancel',
           });
         }
       })
       .catch((e) => {
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };

   const getRequester = (param) => {
     if (entity.uid === param?.scorekeeper?.user_id) {
       if (
         param?.initiated_by
         === (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
       ) {
         return param?.game?.home_team;
       }
       return param?.game?.away_team;
     }
     if (
       entity.uid
       === (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
     ) {
       return param?.game?.home_team;
     }
     return param?.game?.away_team;
   };

   const getPaymentMethods = () => {
     setloading(true);
     paymentMethods(authContext)
       .then((response) => {
         console.log('source ID:', bodyParams?.source);
         console.log('payment method', response.payload);
         for (const tempCard of response?.payload) {
           if (tempCard?.id === bodyParams?.source) {
             setDefaultCard(response?.payload?.card);
             break;
           }
         }

         // setCards([...response.payload])
         setloading(false);
         // if (response.payload.length === 0) {
         //   openNewCardScreen();
         // }
       })
       .catch((e) => {
         console.log('error in payment method', e);
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };
   const checkSenderForPayment = (reservationObj) => {
     if (reservationObj?.scorekeeper?.user_id === entity.uid) {
       return 'receiver';
     }

     return 'sender';
   };

   const checkSenderOrReceiver = (reservationObj) => {
     const teampObj = { ...reservationObj };
     if (
       teampObj?.status === ScorekeeperReservationStatus.pendingpayment
       || teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
     ) {
       if (teampObj?.updated_by) {
         if (teampObj?.updated_by?.group_id) {
           teampObj.requested_by = teampObj.updated_by.group_id;
         } else {
           teampObj.requested_by = teampObj.updated_by.uid;
         }
       } else if (teampObj?.created_by?.group_id) {
         teampObj.requested_by = teampObj.created_by.group_id;
       } else {
         teampObj.requested_by = teampObj.created_by.uid;
       }
     } else if (teampObj?.updated_by) {
       if (teampObj?.updated_by?.group_id) {
         if (
           teampObj?.automatic_request
           && teampObj?.status === ScorekeeperReservationStatus.changeRequest
           && entity?.obj?.entity_type === 'team'
         ) {
           teampObj.requested_by = teampObj.initiated_by;
         } else {
           teampObj.requested_by = teampObj.updated_by.group_id;
         }
       } else if (
         teampObj?.automatic_request
         && teampObj?.status === ScorekeeperReservationStatus.changeRequest
         && teampObj?.scorekeeper?.user_id !== entity.uid
       ) {
         teampObj.requested_by = teampObj.initiated_by;
       } else {
         teampObj.requested_by = teampObj.updated_by.uid;
       }
     } else if (teampObj?.created_by?.group_id) {
       teampObj.requested_by = teampObj.created_by.group_id;
     } else {
       teampObj.requested_by = teampObj.created_by.uid;
     }

     console.log('Temp Object::', teampObj);
     console.log(`${teampObj?.requested_by}:::${entity.uid}`);
     if (teampObj?.requested_by === entity.uid) {
       return 'sender';
     }
     return 'receiver';
   };

   const updateReservationDetail = () => {
     setloading(true);
     const body = {};
     body.scorekeeper_id = bodyParams?.scorekeeper?.user_id;
     body.game_id = bodyParams?.game?.game_id;
     console.log('Payment card data::', paymentCard);
     body.total_service_fee1 = paymentCard?.total_service_fee1;
     body.total_game_fee = paymentCard?.total_game_fee;
     body.total_service_fee2 = paymentCard?.total_service_fee2;
     body.total_amount = paymentCard?.total_amount;
     body.total_payout = paymentCard?.total_payout;
     body.manual_fee = bodyParams?.manual_fee;
     body.payment_method_type = 'card';
     body.currency_type = bodyParams?.currency_type;

     if (
       checkSenderForPayment(bodyParams) === 'sender'
       && paymentCard.total_game_charges > 0
     ) {
       let paymentSource;
       if (defaultCard) {
         paymentSource = defaultCard?.id;
       } else if (route.params.paymentMethod) {
         paymentSource = route?.params?.paymentMethod?.id;
       } else {
         Alert.alert(strings.selectCardText);
         return;
       }
       body.source = paymentSource;
     }

     const reservationId = bodyParams?.reservation_id;
     console.log('FINAL BODY PARAMS::', body);
     let callerId = '';
     if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
       callerId = entity.uid;
     }
     updateReservation('scorekeepers', reservationId, callerId, body, authContext)
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

   const Title = ({ text, required }) => (
     <Text style={styles.titleText}>
       {text}
       {required && <Text style={{ color: colors.redDelColor }}> * </Text>}
     </Text>
   );

   const Seperator = ({ height = 7 }) => (
     <View
       style={{
         width: '100%',
         height,
         marginVertical: 2,
         backgroundColor: colors.grayBackgroundColor,
       }}
     />
   );
   const getDateDuration = (fromData, toDate) => {
     const startDate = moment(fromData * 1000).format('hh:mm a');
     const endDate = moment(toDate * 1000).format('hh:mm a');
     const duration = getGameFromToDateDiff(fromData, toDate);
     return `${startDate} - ${endDate} (${duration})`;
   };

   const getOpponentEntity = (reservationObj) => {
     if (reservationObj?.scorekeeper?.user_id === entity.uid) {
       if (
         reservationObj?.initiated_by
         === reservationObj?.game?.home_team?.user_id
       ) {
         return reservationObj?.game?.away_team;
       }
       return reservationObj?.game?.home_team;
     }
     return reservationObj?.scorekeeper;
   };
   const acceptDeclineScorekeeperReservation = (
     reservationID,
     callerID,
     versionNo,
     status,
   ) => {
     setloading(true);
     acceptDeclineReservation(
       'scorekeepers',
       reservationID,
       callerID,
       versionNo,
       status,
       {},
       authContext,
     )
       .then((response) => {
         setloading(false);
         console.log('ACCEPT RESPONSE::', JSON.stringify(response.payload));
         const Obj = {
           ...getOpponentEntity(bodyParams),
           game_id: bodyParams?.game_id,
           sport: bodyParams?.sport,
         };
         console.log('OBJ RESPONSE::', Obj);
         if (status === 'accept') {
           navigation.push('ReservationAcceptDeclineScreen', {
             teamObj: Obj,
             status: 'accept',
           });
         } else if (status === 'decline') {
           navigation.push('ReservationAcceptDeclineScreen', {
             teamObj: getOpponentEntity(bodyParams),
             status: 'decline',
           });
         } else if (status === 'cancel') {
           navigation.push('ReservationAcceptDeclineScreen', {
             teamObj: getOpponentEntity(bodyParams),
             status: 'cancel',
           });
         }
       })
       .catch((e) => {
         setloading(false);
         setTimeout(() => {
           Alert.alert(strings.alertmessagetitle, e.message);
         }, 10);
       });
   };
   return (
     <TCKeyboardView scrollReference={scroll}>
       <ActivityLoader visible={loading} />
       <TCTabView
         totalTabs={2}
         firstTabTitle={'ALTERATION REQUEST'}
         secondTabTitle={'CURRENT RESERVATION'}
         indexCounter={maintabNumber}
         eventPrivacyContianer={{ width: 100 }}
         onFirstTabPress={() => setMaintabNumber(0)}
         onSecondTabPress={() => setMaintabNumber(1)}
         activeHeight={36}
         inactiveHeight={40}
       />
       {homeTeam && awayTeam && bodyParams && maintabNumber === 0 && (
         <View style={{ marginBottom: 15 }}>
           {!isPendingRequestPayment && (
             <TouchableOpacity onPress={() => console.log('OK')}>
               <LinearGradient
                 colors={[colors.yellowColor, colors.themeColor]}
                 style={styles.containerStyle}>
                 <Text style={styles.buttonText}>
                   Please edit the reservation details below before you send the
                   alteration request.
                 </Text>
               </LinearGradient>
             </TouchableOpacity>
           )}
           <View
             style={{
               flexDirection: 'row',
               justifyContent: 'flex-end',
               alignItems: 'flex-end',
               marginLeft: 15,
               marginRight: 15,
             }}>
             <ReservationNumber reservationNumber={bodyParams?.reservation_id} />
           </View>

           <View
             style={{
               flex: 1,
               flexDirection: 'row',
               justifyContent: 'space-between',
               margin: 15,
             }}>
             <View style={styles.challengerView}>
               <View style={styles.teamView}>
                 <Image source={images.reqIcon} style={styles.reqOutImage} />
                 <Text style={styles.challengerText}>Requester</Text>
               </View>

               <View style={styles.teamView}>
                 <View style={styles.profileView}>
                   <Image
                     source={
                       getRequester(bodyParams).thumbnail
                         ? { uri: getRequester(bodyParams).thumbnail }
                         : images.teamPlaceholder
                     }
                     style={styles.profileImage}
                   />
                 </View>
                 <Text style={styles.teamNameText}>
                   {getRequester(bodyParams).group_id
                     ? `${getRequester(bodyParams).group_name}`
                     : `${getRequester(bodyParams).first_name} ${
                         getRequester(bodyParams).last_name
                       }`}
                 </Text>
               </View>
             </View>
             <View style={styles.challengeeView}>
               <View style={styles.teamView}>
                 <Image source={images.refIcon} style={styles.reqOutImage} />
                 <Text style={styles.challengeeText}>Scorekeeper</Text>
               </View>

               <View style={styles.teamView}>
                 {/* <Image
                     source={
                       bodyParams?.scorekeeper?.thumbnail
                         ? { uri: bodyParams?.scorekeeper?.thumbnail }
                         : images.teamPlaceholder
                     }
                     style={styles.teamImage}
                   /> */}
                 <View style={styles.profileView}>
                   <Image
                     source={
                       bodyParams?.scorekeeper?.full_image
                         ? { uri: bodyParams?.scorekeeper?.full_image }
                         : images.profilePlaceHolder
                     }
                     style={styles.profileImage}
                   />
                 </View>
                 <Text
                   style={{
                     marginLeft: 5,
                     fontFamily: fonts.RMedium,
                     fontSize: 16,
                     color: colors.lightBlackColor,
                     width: '80%',
                   }}>
                   {`${bodyParams?.scorekeeper?.first_name} ${bodyParams?.scorekeeper?.last_name}`}
                 </Text>
               </View>
             </View>
           </View>

           <ScorekeeperReservationTitle reservationObject={bodyParams} showDesc={true} containerStyle={{ margin: 15 }}/>

           {bodyParams?.scorekeeper?.user_id !== entity.uid
             && bodyParams.status
               === ScorekeeperReservationStatus.pendingrequestpayment && (
                 <TCGradientButton
                 title={strings.tryToPayText}
                 onPress={() => {
                   navigation.navigate('PayAgainScorekeeperScreen', {
                     body: { ...bodyParams, ...paymentCard },
                     comeFrom: ScorekeeperReservationStatus.pendingrequestpayment,
                   });
                 }}
                 marginBottom={15}
               />
             )}
           {bodyParams?.scorekeeper?.user_id === entity.uid
             && bodyParams.status
               === ScorekeeperReservationStatus.pendingrequestpayment && (
                 <TCGradientButton
                 title={strings.restorePreviousText}
                 onPress={() => {
                   let callerId = '';
                   if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                     callerId = entity.uid;
                   }
                   acceptDeclineReservationOperation(
                     bodyParams.reservation_id,
                     callerId,
                     bodyParams.version,
                     'decline',
                     true,
                   );
                 }}
                 marginBottom={15}
               />
             )}

           <TCThickDivider />

           {bodyParams && (
             <View>
               {/* Choose Match */}
               <View style={styles.contentContainer}>
                 <View
                   style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                   }}>
                   <Title text={'Game'} />

                   {!isPendingRequestPayment && (
                     <TouchableOpacity
                       style={styles.editTouchArea}
                       hitSlop={getHitSlop(15)}
                       onPress={() => navigation.navigate('ScorekeeperSelectMatch')}>
                       <Image
                         source={images.editSection}
                         style={styles.editButton}
                       />
                     </TouchableOpacity>
                   )}
                 </View>
               </View>
               {bodyParams?.game && (
                 <TCGameCard
                   data={bodyParams?.game}
                   onPress={() => {
                     const routeName = getGameHomeScreen(
                       bodyParams?.game?.sport,
                     );
                     navigation.push(routeName, {
                       gameId: bodyParams?.game?.game_id,
                     });
                   }}
                 />
               )}
               {/* Date & Time */}
               {bodyParams?.game && (
                 <View>
                   <View style={styles.contentContainer}>
                     <Title text={'Date & Time'} />
                     <TCInfoField
                       title={'Date'}
                       value={
                         bodyParams?.timestamp
                         && moment(bodyParams?.game?.start_datetime * 1000).format(
                           'MMM DD, YYYY',
                       )
                       }
                       titleStyle={{
                         alignSelf: 'flex-start',
                         fontFamily: fonts.RRegular,
                       }}
                     />
                     <Seperator height={2} />
                     <TCInfoField
                       title={'Time'}
                       value={
                         bodyParams?.game?.start_datetime
                         && bodyParams?.game?.end_datetime
                           ? getDateDuration(
                               bodyParams?.game?.start_datetime,
                               bodyParams?.game?.end_datetime,
                             )
                           : ''
                       }
                       titleStyle={{
                         alignSelf: 'flex-start',
                         fontFamily: fonts.RRegular,
                       }}
                     />
                     <Seperator height={2} />
                   </View>

                   {/* Venue */}
                   <View style={styles.contentContainer}>
                     <Title text={'Venue'} />
                     <TCInfoField
                       title={'Venue'}
                       value={bodyParams?.game?.venue?.name}
                       titleStyle={{
                         alignSelf: 'flex-start',
                         fontFamily: fonts.RRegular,
                       }}
                     />
                     <TCInfoField
                       title={'Address'}
                       value={bodyParams?.game?.venue?.address}
                       titleStyle={{
                         alignSelf: 'flex-start',
                         fontFamily: fonts.RRegular,
                       }}
                     />
                     <EventMapView
                       coordinate={{
                         latitude:
                           bodyParams?.game?.venue?.coordinate?.latitude ?? 0.0,
                         longitude:
                           bodyParams?.game?.venue?.coordinate?.longitude ?? 0.0,
                       }}
                       region={{
                         latitude:
                           bodyParams?.game?.venue?.coordinate?.latitude ?? 0.0,
                         longitude:
                           bodyParams?.game?.venue?.coordinate?.longitude ?? 0.0,
                         latitudeDelta: 0.0922,
                         longitudeDelta: 0.0421,
                       }}
                     />
                   </View>
                 </View>
               )}
             </View>
           )}
           <TCLabel
             title={'Game Rules'}
             style={{ marginTop: 0, marginBottom: 10 }}
           />
           <Text style={styles.rulesTitle}>General Rules</Text>
           <Text style={styles.rulesDetail}>
             {bodyParams?.game?.general_rules}
           </Text>
           <View style={{ marginBottom: 10 }} />
           <Text style={styles.rulesTitle}>Special Rules</Text>
           <Text style={[styles.rulesDetail, { marginBottom: 10 }]}>
             {bodyParams?.game?.special_rules}
           </Text>
           <TCThickDivider marginTop={15} />

           <View>
             <TCChallengeTitle
           title={'Refund Policy'}
           value={bodyParams?.refund_policy}
           tooltipText={
           '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
           }
           tooltipHeight={heightPercentageToDP('18%')}
           tooltipWidth={widthPercentageToDP('50%')}
           isEdit={false}

         />
             <TCThickDivider />
           </View>
           <View style={styles.editableView}>
             <View
               style={{
                 flex: 1,
                 flexDirection: 'row',
                 alignItems: 'center',
                 justifyContent: 'space-between',
               }}>
               <TCLabel
                 title={
                   checkSenderForPayment(bodyParams) === 'sender'
                     ? 'Payment'
                     : 'Earning'
                 }
                 isNew={editPayment}
               />
               <TouchableOpacity
                 onPress={() => {
                   navigation.navigate('ScorekeeperSelectMatch');
                 }}></TouchableOpacity>
             </View>
             {!isPendingRequestPayment && (
               <TouchableOpacity
                 style={styles.editTouchArea}
                 hitSlop={getHitSlop(15)}
                 onPress={() => navigation.navigate('EditScorekeeperFeeScreen', {
                     editableAlter: true,
                     body: bodyParams,
                   })
                 }>
                 <Image source={images.editSection} style={styles.editButton} />
               </TouchableOpacity>
             )}
           </View>

           <MatchFeesCard
             challengeObj={paymentCard}
             senderOrReceiver={checkSenderForPayment(bodyParams)}
           />

           {/* Payment Method */}
           {oldVersion?.total_game_fee === 0 && bodyParams?.total_game_fee > 0 && (
             <View style={styles.contentContainer}>
               <Title text={'Payment Method'} />
               <View style={{ marginTop: 10 }}>
                 <TCTouchableLabel
                title={
                  route.params.paymentMethod
                    ? Utility.capitalize(route.params.paymentMethod.card.brand)
                    : strings.addOptionMessage
                }
                subTitle={route.params.paymentMethod?.card.last4}
                showNextArrow={true}
                onPress={() => {
                  navigation.navigate('PaymentMethodsScreen', {
                    comeFrom: 'AlterRefereeScreen',
                  });
                }}
              />
               </View>
             </View>
        )}
           {editPayment && (
             <View style={{ marginTop: 15 }}>
               <Text style={styles.differenceText}>
                 Difference{' '}
                 <Text style={styles.differenceSmallText}>
                   (New payment - Current payment)
                 </Text>
               </Text>
               <View style={styles.differeceView}>
                 <Text style={styles.differenceTextTitle}>Difference</Text>
                 <Text style={styles.diffenceAmount}>{`$${parseFloat(
                   bodyParams?.total_game_fee
                     - oldVersion?.total_game_fee,
                 ).toFixed(2)} ${
                   bodyParams.currency_type.toUpperCase() || 'CAD'
                 }`}</Text>
                 {/* <Text style={styles.diffenceAmount}>{checkSenderOrReceiver(bodyParams) === 'sender' ? `$${bodyParams.total_charges - oldVersion.total_charges} CAD` : `$${bodyParams.total_payout - oldVersion.total_payout} CAD`}</Text> */}
               </View>
             </View>
           )}
           {checkSenderOrReceiver(bodyParams) === 'sender'
             && bodyParams.status === ScorekeeperReservationStatus.changeRequest && (
               <View style={{ marginTop: 15 }}>
                 <TCBorderButton
                   title={strings.cancelAlterRequest}
                   textColor={colors.grayColor}
                   borderColor={colors.grayColor}
                   height={40}
                   shadow={true}
                   onPress={() => {
                     let callerId = '';
                     if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                       callerId = entity.uid;
                     }
                     cancelAlterReservationOperation(
                       bodyParams.reservation_id,
                       callerId,
                       bodyParams.version,
                     );
                   }}
                 />
               </View>
             )}

           {checkSenderOrReceiver(bodyParams) === 'receiver'
             && bodyParams.status === ScorekeeperReservationStatus.changeRequest
             && bodyParams.expiry_datetime < new Date().getTime() && (
               <View style={{ marginTop: 15 }}>
                 <TCGradientButton
                   title={strings.accept}
                   onPress={() => {
                     let callerId = '';
                     if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                       callerId = entity.uid;
                     }
                     acceptDeclineAlterReservationOperation(
                       bodyParams.reservation_id,
                       callerId,
                       bodyParams.version,
                       'accept',
                       route?.params?.paymentMethod
                         && route?.params?.paymentMethod?.id,
                     );
                   }}
                   marginBottom={15}
                 />
                 <TCBorderButton
                   title={strings.decline}
                   textColor={colors.grayColor}
                   borderColor={colors.grayColor}
                   height={40}
                   shadow={true}
                   onPress={() => {
                     let callerId = '';
                     if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                       callerId = entity.uid;
                     }
                     acceptDeclineReservationOperation(
                       bodyParams.reservation_id,
                       callerId,
                       bodyParams.version,
                       'decline',
                     );
                   }}
                 />
               </View>
             )}

           {(bodyParams.status === ScorekeeperReservationStatus.accepted
             || bodyParams.status === ScorekeeperReservationStatus.restored)
             && !isPendingRequestPayment && (
               <View>
                 <TCGradientButton
                   title={strings.sendAlterRequest}
                   textColor={colors.grayColor}
                   startGradientColor={colors.yellowColor}
                   endGradientColor={colors.themeColor}
                   height={40}
                   shadow={true}
                   marginTop={15}
                   onPress={() => {
                     if (editInfo || editPayment) {
                       updateReservationDetail();
                     } else {
                       Alert.alert(
                         'Please modify atleast one field for alter request.',
                       );
                     }
                   }}
                 />
                 <TCBorderButton
                   title={strings.cancel}
                   textColor={colors.themeColor}
                   borderColor={colors.themeColor}
                   height={40}
                   shadow={true}
                   marginBottom={15}
                   fontSize={16}
                   onPress={() => {
                     navigation.popToTop();
                   }}
                 />
               </View>
             )}
           {(bodyParams.status === ScorekeeperReservationStatus.changeRequest
             || bodyParams.status
               === ScorekeeperReservationStatus.pendingrequestpayment) && (
                 <View>
                   <TCBorderButton
                 title={strings.cancelreservation}
                 textColor={colors.whiteColor}
                 borderColor={colors.grayColor}
                 backgroundColor={colors.grayColor}
                 height={40}
                 shadow={true}
                 marginBottom={15}
                 marginTop={15}
                 onPress={() => {
                   if (
                     bodyParams?.game?.status === GameStatus.accepted
                     || bodyParams?.game?.status === GameStatus.reset
                   ) {
                     let callerId = '';
                     if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                       callerId = entity.uid;
                     }

                     acceptDeclineScorekeeperReservation(
                       bodyParams.reservation_id,
                       callerId,
                       bodyParams.version,
                       'cancel',
                     );
                   } else if (
                     bodyParams.start_datetime * 1000
                     < new Date().getTime()
                   ) {
                     Alert.alert(
                       'Reservation cannot be cancel after game time passed or offer expired.',
                     );
                   } else {
                     Alert.alert(
                       'Reservation can not be change after game has been started.',
                     );
                   }
                 }}
               />
                 </View>
           )}
           {bodyParams.status === ScorekeeperReservationStatus.declined && (
             <View>
               <TCBorderButton
                 title={strings.alterReservation}
                 textColor={colors.grayColor}
                 borderColor={colors.grayColor}
                 height={40}
                 shadow={true}
                 marginTop={15}
                 onPress={() => {
                   if (
                     (bodyParams?.game?.status === GameStatus.accepted
                       || bodyParams?.game?.status === GameStatus.reset)
                     && bodyParams.start_datetime
                       > parseFloat(new Date().getTime() / 1000).toFixed(0)
                   ) {
                     navigation.navigate('EditScorekeeperReservation', {
                       reservationObj: oldVersion,
                     });
                   } else {
                     Alert.alert(
                       'Reservation cannot be change after game time passed or offer expired.',
                     );
                   }
                 }}
               />
               <TCBorderButton
                 title={strings.cancelreservation}
                 textColor={colors.whiteColor}
                 borderColor={colors.grayColor}
                 backgroundColor={colors.grayColor}
                 height={40}
                 shadow={true}
                 marginBottom={15}
                 marginTop={15}
                 onPress={() => {
                   if (
                     bodyParams?.game?.status === GameStatus.accepted
                     || bodyParams?.game?.status === GameStatus.reset
                   ) {
                     let callerId = '';
                     if (bodyParams?.scorekeeper?.user_id !== entity.uid) {
                       callerId = entity.uid;
                     }

                     acceptDeclineScorekeeperReservation(
                       bodyParams.reservation_id,
                       callerId,
                       bodyParams.version,
                       'cancel',
                     );
                   } else if (
                     bodyParams.start_datetime * 1000
                     < new Date().getTime()
                   ) {
                     Alert.alert(
                       'Reservation cannot be cancel after game time passed or offer expired.',
                     );
                   } else {
                     Alert.alert(
                       'Reservation can not be change after game has been started.',
                     );
                   }
                 }}
               />
             </View>
           )}
         </View>
       )}
       <SafeAreaView>
         {maintabNumber === 1 && (
           <CurruentScorekeeperReservationView
           reservationObj={oldVersion}
           navigation={navigation}
         />
       )}
       </SafeAreaView>

     </TCKeyboardView>
   );
 }
 const styles = StyleSheet.create({
   // rulesText: {
   //   fontSize: 16,
   //   fontFamily: fonts.RRegular,
   //   color: colors.lightBlackColor,
   //   marginLeft: 15,
   //   marginRight: 15,
   // },

   teamView: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 5,
   },
   reqOutImage: {
     width: 25,
     height: 25,
     resizeMode: 'cover',
   },
   challengeeText: {
     marginLeft: 5,
     fontFamily: fonts.RRegular,
     fontSize: 14,
     color: colors.lightBlackColor,
   },
   challengerText: {
     marginLeft: 5,
     fontFamily: fonts.RRegular,
     fontSize: 14,
     color: colors.lightBlackColor,
   },

   teamNameText: {
     marginLeft: 5,
     fontFamily: fonts.RMedium,
     fontSize: 16,
     color: colors.lightBlackColor,
     width: '80%',
   },
   challengerView: {
     marginRight: 15,
     flex: 0.5,
   },
   challengeeView: {
     flex: 0.5,
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
   editButton: {
     height: 16,
     width: 16,
     resizeMode: 'center',
     alignSelf: 'center',
   },
   editTouchArea: {
     alignSelf: 'center',
   },
   editableView: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginRight: 15,
   },
   differeceView: {
     shadowColor: colors.blackColor,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.16,
     shadowRadius: 1,
     elevation: 3,
     borderRadius: 8,
     marginTop: 5,
     marginLeft: 15,
     marginRight: 15,
     height: 40,
     backgroundColor: colors.whiteColor,
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   differenceText: {
     marginLeft: 15,
     fontSize: 16,
     fontFamily: fonts.RRegular,
     color: colors.themeColor,
   },
   differenceSmallText: {
     marginLeft: 15,
     fontSize: 14,
     fontFamily: fonts.RRegular,
     color: colors.themeColor,
   },
   differenceTextTitle: {
     marginLeft: 15,
     alignSelf: 'center',
     fontFamily: fonts.RRegular,
     fontSize: 15,
     color: colors.lightBlackColor,
   },
   diffenceAmount: {
     marginRight: 15,
     alignSelf: 'center',
     fontFamily: fonts.RMedium,
     fontSize: 15,
     color: colors.themeColor,
   },

   contentContainer: {
     padding: 15,
   },
   titleText: {
     color: colors.lightBlackColor,
     fontSize: 20,
     fontFamily: fonts.RRegular,
   },
   profileImage: {
     alignSelf: 'center',
     height: 38,
     width: 38,
     borderRadius: 76,
   },
   profileView: {
     backgroundColor: colors.whiteColor,
     height: 44,
     width: 44,
     borderRadius: 88,
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: colors.grayColor,
     shadowOffset: { width: 0, height: 3 },
     shadowOpacity: 0.5,
     shadowRadius: 4,
     elevation: 3,
   },
   rulesTitle: {
     fontFamily: fonts.RMedium,
     fontSize: 16,
     color: colors.lightBlackColor,
     marginLeft: 15,
     marginBottom: 5,
   },
   rulesDetail: {
     fontFamily: fonts.RRegular,
     fontSize: 16,
     color: colors.lightBlackColor,
     marginLeft: 15,
     marginRight: 15,
   },
 });
