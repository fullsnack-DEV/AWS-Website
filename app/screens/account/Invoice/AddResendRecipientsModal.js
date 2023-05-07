// @flow
/* eslint-disable no-param-reassign */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import Verbs from '../../../Constants/Verbs';
import AddResendRecipientsCell from './AddResendRecipientsCell';
import images from '../../../Constants/ImagePath';
import BottomSheet from '../../../components/modals/BottomSheet';

const AddResendRecipientsModal = ({
  isVisible,
  onDone = () => {},
  onClose = () => {},
  invoices = [],
  selectedRecipients = [],
}) => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [visibleOptions, setVisibleOptions] = useState();
  const [selectedOption, setSelectedOption] = useState(strings.allInvoiceText);

  useEffect(() => {
    if (isVisible) {
      const l_selectedInvoices = [];
      invoices.forEach((recipient) => {
        if (
          selectedRecipients.some(
            (reci) => reci.invoice_id === recipient.invoice_id,
          )
        ) {
          recipient.isChecked = true;
          l_selectedInvoices.push(recipient);
        } else {
          recipient.isChecked = false;
        }
      });
      setSelectedInvoices(l_selectedInvoices);
    }
  }, [isVisible]);

  const showSelectedRecipientsText = () => {
    if (selectedInvoices.length > 0) {
      return selectedInvoices.length === 1
        ? `1 ${strings.person}`
        : `${selectedInvoices.length} ${strings.people}`;
    }

    return strings.noneselected;
  };

  const showHeaderRow = () => renderSelectMemberRow(true);

  const renderSelectMemberRow = () => (
    <>
      {/* Code for open,  paid and all invoice selection */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',

          justifyContent: 'space-between',
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}>
        {/* image */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.placeholderView}>
            <Image source={images.invoiceIcon} style={styles.profileImage} />
          </View>
          {/* name  icon */}

          <TouchableOpacity
            onPress={() => setVisibleOptions(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 19,
                fontFamily: fonts.RMedium,
              }}>
              {selectedOption}
            </Text>
            <Image
              source={images.dropDownArrow2}
              style={{
                height: 13,
                width: 13,
                marginLeft: 5,
                marginTop: -2,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* checkbox */}

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            width: 42,
          }}>
          <Image source={images.orangeCheckBox} style={styles.checkImage} />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.dividerLine} />
    </>
  );

  const renderRecipient = ({item, index}) => (
    <AddResendRecipientsCell
      invoice={item}
      index={index}
      onSelecteRow={selectCurrentEntity}
    />
  );

  const onCloseThisModal = () => {
    onClose();
  };

  const selectCurrentEntity = ({invoice, index}) => {
    if (selectedInvoices.length > Verbs.MAXIMUM_RECIPIENT_INVOICE - 1) {
      Alert.alert(strings.maximuminvoicerecipientvalidation);
      return;
    }

    const l_selectedInvoices = [];
    invoices[index].isChecked = !invoice.isChecked;
    invoices.map((obj) => {
      if (obj.isChecked) {
        l_selectedInvoices.push(obj);
      }
      return obj;
    });

    setSelectedInvoices(l_selectedInvoices);
  };

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          marginTop: 25,
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noRecipient}
      </Text>
    </View>
  );

  const onAddRecipients = () => {
    const recipients = [...selectedInvoices];
    onCloseThisModal();
    onDone(recipients);
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={() => onCloseThisModal()}
      modalType={ModalTypes.style1}
      title={strings.chooseReciepint}
      containerStyle={{padding: 0}}
      headerRightButtonText={strings.done}
      onRightButtonPress={() => onAddRecipients()}
      Top={75}>
      {/* Recipient selections */}

      <Text
        style={{
          lineHeight: 24,
          fontSize: 20,
          fontFamily: fonts.RMedium,
          paddingHorizontal: 20,
          marginTop: 19,
        }}>
        {strings.chooseReciepientModaltitle}
      </Text>

      {/* Bottosmheet */}

      <BottomSheet
        isVisible={visibleOptions}
        closeModal={() => setVisibleOptions(false)}
        optionList={[
          strings.openInvoiceText,
          strings.paidInvoiceText,
          strings.allInvoiceText,
        ]}
        onSelect={(option) => {
          setVisibleOptions(false);
          setSelectedOption(option);
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginHorizontal: 15,
        }}>
        <Text
          style={{
            marginTop: 15,
            color:
              showSelectedRecipientsText() === strings.noneselected
                ? colors.placeHolderColor
                : colors.orangeColorCard,
            fontSize: 16,
            textAlign: 'right',
            fontFamily: fonts.RRegular,
            lineHeight: 24,
          }}>
          {showSelectedRecipientsText()}
        </Text>
      </View>

      {showHeaderRow()}

      <FlatList
        extraData={invoices}
        showsVerticalScrollIndicator={false}
        data={invoices}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
        renderItem={renderRecipient}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={() => <View style={{marginBottom: 10}} />}
      />
    </CustomModalWrapper>
  );
};

export default AddResendRecipientsModal;

const styles = StyleSheet.create({
  dividerLine: {
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 15,
    height: 1,
  },
  profileImage: {
    height: 40,
    width: 40,
  },

  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.thinDividerColor,
  },
  checkImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.veryLightGray,
    borderRadius: 7,
  },
});
