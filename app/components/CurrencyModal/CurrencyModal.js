import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import {getCountry} from 'country-currency-map';
import CustomModalWrapper from '../CustomModalWrapper';
import {currencyList, ModalTypes} from '../../Constants/GeneralConstants';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCThinDivider from '../TCThinDivider';
import AuthContext from '../../auth/context';

export default function CurrencyModal({isVisible, closeList, onNext}) {
  const authContext = useContext(AuthContext);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [currencydata, setCurrencydata] = useState();

  useEffect(() => {
    setCurrencydata(currencyList);

    const currency = getCountry(authContext.entity.obj.country);

    if (currency !== undefined) {
      const index = currencyList.findIndex((i) => i === currency.currency);

      if (index !== -1) {
        const removedItem = currencyList.splice(index, 1);
        currencyList.unshift(removedItem[0]);
        setCurrencydata([...currencyList]);
        setSelectedCurrency(currency.currency);
      } else {
        currencyList.unshift(currency.currency);
        setSelectedCurrency(currency.currency);
      }
    }
  }, [authContext]);

  const RendeCurrencies = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelectedCurrency(item);
      }}>
      <View
        style={{
          paddingHorizontal: 40,
          paddingVertical: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item}</Text>
        <View style={styles.checkbox}>
          {selectedCurrency === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style1}
      onRightButtonPress={() => onNext(selectedCurrency)}
      headerRightButtonText={strings.next}
      title={'Currency'}
      containerStyle={{padding: 0, width: '100%', height: '100%'}}
      showBackButton>
      <FlatList
        data={currencydata}
        ItemSeparatorComponent={() => <TCThinDivider />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={RendeCurrencies}
      />
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
