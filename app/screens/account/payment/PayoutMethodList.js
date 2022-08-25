import React, {useState, useEffect, useContext, useMemo} from 'react';
import {View, StyleSheet, Alert, Text, FlatList} from 'react-native';

import {useIsFocused} from '@react-navigation/native';

import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AppleStyleSwipeableRow from '../../../components/notificationComponent/AppleStyleSwipeableRow';
import {payoutMethods, deletePayoutMethod} from '../../../api/Users';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCInnerLoader from '../../../components/TCInnerLoader';

export default function PayoutMethodList({navigation}) {
  const [loading, setloading] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setFirstTimeLoad(true);
      getPaymentMethods()
        .then(() => {
          setFirstTimeLoad(false);
        })
        .catch((error) => {
          setFirstTimeLoad(false);
          console.log(error);
        });
    }
  }, [isFocused]);

  const getPaymentMethods = () =>
    new Promise((resolve, reject) => {
      payoutMethods(authContext)
        .then((response) => {
          console.log('payout method:=>', response);
          setCards([...response.payload]);
          setloading(false);

          resolve(true);
        })
        .catch((e) => {
          reject(new Error(e.message));
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 0.3);
        });
    });

  const onDeleteCard = (item) => {
    Alert.alert(
      strings.alertmessagetitle,
      `Do you want remove account ending with ${item.last4} from your account to ?`,
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
            deletePayoutMethod(authContext)
              .then(() => {
                const newCards = cards.filter((card) => card.id !== item.id);
                setCards(newCards);
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

  const renderCard = ({item}) => (
    <AppleStyleSwipeableRow
      onPress={() => onDeleteCard(item)}
      color={colors.redDelColor}
      image={images.deleteIcon}>
      <View style={styles.paymentCardRow}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            {item.bank_name.toUpperCase()}
          </Text>

          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            {strings.endingin}
          </Text>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            {item.last4}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>
            {'Currency Type : '}
          </Text>
          <Text
            style={{
              marginLeft: 0,
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.themeColor,
            }}>
            {`${item.currency.toUpperCase()}`}
          </Text>
        </View>
      </View>
    </AppleStyleSwipeableRow>
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View>
        <Text style={styles.notAvailableTextStyle}>No Payout Method Yet</Text>
      </View>
    ),
    [],
  );

  const renderFooter = () => (
    <View style={{marginBottom: 5}}>
      {cards.length < 1 ? (
        <TCTouchableLabel
          title={strings.addPayoutMessage}
          showNextArrow={true}
          onPress={() => {
            // openNewCardScreen()
            navigation.navigate('PayoutMethodScreen');
          }}
        />
      ) : (
        <View />
      )}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Text
        style={{
          marginLeft: 15,
          marginTop: 15,
          color: colors.lightBlackColor,
          fontFamily: fonts.RRegular,
          fontSize: 20,
        }}>
        {strings.selectPayoutMethod}
      </Text>
      <TCInnerLoader visible={firstTimeLoad} size={50} />
      {!firstTimeLoad && (
        <FlatList
          style={{marginTop: 15}}
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
  },

  paymentCardRow: {
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 10,
    elevation: 2,
    height: 70,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  notAvailableTextStyle: {
    margin: 15,
    marginTop: 0,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.grayColor,
  },
});
