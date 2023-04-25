/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, {
  useState,
  useContext,
  useLayoutEffect,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import {format} from 'react-string-format';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AuthContext from '../../../auth/context';

// import {getGroupMembers} from '../../../api/Groups';
import {
  createBatchInvoice,
  cancelBatchInvoice,
  resendBatchInvoice,
  // addRecipientList,
} from '../../../api/Invoice';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import MemberInvoiceView from '../../../components/invoice/MemberInvoiceView';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TCThinDivider from '../../../components/TCThinDivider';
import {getJSDate, heightPercentageToDP} from '../../../utils';
import {strings} from '../../../../Localization/translation';
import InvoiceTypeSelection from '../../../components/invoice/InvoiceTypeSelection';
import Verbs from '../../../Constants/Verbs';
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';

// let entity = {};
export default function BatchDetailScreen({navigation, route}) {
  const [from] = useState(route.params.from);
  const [batchData] = useState(route.params.batchData);
  const [loading, setloading] = useState(false);
  const [currency_type] = useState(route.params.currency_type);
  const batchActionsheet = useRef();
  const resendModalRef = useRef();
  const recipientModalRef = useRef();

  const authContext = useContext(AuthContext);
  // entity = authContext.entity;

  const [tabNumber, setTabNumber] = useState(0);
  // const [recipientData, setRecipientData] = useState([]);
  const [newRecipientData, setNewRecipientData] = useState([]);
  const [addNewList, setAddNewList] = useState([]);
  const [recipientAllData, setRecipientAllData] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState([]);
  const [selectInvoiceType, setSelectInvoiceType] = useState('Open Invoices');
  const [selectedActionSheetOpetion, setSelectedActionSheetOpetion] =
    useState(0);
  const [tabs, setTabs] = useState([
    strings.all,
    strings.paidText,
    strings.openText,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
      headerTitle: () => <Text style={styles.navTitle}>{strings.batch}</Text>,
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity
            onPress={() => {
              batchActionsheet.current.show();
            }}>
            <Image
              source={images.vertical3Dot}
              style={styles.townsCupthreeDotIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const getStatus = () => {
    if (batchData.invoice_total === batchData.invoice_paid_total) {
      return strings.allpaid;
    }
    return `${strings.openText}`;
  };

  // useEffect(() => {
  //   setloading(true);
  //   getGroupMembers(authContext.entity.uid, authContext)
  //     .then((response) => {
  //       setloading(false);
  //       setRecipientData(response.payload);

  //     .catch((e) => {
  //       setloading(false);
  //       setTimeout(() => {
  //         Alert.alert(strings.alertmessagetitle, e.message);
  //       }, 10);
  //     });
  // }, [authContext]);

  // useEffect(() => {
  //   setloading(true);
  //   addRecipientList(batchData?.invoice_group, authContext)
  //     .then((response) => {
  //       setloading(false);
  //       setNewRecipientData(response.payload);

  //       const result = [];
  //       for (let i = 0; i < recipientData.length; i++) {
  //         if (
  //           response.payload.filter(
  //             (obj) => obj.user_id === recipientData[i].user_id,
  //           ).length > 0
  //         ) {
  //           console.log('found');
  //         } else {
  //           result.push(recipientData[i]);
  //         }
  //       }
  //       setAddNewList(result);
  //     })
  //     .catch((e) => {
  //       setloading(false);
  //       setTimeout(() => {
  //         Alert.alert(strings.alertmessagetitle, e.message);
  //       }, 10);
  //     });
  // }, [authContext, batchData?.invoice_group, recipientData]);

  useEffect(() => {
    console.log(batchData, 'From batchdata');

    const allTitle = format(
      strings.allNInvoice,
      batchListByFilter(Verbs.allStatus).length,
    );

    const paidTitle = format(
      strings.paidNInvoice,
      batchListByFilter(Verbs.paid).length,
    );

    const openTitle = format(
      strings.openNInvoice,
      batchListByFilter(Verbs.open).length,
    );

    setTabs([allTitle, paidTitle, openTitle]);
  }, [batchData]);

  const renderRecipientView = ({item}) => (
    <MemberInvoiceView
      invoice={item}
      onPressCard={() =>
        navigation.navigate('InvoiceDetailScreen', {
          from,
          invoice: item,
        })
      }
    />
  );

  const batchListByFilter = useCallback(
    (status) => {
      if (status === Verbs.allStatus) {
        return batchData.invoices;
      }
      if (status === Verbs.paid) {
        return batchData.invoices.filter(
          (obj) => obj.invoice_status === Verbs.paid,
        );
      }
      if (status === Verbs.open) {
        return batchData.invoices.filter(
          (obj) =>
            obj.invoice_status === Verbs.UNPAID ||
            obj?.invoice_status === Verbs.PARTIALLY_PAID,
        );
      }
    },
    [batchData],
  );

  const sendInvoiceValidation = () => {
    if (selectedRecipient.length <= 0) {
      Alert.alert(strings.selectRecipientValidation);
      return false;
    }

    return true;
  };

  const cancelInvoiceValidation = () => {
    if (newRecipientData.filter((e) => e.selected).length <= 0) {
      Alert.alert(strings.selectRecipientValidation);
      return false;
    }

    return true;
  };

  const reSendInvoiceValidation = () => {
    if (!selectInvoiceType) {
      Alert.alert(strings.selectInvoiceTypeValidation);
      return false;
    }

    return true;
  };

  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => resendModalRef.current.close()}>
          {strings.cancel}
        </Text>

        <Text style={styles.titleText}>
          {selectedActionSheetOpetion === 1
            ? strings.addRecipientText
            : strings.resendInvoiceText}
        </Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            if (from === 'batch') {
              if (selectedActionSheetOpetion === 0) {
                if (reSendInvoiceValidation()) {
                  resendModalRef.current.close();
                  setloading(true);

                  const body = {};
                  body.type =
                    (selectInvoiceType === strings.openInvoiceText &&
                      Verbs.open) ||
                    (selectInvoiceType === strings.paidInvoiceText &&
                      Verbs.paid) ||
                    (selectInvoiceType === strings.allInvoiceText &&
                      strings.allType);
                  body.email_sent = false;

                  resendBatchInvoice(batchData.invoice_group, body, authContext)
                    .then(() => {
                      console.log('');
                      setloading(false);
                      setSelectedRecipient([]);

                      resendModalRef.current.close();
                    })
                    .catch((e) => {
                      setloading(false);
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, e.message);
                      }, 10);
                    });
                }
              } else if (selectedActionSheetOpetion === 1) {
                if (sendInvoiceValidation()) {
                  resendModalRef.current.close();
                  setloading(true);

                  const body = {};
                  body.member_ids = selectedRecipient;
                  body.email_sent = true;

                  createBatchInvoice(batchData.invoice_group, body, authContext)
                    .then(() => {
                      console.log('');
                      setloading(false);
                      setSelectedRecipient([]);

                      resendModalRef.current.close();
                    })
                    .catch((e) => {
                      setloading(false);
                      setTimeout(() => {
                        Alert.alert(strings.alertmessagetitle, e.message);
                      }, 10);
                    });
                }
              }
            }
          }}>
          {strings.send}
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const RecipientsModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => {
            setSelectedRecipient([]);
            recipientModalRef.current.close();
          }}>
          {strings.cancel}
        </Text>

        <Text style={styles.titleText}>Recipients</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            if (selectedActionSheetOpetion === 1) {
              const selectedMember = addNewList.filter((e) => e.selected);
              const result = selectedMember.map((obj) => {
                if (obj.selected) {
                  return obj.user_id;
                }
              });
              console.log(result);
              setSelectedRecipient(result);
              recipientModalRef.current.close();
            }

            if (selectedActionSheetOpetion === 2) {
              const selectedMember = newRecipientData.filter((e) => e.selected);
              const result = selectedMember.map((obj) => {
                if (obj.selected) {
                  return obj.user_id;
                }
              });
              console.log(result);
              setSelectedRecipient(result);

              Alert.alert(
                format(
                  strings.cancelInvoiceAlertText,
                  newRecipientData.filter((e) => e.selected).length,
                ),
                '',
                [
                  {
                    text: strings.back,
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',

                    // style: 'destructive',
                    onPress: () => {
                      // deleteInvoiceByID();
                      if (cancelInvoiceValidation()) {
                        cancelBatchInvoiceByID();
                      }
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }}>
          Done
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const renderRecipients = ({item, index}) => (
    <>
      <View style={styles.recipientContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                item?.thumbnail && item?.thumbnail !== ''
                  ? {uri: item?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImgStyle}
            />
          </View>
          <Text style={styles.profilenameStyle}>
            {item?.first_name} {item?.last_name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // onTagCancelPress({ item, index }
            setRecipientAllData(false);
            const tempObj = item;
            tempObj.selected = !tempObj?.selected;
            if (selectedActionSheetOpetion === 1) {
              addNewList[index] = tempObj;
              setAddNewList([...addNewList]);
            }
            if (selectedActionSheetOpetion === 2) {
              newRecipientData[index] = tempObj;
              setNewRecipientData([...newRecipientData]);
            }
          }}>
          <Image
            source={
              item?.selected ? images.orangeCheckBox : images.uncheckEditor
            }
            style={styles.checkButton}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const cancelBatchInvoiceByID = () => {
    setloading(true);

    const body = {};
    body.member_ids = newRecipientData.map((obj) => {
      if (obj.selected) {
        return obj.user_id;
      }
    });
    body.email_sent = true;
    cancelBatchInvoice(batchData?.invoice_group, body, authContext)
      .then(() => {
        setloading(false);
        setSelectedRecipient([]);
        recipientModalRef.current.close();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getPaidInvoices = () => {
    let PaidInvoices = 0;

    batchData.invoices.map((item) => {
      if (item.invoice_status !== Verbs.UNPAID) {
        PaidInvoices += PaidInvoices;
      }
    });
    console.log(PaidInvoices);

    return PaidInvoices;
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View
        style={{
          backgroundColor: colors.lightGrayBackground,
        }}>
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 15,
          }}>
          {/* invoivw title */}

          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: fonts.RBold,
            }}>
            {batchData.invoice_description}
          </Text>

          {/* Recepints */}
          <View
            style={{
              marginTop: 20,
            }}>
            <Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  lineHeight: 30,
                }}>
                {batchData.invoices.length}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 30,
                }}>
                {' '}
                {strings.recipients}
              </Text>
            </Text>
          </View>

          <Text
            style={{
              color: colors.userPostTimeColor,
              fontSize: 13,
              fontFamily: fonts.RRegular,
              lineHeight: 18,
              marginBottom: 15,
            }}>{`${strings.issuedBy} ${
            authContext.entity.obj.full_name ??
            authContext.entity.obj.group_name
          }`}</Text>

          {/* Issues At */}

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              lineHeight: 24,
              marginBottom: 5,
            }}>
            {format(
              strings.issuedAt,
              moment(getJSDate(batchData.created_date)).format(
                'MMM DD, YYYY, HH:mm',
              ),
            )}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              lineHeight: 24,
            }}>
            {format(
              strings.dueAtNText,
              moment(getJSDate(batchData.due_date)).format('MMM DD, YYYY'),
            )}
          </Text>

          {/* Amount invoives / Copy */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
              }}>
              {strings.amountInvoicedCopy}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RMedium,
                lineHeight: 24,
              }}>
              {` ${batchData.invoice_open_total} ${currency_type}`}
            </Text>
          </View>
          {/* Total Amount invoices section */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                lineHeight: 24,
              }}>
              {strings.totalAmountInvoice}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.RMedium,
                lineHeight: 24,
              }}>
              {` ${batchData.invoice_total} ${currency_type}`}
            </Text>
          </View>

          {/* Progress Bar */}

          <LinearGradient
            colors={[colors.progressBarColor, colors.progressBarColor]}
            style={styles.paymentProgressView}>
            {/* this need to show conditionally when there is 0% amount paid */}

            {batchData.amount_due === batchData.amount_remaining && (
              <Text
                style={{
                  color: colors.neonBlue,
                  fontFamily: fonts.RBold,
                  fontSize: 12,
                  marginLeft: 10,
                  height: 18,

                  alignSelf: 'flex-start',
                }}>
                {`${
                  (batchData.invoice_paid_total /
                    batchData.invoice_open_total) *
                  100
                }%`}
              </Text>
            )}

            <LinearGradient
              colors={[colors.progressBarBgColor, colors.progressBarBgColor]}
              style={{
                borderWidth: 1,
                height: 18,
                borderColor: colors.neonBlue,

                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
                width: `${
                  (batchData.invoice_paid_total /
                    batchData.invoice_open_total) *
                  100
                }%`,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.neonBlue,
                  fontFamily: fonts.RBold,
                  fontSize: 12,
                  marginLeft: 30,
                  height: 18,
                  alignSelf: 'flex-end',
                }}>
                {`${
                  (batchData.invoice_paid_total /
                    batchData.invoice_open_total) *
                  100
                }%`}
              </Text>
            </LinearGradient>
          </LinearGradient>

          {/* status container */}

          <View style={{marginBottom: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.statusText}>{strings.status}</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {
                    color:
                      batchData.amount_due === batchData.amount_remaining
                        ? colors.darkThemeColor
                        : colors.gameDetailColor,
                  },
                ]}>
                {getStatus()}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}>Total Number of Invoices</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {color: colors.lightBlackColor},
                ]}>
                {`${batchData.invoices.length}`}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}>{strings.paidText} </Text>
              <Text style={[styles.amountTextStyle, {color: colors.neonBlue}]}>
                {getPaidInvoices()}
                {/* {`${batchData.invoice_paid_total}`} */}
              </Text>
            </View>
            <View style={styles.statusRows}>
              <Text style={styles.statusText}>Open</Text>
              <Text
                style={[
                  styles.amountTextStyle,
                  {color: colors.darkThemeColor},
                ]}>
                {`${batchData.invoices.length}` - `${getPaidInvoices()}   `}
              </Text>
            </View>
          </View>
        </View>

        <View style={{backgroundColor: colors.whiteColor}}>
          <TCScrollableProfileTabs
            tabItem={tabs}
            tabVerticalScroll={false}
            onChangeTab={(Tab) => setTabNumber(Tab.i)}
            currentTab={tabNumber}
            customStyle={{
              marginTop: 15,
            }}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: colors.whiteColor,
          }}
          data={
            (tabNumber === 0 && batchListByFilter(Verbs.open)) ||
            (tabNumber === 1 && batchListByFilter(Verbs.paid)) ||
            (tabNumber === 2 && batchListByFilter(strings.allType))
          }
          renderItem={renderRecipientView}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <ActionSheet
        ref={batchActionsheet}
        options={[
          strings.resendInvoiceText,
          strings.addRecipientText,
          strings.cancelInvoicesInBatch,
          strings.cancel,
        ]}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            setSelectedActionSheetOpetion(0);
            resendModalRef.current.open();
          }
          if (index === 1) {
            setSelectedActionSheetOpetion(1);
            resendModalRef.current.open();
          }
          if (index === 2) {
            Alert.alert(
              Platform.OS === 'android'
                ? ''
                : format(
                    strings.areYouSureWantoCancelAllInvoices,
                    route.params?.grpname?.obj.group_name,
                  ),
              Platform.OS === 'android'
                ? format(
                    strings.areYouSureWantoCancelAllInvoices,
                    route.params?.grpname?.obj.group_name,
                  )
                : '',
              [
                {
                  text: strings.no,
                  onPress: () => console.log('no'),
                },
                {
                  text: strings.cancel,
                  onPress: () => console.log('Cancel'),
                  style: 'destructive',
                },
              ],
            );
          }
        }}
      />

      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight={true}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          snapPoint={heightPercentageToDP(50)}
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
            {selectedActionSheetOpetion === 0 && (
              <View>
                <View
                  style={{
                    marginBottom: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 15,
                    marginRight: 15,
                    flexDirection: 'row',
                  }}>
                  <Text>{strings.sendTo}</Text>
                  <InvoiceTypeSelection
                    dataSource={[
                      {
                        label: strings.openInvoiceText,
                        value: strings.openInvoiceText,
                      },
                      {
                        label: strings.paidInvoiceText,
                        value: strings.paidInvoiceText,
                      },
                      {
                        label: strings.allInvoiceText,
                        value: strings.allInvoiceText,
                      },
                    ]}
                    value={selectInvoiceType}
                    onValueChange={(value) => {
                      setSelectInvoiceType(value);
                    }}
                  />
                </View>
                <TCThinDivider width={'92%'} />
              </View>
            )}
            {selectedActionSheetOpetion === 1 && (
              <View>
                <TouchableOpacity
                  onPress={() => recipientModalRef.current.open()}
                  style={{
                    marginBottom: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 15,
                    marginRight: 15,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={
                      selectedRecipient.length > 0
                        ? styles.totalRecipient
                        : styles.recipientText
                    }>
                    {selectedRecipient.length > 0
                      ? format(
                          strings.NreciepientText,
                          selectedRecipient.length,
                        )
                      : strings.addRecipientText}
                  </Text>
                  <Image
                    style={styles.nextIconStyle}
                    source={images.nextArrow}
                  />
                </TouchableOpacity>
                <TCThinDivider width={'92%'} />
              </View>
            )}
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
                  {batchData?.invoice_title}
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
                  {batchData?.invoice_description}
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
                  ${batchData?.invoice_total}
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
                  {moment(batchData?.due_date * 1000).format(
                    'ddd, MMM DD, YYYY',
                  )}
                </Text>
              </View>
            </View>
          </View>
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight={true}
          overlayStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          snapPoint={heightPercentageToDP(50)}
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
          HeaderComponent={RecipientsModalHeader}
          ref={recipientModalRef}>
          <View>
            <View>
              {selectedActionSheetOpetion === 2 && (
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 20,
                    color: colors.lightBlackColor,
                    margin: 15,
                    marginTop: 0,
                  }}>
                  {strings.chooseReciepientText}
                </Text>
              )}

              <View
                style={{
                  marginBottom: 15,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginLeft: 15,
                  marginRight: 15,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  {strings.allType}
                </Text>
                {/* <Image source={images.orangeCheckBox} style={styles.checkButton} /> */}
                <TouchableOpacity
                  onPress={() => {
                    setRecipientAllData(!recipientAllData);
                    if (selectedActionSheetOpetion === 1) {
                      const result = addNewList.map((el) => {
                        const o = {...el};
                        o.selected = !recipientAllData;
                        return o;
                      });
                      setAddNewList(result);
                    }
                    if (selectedActionSheetOpetion === 2) {
                      const result = newRecipientData.map((el) => {
                        const o = {...el};
                        o.selected = !recipientAllData;
                        return o;
                      });
                      setNewRecipientData([...result]);
                    }
                  }}>
                  <Image
                    source={
                      recipientAllData
                        ? images.orangeCheckBox
                        : images.uncheckEditor
                    }
                    style={styles.checkButton}
                  />
                </TouchableOpacity>
              </View>
              <TCThinDivider width={'92%'} />
            </View>

            <View style={{margin: 15}}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
                {strings.membersTitle}
              </Text>
              <FlatList
                data={
                  (selectedActionSheetOpetion === 2 && newRecipientData) ||
                  (selectedActionSheetOpetion === 1 && addNewList)
                }
                renderItem={renderRecipients}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  navTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },

  townsCupthreeDotIcon: {
    height: 25,
    resizeMode: 'contain',
    width: 25,
  },
  rightHeaderView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
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
  nextIconStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 14,
    width: 8,
    marginEnd: 10,
    tintColor: colors.userPostTimeColor,
  },

  checkButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  profileImgStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    borderRadius: 60,
  },
  profilenameStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    height: 34,
    width: 34,
    backgroundColor: colors.offwhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 64,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  recipientText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  totalRecipient: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.themeColor,
  },
  paymentProgressView: {
    height: 20,
    backgroundColor: colors.thinDividerColor,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.darkThemeColor,
    marginTop: 15,
    marginBottom: 25,
  },
  statusText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    lineHeight: 24,
    color: colors.lightBlackColor,
  },
  amountTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.darkThemeColor,
  },
  statusRows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  backArrowStyle: {
    height: 20,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
