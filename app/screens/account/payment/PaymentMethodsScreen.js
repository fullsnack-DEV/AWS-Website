import React, {
  useState, useEffect, useContext, useLayoutEffect,
} from 'react';
import {
  View, StyleSheet, Alert, Text, Image,
  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import stripe from 'tipsi-stripe'
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../auth/context'
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AppleStyleSwipeableRow from '../../../components/notificationComponent/AppleStyleSwipeableRow';
import {
  paymentMethods, attachPaymentMethod, deletePaymentMethod, updateUserProfile,
} from '../../../api/Users';
import strings from '../../../Constants/String'
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import * as Utility from '../../../utils';
import images from '../../../Constants/ImagePath';
import { publishableKey } from '../../../utils/constant';
import TCTouchableLabel from '../../../components/TCTouchableLabel';

export default function PaymentMethodsScreen({ navigation, route }) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext)
  const isFocused = useIsFocused();
  const [selectedCard, setSelectedCard] = useState();
  const [cards, setCards] = useState([])

  useEffect(() => {
    if (isFocused) { getPaymentMethods() }
  }, [isFocused])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => {
          if (selectedCard) {
            onCardSelected(selectedCard)
          } else {
            Alert.alert(strings.selectAnyCard)
          }
        } }>Done</Text>
      ),
    });
  }, [navigation, loading, selectedCard])
  const getPaymentMethods = async () => {
    setloading(true)
    paymentMethods(authContext)
      .then((response) => {
        const selectCard = response?.payload?.filter((item) => item?.id === authContext?.entity?.obj?.source)
        if (selectCard?.length > 0) setSelectedCard(selectCard[0]);
        setCards([...response.payload])
        setloading(false)
        if (response.payload.length === 0) {
          openNewCardScreen();
        }
      })
      .catch((e) => {
        console.log('error in payment method', e)
        setloading(false)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.3)
      })
  }

  const onCardSelected = async (item) => {
    setloading(true);
    const body = { source: item?.id }
    updateUserProfile(body, authContext).then(async (response) => {
      const currentEntity = {
        ...authContext.entity, obj: response.payload,
      }
      authContext.setEntity({ ...currentEntity })
      await Utility.setStorage('authContextEntity', { ...currentEntity })
      if (route?.params?.comeFrom !== 'HomeScreen') {
        navigation.navigate(route?.params?.comeFrom, {
          paymentMethod: item,
        });
      } else {
        navigation.goBack();
      }
    }).catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e);
      }, 0.7);
    })
  }

  const onDeleteCard = (item) => {
    Alert.alert(strings.alertmessagetitle, `Do you want remove card ending with ${item.card.last4} from your account to ?`, [
      {
        text: strings.cancel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: strings.yes,
        onPress: () => {
          setloading(true)
          deletePaymentMethod(item.id, authContext)
            .then(() => {
              const newCards = cards.filter((card) => card.id !== item.id)
              setCards(newCards)
              setloading(false)
            })
            .catch((e) => {
              console.log('error in payment method onDeleteCard', e)
              setloading(false)
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, e.message);
              }, 0.3)
            })
        },
      },
    ],
    { cancelable: true })
  };

  const renderCard = ({ item }) => (
    <AppleStyleSwipeableRow style={{ height: 70 }} onPress={() => onDeleteCard(item)} color={colors.redDelColor} image={images.deleteIcon}>

      {selectedCard && selectedCard?.id === item.id ? <LinearGradient
          colors={ [colors.orangeEventColor, colors.assistTextColor] }
          style={ styles.paymentCardRow }>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { setSelectedCard(item) }}>
          <View style={{ flexDirection: 'column', width: '60%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.whiteColor,
              }}>{Utility.capitalize(item.card.brand)}</Text>
              <Text style={{
                marginLeft: 12,
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.whiteColor,
              }}>{Utility.capitalize(item.card.brand) }</Text>
              <Text style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.whiteColor,
              }}>{strings.endingin}</Text>
              <Text style={{
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.whiteColor,
              }}>{item.card.last4}</Text>
            </View>
            <View>
              <Text style={{
                color: colors.whiteColor,
                fontFamily: fonts.RRegular,
                fontSize: 14,
                marginTop: 5,
              }}>Expires {item.card.exp_month} / {item.card.exp_year}</Text>

            </View>

          </View>
          <View style={{ width: '40%', flexDirection: 'row-reverse', alignSelf: 'center' }}>
            <Image
            source={ images.whiteTick }
            style={{ height: 15, width: 15, resizeMode: 'contain' }}
          />
          </View>

        </TouchableOpacity>
      </LinearGradient> : <View style={styles.paymentCardRow}>
        <TouchableOpacity style={{

        }} onPress={() => { setSelectedCard(item) }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>{Utility.capitalize(item.card.brand)}</Text>
            <Text style={{
              marginLeft: 12,
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>{Utility.capitalize(item.card.brand) }</Text>
            <Text style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>{strings.endingin}</Text>
            <Text style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              color: colors.lightBlackColor,
            }}>{item.card.last4}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{
              color: colors.lightBlackColor,
              fontFamily: fonts.RRegular,
              fontSize: 14,
              marginTop: 5,
            }}>Expires {item.card.exp_month} / {item.card.exp_year}</Text>
          </View>
        </TouchableOpacity>

      </View>}

    </AppleStyleSwipeableRow>
  )

  const onSaveCard = async (paymentMethod) => {
    setloading(true)
    const params = {
      payment_method: paymentMethod.id,
    }
    attachPaymentMethod(params, authContext)
      .then(() => {
        getPaymentMethods();
      })
      .catch((e) => {
        console.log('error in onSaveCard', e)
        setloading(false)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.3)
      })
  }

  const openNewCardScreen = () => {
    stripe.setOptions({
      publishableKey,
    })
    stripe.paymentRequestWithCardForm({
      requiredBillingAddressFields: 'zip',
      theme: {
        accentColor: colors.orangeColor,
      },
    }).then((token) => {
      console.log('card', token)
      onSaveCard(token);
    }).catch((e) => {
      console.log('error in openNewCardScreen', e)
      setloading(false)
      if (e.message !== 'Cancelled by user') {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 0.3)
      }
    })
  }

  const renderFooter = () => (
    <View style={{ marginBottom: 5 }}>
      <TCTouchableLabel
            title={
                strings.addOptionMessage
            }
            showNextArrow={true}
            onPress={() => {
              openNewCardScreen()
            }}
          />
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Text style={{
        marginLeft: 15, marginTop: 15, color: colors.lightBlackColor, fontFamily: fonts.RRegular, fontSize: 20,
      }}>{strings.selectPaymentMethod}</Text>
      <FlatList
            style={{ marginTop: 15 }}
              data={cards}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
          />
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  paymentCardRow: {
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 10,
    elevation: 2,
    height: 70,
    backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    paddingHorizontal: 15,

  },
})
