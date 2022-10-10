/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';
import moment from 'moment';
import {format} from 'react-string-format';

import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import AuthContext from '../../../auth/context';
import {heightPercentageToDP as hp} from '../../../utils';
import AppleStyleSwipeableRow from '../../../components/notificationComponent/AppleStyleSwipeableRow';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';
import PaymentLogs from '../../../components/invoice/PaymentLogs';
import {
  getInvoiceDetail,
  deleteInvoice,
  cancelInvoice,
  payStripeInvoice,
  resendInvoice,
  addLog,
  deleteInvoiceLog,
} from '../../../api/Invoice';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';

export default function TeamInvoiceDetailScreen({navigation, route}) {
  const [from] = useState(route?.params?.from);
  const [invoiceObj] = useState(route?.params?.invoiceObj);

  const [loading, setloading] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState();
  const [logsList, setLogsList] = useState([]);

  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const userActionSheet = useRef();
  const resendModalRef = useRef();
  const recipientModalRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity
            onPress={() => {
              if (from === 'user') {
                userActionSheet.current.show();
              } else {
                actionSheet.current.show();
              }
            }}>
            <Image
              source={images.threeDotIcon}
              style={styles.townsCupSettingIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [from, navigation]);

  const getInvoiceDetailApi = useCallback(() => {
    getInvoiceDetail(invoiceObj?.invoice_id, authContext)
      .then((response) => {
        setloading(false);
        setInvoiceDetail(response.payload[0]);
        setLogsList(response?.payload?.[0]?.logs ?? []);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, invoiceObj?.invoice_id]);

  useEffect(() => {
    setloading(true);
    getInvoiceDetailApi();
  }, [authContext, getInvoiceDetailApi, invoiceObj.invoice_id]);

  const onDeleteLog = (item) => {
    Alert.alert(
      strings.alertmessagetitle,
      strings.removeLogText,
      [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: strings.yes,
          onPress: () => {
            setloading(true);
            deleteInvoiceLog(
              invoiceDetail?.invoice_id,
              item?.transaction_id,
              authContext,
            )
              .then(() => {
                // const newLogList = logsList.filter((card) => card.transaction_id !== item.transaction_id);
                // setLogsList(newLogList);
                getInvoiceDetailApi();
                setloading(false);
              })
              .catch((e) => {
                console.log('error in payment method onDeleteCard', e);
                setloading(false);
                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 0.3);
              });
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderLogView = ({item, index}) => {
    console.log('item', item);
    return logsList.length > 0 &&
      logsList?.length - 1 === index &&
      authContext?.entity?.role === 'team' &&
      item?.payment_mode !== 'card' ? (
      <AppleStyleSwipeableRow
        onPress={() => onDeleteLog(item)}
        color={colors.redDelColor}
        image={images.deleteIcon}>
        <PaymentLogs
          data={item}
          onPressCard={() => {
            navigation.navigate('LogDetailScreen', {data: item});
          }}
        />
      </AppleStyleSwipeableRow>
    ) : (
      <PaymentLogs
        data={item}
        onPressCard={() => {
          navigation.navigate('LogDetailScreen', {data: item});
        }}
      />
    );
  };
  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => resendModalRef.current.close()}>
          {strings.cancel}
        </Text>

        <Text style={styles.titleText}>{strings.resendInvoiceText}</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            resendInvoiceByID();
          }}>
          {strings.send}
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const deleteInvoiceByID = () => {
    setloading(true);
    deleteInvoice(invoiceObj?.invoice_id, authContext)
      .then(() => {
        setloading(false);
        navigation.pop(2);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const cancelInvoiceByID = () => {
    setloading(true);
    cancelInvoice(invoiceObj?.invoice_id, authContext)
      .then(() => {
        setloading(false);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const resendInvoiceByID = () => {
    setloading(true);
    const body = {};
    body.email_sent = false;
    resendInvoice(invoiceObj?.invoice_id, body, authContext)
      .then(() => {
        setloading(false);
        resendModalRef.current.close();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const emptyLog = useMemo(
    () => (
      <Text
        style={{
          alignSelf: 'center',
          fontFamily: fonts.RLight,
          marginTop: 15,
          fontSize: 16,
          color: colors.lightBlackColor,
        }}>
        {strings.noLogFoundText}
      </Text>
    ),
    [],
  );

  const actionSheetOpetions = () => {
    if (from === 'user') {
      // if (!invoiceDetail?.logs) {
      //   return ['Delete Invoice', strings.cancel];
      // }
      return [strings.deleteInvoice, strings.cancel];
    }
  };

  const payNowClicked = () => {
    if (route?.params?.paymentMethod) {
      console.log(route?.params?.paymentMethod);

      setloading(true);
      const body = {};
      body.source = route?.params?.paymentMethod?.id;
      body.payment_method_type = 'card';
      // body.currency_type = authContext.entity.obj.currency_type ?? 'USD';
      payStripeInvoice(invoiceObj?.invoice_id, body, authContext)
        .then(() => {
          setloading(false);
          navigation.goBack();
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      Alert.alert(strings.choosePayment);
    }
  };

  const stripeRefundValidation = () => {
    if (logsList.length <= 0) {
      Alert.alert(strings.payInvoiceFirstValidation);
      return false;
    }
    if (logsList?.[0]?.payment_mode !== 'card') {
      Alert.alert(strings.didNotPaidInvoiceValidation);
      return false;
    }

    return true;
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {invoiceDetail && (
        <View style={{flex: 1}}>
          <View style={{margin: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 34,
              }}>
              <Image
                source={
                  from === 'user'
                    ? invoiceDetail?.group?.thumbnail &&
                      invoiceDetail?.group?.thumbnail !== ''
                      ? {uri: invoiceDetail?.group?.thumbnail}
                      : images.teamPlaceholder
                    : invoiceDetail?.user?.thumbnail &&
                      invoiceDetail?.user?.thumbnail !== ''
                    ? {uri: invoiceDetail?.user?.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.invoiceProfileStyle}
              />
              <Text
                style={{
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
                {from === 'user'
                  ? `${invoiceDetail?.group?.group_name}`
                  : `${invoiceDetail?.user?.first_name} ${invoiceDetail?.user?.last_name}`}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}>
              {`${strings.invoiceNumberText} ${invoiceDetail?.invoice_id}`}
            </Text>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}>
              {format(
                strings.dueAtNText,
                moment(new Date(invoiceDetail?.due_date * 1000)).format(
                  'MMM DD, YYYY',
                ),
              )}
            </Text>
          </View>

          <LinearGradient
            colors={[colors.grayBackgroundColor, colors.grayBackgroundColor]}
            style={styles.paymentProgressView}>
            <LinearGradient
              colors={[colors.greenGradientEnd, colors.greenGradientStart]}
              style={{
                height: 20,
                backgroundColor: colors.thinDividerColor,
                width: `${
                  (100 * invoiceDetail?.amount_paid) / invoiceDetail?.amount_due
                }%`,
                // alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: fonts.RBold,
                  fontSize: 12,
                  marginLeft: 15,
                }}>
                {`$${invoiceDetail?.amount_paid} `}
                {strings.defaultCurrency}
              </Text>
            </LinearGradient>
          </LinearGradient>

          <InvoiceAmount
            status={`${invoiceDetail?.invoice_status}`}
            currencyType={strings.defaultCurrency}
            totalAmount={invoiceDetail?.amount_due ?? '00.00'}
            paidAmount={invoiceDetail?.amount_paid ?? '00.00'}
            openAmount={invoiceDetail?.amount_remaining ?? '00.00'}
          />

          <TCThinDivider marginTop={15} width={'94%'} />

          <View style={{margin: 15}}>
            <Text
              style={{
                fontFamily: fonts.RLight,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}>
              {'Description '}
            </Text>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}>
              {invoiceDetail?.invoice_description}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 12,
              color: colors.userPostTimeColor,
              marginLeft: 15,
            }}>
            {format(
              strings.loggedByText,
              invoiceDetail?.created_by?.first_name,
              invoiceDetail?.created_by?.last_name,
              moment(new Date(invoiceDetail?.created_date * 1000)).format(
                'MMM DD, YYYY hh:mma',
              ),
            )}
          </Text>

          {from !== 'user' && (
            <TouchableOpacity
              style={styles.paymentContainer}
              onPress={() => {
                navigation.navigate('AddLogScreen', {invoiceDetail});
              }}>
              <Text style={styles.cardDetailText}>{strings.logManually}</Text>
            </TouchableOpacity>
          )}

          {from === 'user' && invoiceDetail?.amount_remaining > 0 && (
            <TouchableOpacity
              style={styles.paymentViewContainer}
              onPress={() => {
                navigation.navigate('PaymentMethodsScreen', {
                  comeFrom: 'TeamInvoiceDetailScreen',
                });
              }}>
              <Text style={styles.cardDetailViewText}>
                {route?.params?.paymentMethod?.card?.brand
                  ? Utility.capitalize(
                      route?.params?.paymentMethod?.card?.brand,
                    )
                  : strings.addOptionMessage}{' '}
                {route?.params?.paymentMethod &&
                  `**** ${route?.params?.paymentMethod?.card?.last4}`}
              </Text>
              <Image
                style={styles.nextIconViewStyle}
                source={images.nextArrow}
              />
            </TouchableOpacity>
          )}

          {logsList?.length > 0 && (
            <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontFamily: fonts.RMedium,
                    fontSize: 20,
                    color: colors.lightBlackColor,
                    margin: 15,
                  }}>
                  {strings.log}
                </Text>
                <FlatList
                  data={logsList}
                  renderItem={renderLogView}
                  ListEmptyComponent={emptyLog}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </SafeAreaView>
          )}

          {from === 'user' && invoiceDetail?.amount_remaining > 0 && (
            <>
              <View style={{flex: 1}} />
              <SafeAreaView>
                <TouchableOpacity
                  onPress={() => {
                    payNowClicked();
                  }}>
                  <LinearGradient
                    colors={[colors.yellowColor, colors.darkThemeColor]}
                    style={styles.activeEventPricacy}>
                    <Text style={styles.activeEventPrivacyText}>
                      {strings.PAYNOW}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </SafeAreaView>
            </>
          )}

          <ActionSheet
            ref={actionSheet}
            options={[
              strings.refund,
              strings.resendInvoiceText,
              strings.cancelInvoiceText,
              strings.deleteInvoice,
              strings.cancel,
            ]}
            cancelButtonIndex={4}
            destructiveButtonIndex={3}
            onPress={(index) => {
              if (index === 0) {
                if (stripeRefundValidation()) {
                  setloading(true);
                  const body = {};
                  body.transaction_type = 'refund';

                  addLog(invoiceDetail?.invoice_id, body, authContext)
                    .then(() => {
                      setloading(false);
                    })
                    .catch((e) => {
                      setloading(false);
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, e.message);
                      }, 10);
                    });
                }
              } else if (index === 1) {
                // Alert.alert('Resend');
                resendModalRef?.current?.open();
              } else if (index === 2) {
                if (from === 'member' || from === 'batch') {
                  Alert.alert(
                    strings.cancelThisInvoiceText,
                    '',
                    [
                      {
                        text: strings.back,
                        style: 'cancel',
                      },
                      {
                        text: strings.yes,

                        // style: 'destructive',
                        onPress: () => {
                          // deleteInvoiceByID();
                          cancelInvoiceByID();
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  recipientModalRef.current.open();
                }
              } else if (index === 3) {
                if (invoiceDetail?.amount_paid !== 0) {
                  if (from === 'member' || from === 'batch') {
                    Alert.alert(
                      strings.cancelThisInvoiceText,
                      '',
                      [
                        {
                          text: strings.back,
                          style: 'cancel',
                        },
                        {
                          text: strings.yes,

                          // style: 'destructive',
                          onPress: () => {
                            deleteInvoiceByID();
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  } else {
                    recipientModalRef.current.open();
                  }
                }
                Alert.alert(strings.cannotDeleteInvoicetext);
              }
            }}
          />

          <ActionSheet
            ref={userActionSheet}
            options={actionSheetOpetions()}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={(index) => {
              if (actionSheetOpetions()[index] === strings.deleteInvoice) {
                deleteInvoiceByID();
              }
              if (actionSheetOpetions()[index] === strings.cancelInvoicesText) {
                cancelInvoiceByID();
              }
              if (actionSheetOpetions()[index] === strings.cancel) {
                console.log('cancel');
              }
            }}
          />

          <Portal>
            <Modalize
              withHandle={false}
              adjustToContentHeight={true}
              overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
              snapPoint={hp(50)}
              modalStyle={{
                flex: 1,
                height: '86%',
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                shadowColor: colors.blackColor,
                shadowOffset: {width: 0, height: -2},
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
              }}
              HeaderComponent={ModalHeader}
              ref={resendModalRef}>
              <View>
                <View
                  style={{
                    margin: 15,
                    backgroundColor: colors.lightGrayBackground,
                  }}>
                  <View style={{margin: 15}}>
                    <Text
                      style={{
                        fontFamily: fonts.RLight,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {strings.invoiceTitle}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.RMedium,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {invoiceDetail?.invoice_title}
                    </Text>
                  </View>
                  <View style={{margin: 15}}>
                    <Text
                      style={{
                        fontFamily: fonts.RLight,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {strings.invoiceDescriptionText}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.RRegular,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {invoiceDetail?.invoice_description}
                    </Text>
                  </View>
                  <View style={{margin: 15}}>
                    <Text
                      style={{
                        fontFamily: fonts.RLight,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {strings.invoiceAmountText}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.RMedium,
                        fontSize: 20,
                        color: colors.lightBlackColor,
                      }}>
                      ${invoiceDetail?.amount_due}
                    </Text>
                  </View>
                  <View style={{margin: 15}}>
                    <Text
                      style={{
                        fontFamily: fonts.RLight,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {strings.dueAt}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.RMedium,
                        fontSize: 16,
                        color: colors.lightBlackColor,
                      }}>
                      {moment(invoiceDetail?.due_date * 1000).format(
                        'ddd, MMM DD, YYYY',
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </Modalize>
          </Portal>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: colors.grayBackgroundColor,
  },

  townsCupSettingIcon: {
    resizeMode: 'contain',
    height: 19,
    width: 9,
    marginRight: 10,
    tintColor: colors.lightBlackColor,
  },
  invoiceProfileStyle: {
    resizeMode: 'contain',
    height: 17,
    width: 17,
    marginRight: 10,
    borderRadius: 34,
  },

  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 5,
    marginLeft: 25,
  },

  paymentProgressView: {
    height: 20,
    backgroundColor: colors.thinDividerColor,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
  },

  paymentContainer: {
    height: 35,
    width: 200,
    borderRadius: 5,
    backgroundColor: colors.offwhite,
    flexDirection: 'row',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 13,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  cardDetailText: {
    fontFamily: fonts.RBold,
    fontSize: 14,
    color: colors.lightBlackColor,
  },

  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  headerButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
  },
  cancelText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RLight,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    marginLeft: 15,
  },
  sendText: {
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    marginRight: 15,
  },
  headerSeparator: {
    width: '100%',
    backgroundColor: colors.grayBackgroundColor,
    height: 2,
    marginBottom: 15,
  },

  // Payment button style

  activeEventPricacy: {
    height: 40,
    width: '94%',
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  activeEventPrivacyText: {
    color: 'white',
    fontFamily: fonts.RBold,
    fontSize: 14,
    textAlign: 'center',
  },

  nextIconViewStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 14,
    width: 8,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },
  paymentViewContainer: {
    height: 40,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    backgroundColor: colors.offwhite,
    flexDirection: 'row',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 13,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cardDetailViewText: {
    marginLeft: 15,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
});
