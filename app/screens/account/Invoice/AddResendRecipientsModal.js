// @flow
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, {useState, useEffect, useCallback} from 'react';
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
  ModalTitle = '',
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

  const showHeaderRow = () => {
    let checked = false;
    if (selectedOption === strings.allInvoiceText) {
      if (invoices.length === selectedInvoices.length) {
        checked = true;
      }
    } else if (selectedOption === strings.paidInvoiceText) {
      const paidInvoices = invoiceListByStatus(strings.paidInvoiceText);
      if (paidInvoices.length > 0) {
        const result = paidInvoices.filter((obj) => obj.isChecked);
        if (result.length === paidInvoices.length) {
          checked = true;
        }
      }
    } else if (selectedOption === strings.openInvoiceText) {
      const openInvoices = invoiceListByStatus(strings.openInvoiceText);
      if (openInvoices.length > 0) {
        const result = openInvoices.filter((obj) => obj.isChecked);

        if (result.length === openInvoices.length) {
          checked = true;
        }
      }
    }
    return renderSelectAllInvoiceByStatus(checked);
  };

  const selectInvoiceStatus = (isChecked) => {
    if (selectedOption === strings.allInvoiceText) {
      if (invoices.length > Verbs.MAXIMUM_RECIPIENT_INVOICE && isChecked) {
        Alert.alert(strings.maximuminvoicerecipientvalidation);
        return;
      }
      if (isChecked) {
        invoices.forEach((invoice) => (invoice.isChecked = true));
        setSelectedInvoices([...invoices]);
      } else {
        invoices.forEach((invoice) => (invoice.isChecked = false));
        setSelectedInvoices([]);
      }
    } else if (selectedOption === strings.paidInvoiceText) {
      const paidInvoices = invoiceListByStatus(strings.paidInvoiceText);
      if (isChecked) {
        const uncheckedInvoices = paidInvoices.filter((obj) => !obj.isChecked);
        if (
          uncheckedInvoices.length + selectedInvoices.length >
            Verbs.MAXIMUM_RECIPIENT_INVOICE - 1 &&
          isChecked
        ) {
          Alert.alert(strings.maximuminvoicerecipientvalidation);
          return;
        }
        uncheckedInvoices.forEach((obj) => {
          const invoice = invoices.find(
            (inv) => inv.invoice_id === obj.invoice_id,
          );
          if (invoice) {
            invoice.isChecked = true;
          }
        });
        const selInvoices = [...selectedInvoices, ...uncheckedInvoices];
        setSelectedInvoices(selInvoices);
      } else {
        const invoiceTobeRemoved = paidInvoices.filter((obj) => obj.isChecked);
        invoiceTobeRemoved.forEach((obj) => {
          const invoice = invoices.find(
            (inv) => inv.invoice_id === obj.invoice_id,
          );
          if (invoice) {
            invoice.isChecked = false;
          }
        });

        const result = selectedInvoices.filter(
          (obj) =>
            !invoiceTobeRemoved.some(
              (inv) => inv.invoice_id === obj.invoice_id,
            ),
        );
        setSelectedInvoices(result);
      }
    } else if (selectedOption === strings.openInvoiceText) {
      const openInvoices = invoiceListByStatus(strings.openInvoiceText);
      if (isChecked) {
        const uncheckedInvoices = openInvoices.filter((obj) => !obj.isChecked);
        if (
          uncheckedInvoices.length + selectedInvoices.length >
            Verbs.MAXIMUM_RECIPIENT_INVOICE - 1 &&
          isChecked
        ) {
          Alert.alert(strings.maximuminvoicerecipientvalidation);
          return;
        }
        uncheckedInvoices.forEach((obj) => {
          const invoice = invoices.find(
            (inv) => inv.invoice_id === obj.invoice_id,
          );
          if (invoice) {
            invoice.isChecked = true;
          }
        });
        const selInvoices = [...selectedInvoices, ...uncheckedInvoices];
        setSelectedInvoices(selInvoices);
      } else {
        const invoiceTobeRemoved = openInvoices.filter((obj) => obj.isChecked);
        invoiceTobeRemoved.forEach((obj) => {
          const invoice = invoices.find(
            (inv) => inv.invoice_id === obj.invoice_id,
          );
          if (invoice) {
            invoice.isChecked = false;
          }
        });

        const result = selectedInvoices.filter(
          (obj) =>
            !invoiceTobeRemoved.some(
              (inv) => inv.invoice_id === obj.invoice_id,
            ),
        );
        setSelectedInvoices(result);
      }
    }
  };

  const invoiceListByStatus = useCallback(
    (status) => {
      if (status === strings.allInvoiceText) {
        return invoices;
      }
      if (status === strings.paidInvoiceText) {
        return invoices.filter((obj) => obj.invoice_status === Verbs.paid);
      }
      if (status === strings.openInvoiceText) {
        return invoices.filter(
          (obj) =>
            obj.invoice_status === Verbs.UNPAID ||
            obj.invoice_status === Verbs.PARTIALLY_PAID ||
            obj.invoice_status === Verbs.INVOICE_REJECTED,
        );
      }
      return [];
    },
    [invoices, selectedOption],
  );

  const renderSelectAllInvoiceByStatus = (checked) => (
    <>
      {/* Code for open,  paid and all invoice selection */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => selectInvoiceStatus(!checked)}
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
              source={images.invoiceDarkDownArrow}
              style={{
                width: 11,
                height: 20,
                marginLeft: 5,

                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>

        {/* checkbox */}
        <Image
          source={checked ? images.orangeCheckBox : images.whiteUncheck}
          style={[
            styles.checkImage,
            {borderWidth: checked ? 0.3 : 1, marginRight: 10},
          ]}
        />
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

  const selectCurrentEntity = ({invoice}) => {
    if (
      selectedInvoices.length > Verbs.MAXIMUM_RECIPIENT_INVOICE - 1 &&
      !invoice.isChecked
    ) {
      Alert.alert(strings.maximuminvoicerecipientvalidation);
      return;
    }

    const l_selectedInvoices = [];
    const inde = invoices.findIndex(
      (item) => item.invoice_id === invoice.invoice_id,
    );

    if (inde >= -1) {
      invoices[inde].isChecked = !invoice.isChecked;
      invoices.map((obj) => {
        if (obj.isChecked) {
          l_selectedInvoices.push(obj);
        }
        return obj;
      });

      setSelectedInvoices(l_selectedInvoices);
    }
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
      containerStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
      }}
      headerRightButtonText={strings.done}
      onRightButtonPress={() => onAddRecipients()}
      Top={75}>
      {/* Recipient selections */}
      <View style={{flex: 1}}>
        <Text
          style={{
            lineHeight: 24,
            fontSize: 20,
            fontFamily: fonts.RMedium,
            paddingHorizontal: 20,
            marginTop: 19,
          }}>
          {ModalTitle}
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

        {/* {showHeaderRow()} */}
        {showHeaderRow()}

        <FlatList
          extraData={invoiceListByStatus(selectedOption)}
          showsVerticalScrollIndicator={false}
          data={invoiceListByStatus(selectedOption)}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
          renderItem={renderRecipient}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={() => <View style={{marginBottom: 100}} />}
        />
      </View>
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
