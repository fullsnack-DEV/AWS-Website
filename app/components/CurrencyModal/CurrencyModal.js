import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {getCountry} from 'country-currency-map';
import CustomModalWrapper from '../CustomModalWrapper';
import {
  activeCurerncy,
  currencyList,
  ModalTypes,
} from '../../Constants/GeneralConstants';
import {strings} from '../../../Localization/translation';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';
import {showAlert} from '../../utils';

const CurrencyModal = ({
  isVisible,
  closeList = () => {},
  onNext = () => {},
  existedCurrency = '',
  modalType = ModalTypes.style1,
}) => {
  const authContext = useContext(AuthContext);
  const [selectedCurrency, setSelectedCurrency] = useState(Verbs.usd);
  const [currencydata, setCurrencydata] = useState();

  useEffect(() => {
    setCurrencydata(currencyList);
    setSelectedCurrency(Verbs.usd);

    const currency = getCountry(authContext.entity.obj.country);

    if (currency !== undefined) {
      const index = currencyList.findIndex(
        (i) => i.currency === currency.currency,
      );
      currency.countryName = authContext.entity.obj.country;

      if (index !== -1) {
        const removedItem = currencyList.splice(index, 1);
        currencyList.unshift(removedItem[0]);
        setCurrencydata([...currencyList]);
        setSelectedCurrency(currency.currency);
      } else {
        currencyList.unshift(currency);

        setSelectedCurrency(currency.currency);
      }
    }
  }, [authContext, existedCurrency]);

  const RendeCurrencies = ({item, index}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        if (activeCurerncy.includes(item.currency)) {
          setSelectedCurrency(item.currency);
          onNext(item.currency);
          closeList();
        } else {
          showAlert(strings.otherCurrecy);
        }
      }}>
      <View
        style={{
          paddingHorizontal: 35,
          paddingVertical: 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              lineHeight: 24,
              color:
                item.currency === selectedCurrency
                  ? colors.orangeColor
                  : colors.lightBlackColor,
            }}>
            {item.countryName}
          </Text>
          {index === 0 && (
            <Text
              style={{
                fontSize: 12,
                color: colors.userPostTimeColor,
                lineHeight: 13,
                marginTop: 2,
              }}>
              {strings.homeCountry}
            </Text>
          )}
        </View>

        <Text
          style={[
            styles.languageList,
            {
              color:
                item.currency === selectedCurrency
                  ? colors.orangeColor
                  : colors.lightBlackColor,
            },
          ]}>
          {item.currency}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={modalType}
      title={strings.changeCurrency}
      containerStyle={{padding: 0}}>
      <FlatList
        data={currencydata}
        ItemSeparatorComponent={() => <TCThinDivider />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={RendeCurrencies}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default CurrencyModal;
