/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';

// import ActivityLoader from '../../../components/loader/ActivityLoader';

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import { heightPercentageToDP as hp } from '../../../utils';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import InvoiceAmount from '../../../components/invoice/InvoiceAmount';
import images from '../../../Constants/ImagePath';
import PaymentLogs from '../../../components/invoice/PaymentLogs';

export default function TeamInvoiceDetailScreen({ navigation, route }) {
  const { from } = route?.params;

  // const [loading, setloading] = useState(false);
  const actionSheet = useRef();
  const resendModalRef = useRef();
  const recipientModalRef = useRef();
  // const isFocused = useIsFocused();
  const [recipientData, setRecipientData] = useState([
    { name: 'Kishan Makani' },
    { name: 'Karan Makani' },
    { name: 'Vineet Patidar' },
    { name: 'Arvind Patidar' },
  ]);
  const [recipientAllData, setRecipientAllData] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.rightHeaderView}>
          <TouchableOpacity
            onPress={() => {
              actionSheet.current.show();
            }}>
            <Image
              source={images.threeDotIcon}
              style={styles.townsCupSettingIcon}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const renderLogView = ({ item }) => {
    console.log('item', item);
    return (
      <PaymentLogs
        data={item}
        onPressCard={() => {
          navigation.navigate('LogDetailScreen');
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
          Cancel
        </Text>

        <Text style={styles.titleText}>Resend Invoice</Text>
        <Text style={styles.sendText}>Send</Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const RecipientsModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.headerButtonStyle}>
        <Text
          style={styles.cancelText}
          onPress={() => recipientModalRef.current.close()}>
          Cancel
        </Text>

        <Text style={styles.titleText}>Recipients</Text>
        <Text
          style={styles.sendText}
          onPress={() => {
            if (from === 'member') {
              Alert.alert(
                'Are you sure that you want to cancel 5 invoices?',
                '',
                [
                  {
                    text: 'Back',
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',

                    // style: 'destructive',
                    onPress: () => {
                      Alert.alert('Cancel');
                    },
                  },
                ],
                { cancelable: false },
              );
            } else {
              recipientModalRef.current.close();
            }
          }}>
          Done
        </Text>
      </View>

      <View style={styles.headerSeparator} />
    </View>
  );

  const renderRecipients = ({ item, index }) => (
    <>
      <View style={styles.recipientContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image source={images.dummyPhoto} style={styles.profileImgStyle} />
          </View>
          <Text style={styles.profilenameStyle}>{item?.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            // onTagCancelPress({ item, index }
            setRecipientAllData(false);
            const tempObj = item;
            tempObj.selected = !tempObj?.selected;
            recipientData[index] = tempObj;
            setRecipientData([...recipientData]);
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

  return (
    <View style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}

      <View style={{ margin: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={images.dummyPhoto}
            style={styles.invoiceProfileStyle}
          />
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            {'Michael Jordan'}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Invoice no.: TR-7077071
        </Text>
        <Text
          style={{
            fontFamily: fonts.RRegular,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          Due at: May 11, 2020
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
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: fonts.RBold,
              fontSize: 12,
            }}>
            $12.50 CAD
          </Text>
        </LinearGradient>
      </LinearGradient>

      <InvoiceAmount
        status={'Open'}
        currencyType={'CAD'}
        totalAmount={'99.00'}
        paidAmount={'85.00'}
        openAmount={'55.00'}
      />

      <TCThinDivider marginTop={15} width={'94%'} />

      <View style={{ margin: 15 }}>
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
          Membership fee for May
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          fontSize: 12,
          color: colors.userPostTimeColor,
          marginLeft: 15,
        }}>
        {'Logged by Michael Jordan at May 1, 2020 11:25am'}
      </Text>
      {/* <TouchableOpacity
        style={styles.paymentContainer}
        onPress={() => {
          Alert.alert('ADD PAYMENT OR REFUND');
        }}>
        <Text style={styles.cardDetailText}>+Add Payment or Refund</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.paymentContainer}
        onPress={() => {
          navigation.navigate('AddLogScreen');
        }}>
        <Text style={styles.cardDetailText}>Log Manually</Text>
      </TouchableOpacity>

      <Text
        style={{
          fontFamily: fonts.RMedium,
          fontSize: 20,
          color: colors.lightBlackColor,
          margin: 15,
        }}>
        Log
      </Text>
      <FlatList
        data={['1', '2', '3', '4', '5']}
        renderItem={renderLogView}
        keyExtractor={(item, index) => index.toString()}
      />

      <ActionSheet
        ref={actionSheet}
        options={['Refund', 'Resend Invoice', 'Cancel Invoice', 'Cancel']}
        cancelButtonIndex={3}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            Alert.alert('Refund');
          } else if (index === 1) {
            // Alert.alert('Resend');
            resendModalRef?.current?.open();
          } else if (index === 2) {
            if (from === 'member') {
              Alert.alert(
                'Are you sure that you want to cancel this invoice?',
                '',
                [
                  {
                    text: 'Back',
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',

                    // style: 'destructive',
                    onPress: () => {
                      Alert.alert('Cancel');
                    },
                  },
                ],
                { cancelable: false },
              );
            } else {
              recipientModalRef.current.open();
            }
          }
        }}
      />

      <Portal>
        <Modalize
          withHandle={false}
          adjustToContentHeight={true}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          snapPoint={hp(50)}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          HeaderComponent={ModalHeader}
          ref={resendModalRef}>
          <View>
            {from === 'batch' && <View>
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
                  style={{
                    fontFamily: fonts.RMedium,
                    fontSize: 16,
                    color: colors.themeColor,
                  }}>
                  New 11 recipients
                </Text>
                <Image style={styles.nextIconStyle} source={images.nextArrow} />
              </TouchableOpacity>
              <TCThinDivider width={'92%'} />
            </View>}
            <View
              style={{ margin: 15, backgroundColor: colors.lightGrayBackground }}>
              <View style={{ margin: 15 }}>
                <Text
                  style={{
                    fontFamily: fonts.RLight,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Invoice Title
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.RMedium,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Registration Fee
                </Text>
              </View>
              <View style={{ margin: 15 }}>
                <Text
                  style={{
                    fontFamily: fonts.RLight,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Invoice Description
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Different fees must be paid during the trademark registration
                  process, including for the purposes of opposition and
                  expungement proceedings, or to sit on the trademark agents
                  qualifying examination, or for the entry, maintenance or
                  reinstatement on the list of trademark agents.
                </Text>
              </View>
              <View style={{ margin: 15 }}>
                <Text
                  style={{
                    fontFamily: fonts.RLight,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  Invoice Amount
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.RMedium,
                    fontSize: 20,
                    color: colors.lightBlackColor,
                  }}>
                  $4.00
                </Text>
              </View>
              <View style={{ margin: 15 }}>
                <Text
                  style={{
                    fontFamily: fonts.RLight,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>Due at</Text>
                <Text
                  style={{
                    fontFamily: fonts.RMedium,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>May 19, 2020
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
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          snapPoint={hp(50)}
          modalStyle={{
            flex: 1,
            height: '86%',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          HeaderComponent={RecipientsModalHeader}
          ref={recipientModalRef}>
          <View>
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
                <Text
                  style={{
                    fontFamily: fonts.RRegular,
                    fontSize: 16,
                    color: colors.lightBlackColor,
                  }}>
                  All
                </Text>
                {/* <Image source={images.orangeCheckBox} style={styles.checkButton} /> */}
                <TouchableOpacity
                  onPress={() => {
                    // onTagCancelPress({ item, index }
                    setRecipientAllData(!recipientAllData);
                    const result = recipientData.map((el) => {
                      const o = { ...el };
                      o.selected = !recipientAllData;
                      return o;
                    });

                    setRecipientData([...result]);
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

            <View style={{ margin: 15 }}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
                Members
              </Text>
              <FlatList
                data={recipientData}
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
    shadowOffset: { width: 0, height: 1 },
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
});
