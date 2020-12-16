import React, {
  useState, useEffect, useContext,
} from 'react';
import {
  View, StyleSheet, Alert, Text, Image,
  FlatList,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import stripe from 'tipsi-stripe'
import AuthContext from '../../../auth/context'
import ActivityLoader from '../../../components/loader/ActivityLoader';
import AppleStyleSwipeableRow from '../../../components/notificationComponent/AppleStyleSwipeableRow';
import { paymentMethods, attachPaymentMethod, deletePaymentMethod } from '../../../api/Users';
import strings from '../../../Constants/String'
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';
import * as Utility from '../../../utils';
import images from '../../../Constants/ImagePath';
import { publishableKey } from '../../../utils/constant';

export default function PaymentMethodsScreen({ navigation, route }) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext)
  const isFocused = useIsFocused();
  const [cards, setCards] = useState([])

  useEffect(() => {
    if (isFocused) { getPaymentMethods() }
  }, [isFocused])

  const getPaymentMethods = async () => {
    setloading(true)
    paymentMethods(authContext)
      .then((response) => {
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
    if (route.params.comeFrom === 'CreateChallengeForm5') {
      navigation.navigate('CreateChallengeForm5', {
        paymentMethod: item,
      });
    }
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
    <AppleStyleSwipeableRow onPress={() => onDeleteCard(item)} color={colors.redDelColor} image={images.deleteIcon}>
      <View>
        <TouchableOpacity style={{
          height: 50,
          backgroundColor: colors.whiteColor,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
        }} onPress={() => { onCardSelected(item) }}>
          <View style={{
            backgroundColor: colors.orangeColor, padding: 4, paddingHorizontal: 4, borderRadius: 4,
          }}>
            <Text style={{
              fontFamily: fonts.RBold,
              fontSize: 12,
              fontStyle: 'italic',
              color: colors.whiteColor,
            }}>{item.card.brand.toUpperCase()}</Text>
          </View>
          <Text style={{
            marginLeft: 12,
            color: colors.orangeColor,
            fontFamily: fonts.RBold,
            fontSize: 16,
          }}>{Utility.capitalize(item.card.brand) }</Text>
          <Text style={{
            color: colors.orangeColor,
            fontFamily: fonts.RLight,
            fontSize: 16,
          }}>{strings.endingin}</Text>
          <Text style={{
            color: colors.orangeColor,
            fontFamily: fonts.RBold,
            fontSize: 16,
          }}>{item.card.last4}</Text>
        </TouchableOpacity>
      </View>
    </AppleStyleSwipeableRow>
  )

  const itemSeparator = () => (
    // Item Separator
    <View style={styles.listItemSeparatorStyle} />
  );

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
    <View style={{ marginTop: 15 }}>
      <View style={styles.sideLineStyle}></View>
      <TouchableOpacity onPress={openNewCardScreen}>
        <View style={{
          height: 44,
          backgroundColor: colors.whiteColor,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
        }}>
          <Image source={images.addRole} style={{ tintColor: colors.orangeColor }}/>
          <Text style={{
            marginLeft: 15, color: colors.orangeColor, fontFamily: fonts.RRegular, fontSize: 16,
          }}>{strings.addcard}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.sideLineStyle}></View>
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <Image style={{ width: '100%', height: 200 }}></Image>
      <FlatList
            style={{ marginTop: 15 }}
              data={cards}
              renderItem={renderCard}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={itemSeparator}
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
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.lightgrayColor,
  },
  sideLineStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.linesepratorColor,
  },
})
