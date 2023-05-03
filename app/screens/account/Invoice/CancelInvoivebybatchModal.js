import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {format} from 'react-string-format';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {InvoiceRowType, ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import CancelRecepintCell from './CancelRecepintCell';
import {cancelBatchInvoice} from '../../../api/Invoice';
import AuthContext from '../../../auth/context';

export default function CancelInvoivebybatchModal({
  visible,
  closeModal,
  batchData,
}) {
  const [recipients, setRecipients] = useState(batchData?.invoices ?? []);
  const [searchRecipients, setSearchRecipients] = useState([]);

  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (searchText.length > 0) {
      const result = recipients.filter((obj) =>
        obj.full_name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setSearchRecipients(result);
    } else {
      setSearchRecipients(recipients);
    }
  }, [searchText]);

  const showAllRecepint = () => {
    const isChecked = batchData.invoices.length === selectedRecipients.length;
    return renderAllRecipientRow(isChecked);
  };

  useEffect(() => {
    if (visible) {
      setRecipients(batchData.invoices);
      setSearchText('');
      setSelectedRecipients([]);
    } else {
      // eslint-disable-next-line no-return-assign, no-param-reassign
      recipients.map((obj) => (obj.isChecked = false));
    }
  }, [visible]);

  const renderAllRecipientRow = (isChecked) => {
    const title = format(strings.allRecipientsCount, batchData.invoices.length);
    return (
      <>
        <CancelRecepintCell
          item={{}}
          index={0}
          isChecked={isChecked}
          onSelecteRow={selectRecipients}
          selectAllTitle={title}
          rowType={InvoiceRowType.SelectAll}
          customImage={true}
        />
        <View style={styles.dividerLine} />
      </>
    );
  };

  const showSelectedRecipientsText = () => {
    if (selectedRecipients.length > 0) {
      return selectedRecipients.length === 1
        ? `1 ${strings.person}`
        : `${selectedRecipients.length} ${strings.people}`;
    }

    return strings.noneselected;
  };

  const selectCurrentRecipient = ({item, index}) => {
    const l_selectedRecipients = [];
    searchRecipients[index].isChecked = !item.isChecked;
    recipients.map((obj) => {
      if (obj.isChecked) {
        l_selectedRecipients.push(obj);
      }
      return obj;
    });

    setSelectedRecipients(l_selectedRecipients);
  };

  const selectRecipients = () => {
    const l_selectedRecipients = [];
    if (selectedRecipients.length !== recipients.length) {
      recipients.map((obj) => {
        /* eslint-disable no-param-reassign */
        obj.isChecked = true;
        l_selectedRecipients.push(obj);
        return obj;
      });
    } else {
      recipients.map((obj) => {
        /* eslint-disable no-param-reassign */
        obj.isChecked = false;
        return obj;
      });
    }
    setSelectedRecipients(l_selectedRecipients);
  };

  const renderRecipients = ({item, index}) => (
    <CancelRecepintCell
      item={item}
      index={index}
      onSelecteRow={selectCurrentRecipient}
    />
  );

  const cancelInvoiceValidation = () => {
    if (selectedRecipients.length <= 0) {
      Alert.alert(strings.selectRecipientValidation);
      return false;
    }
    return true;
  };

  const onCancelInvoiceInBatch = () => {
    setLoading(true);
    const body = {};
    body.receiver_ids = selectedRecipients.map((obj) => obj.receiver_id);
    body.email_sent = false;
    cancelBatchInvoice(batchData.batch_id, body, authContext)
      .then(() => {
        setLoading(false);
        closeModal();
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onCancelRecipients = () => {
    if (cancelInvoiceValidation()) {
      Alert.alert(
        Platform.OS === 'android'
          ? ''
          : format(strings.cancelInvoiceAlertText, selectedRecipients.length),
        Platform.OS === 'android'
          ? format(strings.cancelInvoiceAlertText, selectedRecipients.length)
          : '',

        [
          {
            text: strings.back,
            onPress: () => console.log('PRessed'),
            style: 'default',
          },

          {
            text: strings.yes,
            onPress: () => onCancelInvoiceInBatch(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <CustomModalWrapper
      isVisible={visible}
      closeModal={closeModal}
      modalType={ModalTypes.style1}
      headerRightButtonText={strings.send}
      onRightButtonPress={() => onCancelRecipients()}
      title={strings.cancelInvoiceText}
      containerStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
      }}>
      <ActivityLoader visible={loading} />
      {/* title */}

      <Text style={styles.titletext}>{strings.cancelInvoiveModaltitle}</Text>

      {/* search bar */}

      <View style={styles.searchSectionStyle}>
        <TextInput
          style={styles.searchTextInput}
          placeholder={strings.searchText}
          clearButtonMode="always"
          placeholderTextColor={colors.userPostTimeColor}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginRight: 15,
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

      {/* all Rreceoint */}

      {showAllRecepint()}

      {/* list  */}
      <FlatList
        extraData={searchRecipients}
        data={searchRecipients}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
        renderItem={renderRecipients}
        ListFooterComponent={() => <View style={{marginBottom: 30}} />}
      />
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  titletext: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    lineHeight: 30,
    color: colors.lightBlackColor,
    marginTop: 19,
    marginLeft: 15,
    marginRight: 22,
  },
  searchSectionStyle: {
    backgroundColor: colors.textFieldBackground,
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 10,
  },
  searchTextInput: {
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  dividerLine: {
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 15,
    height: 1,
  },
});
