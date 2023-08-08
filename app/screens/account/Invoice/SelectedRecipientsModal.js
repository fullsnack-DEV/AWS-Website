// @flow
/* eslint-disable no-param-reassign */
import React, {useState, useCallback, useContext, useEffect} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {
  ModalTypes,
  InvoiceType,
  InvoiceRecipientTabType,
  InvoiceRowType,
} from '../../../Constants/GeneralConstants';
import AuthContext from '../../../auth/context';
import Verbs from '../../../Constants/Verbs';
import RecipientCell from './RecipientCell';
import CustomScrollTabs from '../../../components/CustomScrollTabs';

const SelectedRecipientsModal = ({
  isVisible,
  onClose = () => {},
  onRemovePeople = () => {},
  onRemoveTeam = () => {},
  peopleRecipient = [],
  teamsRecipient = [],
  invoiceType = InvoiceType.Invoice,
}) => {
  const authContext = useContext(AuthContext);
  const isShowTabs = authContext.entity.role === Verbs.entityTypeClub;
  const [currentTab, setCurrentTab] = useState(InvoiceRecipientTabType.People);
  const [selectedPeopleRecipient, setSelectedPeopleRecipient] =
    useState(peopleRecipient);
  const [selectedTeamsRecipient, setSelectedTeamsRecipient] =
    useState(teamsRecipient);
  const [tabs, setTabs] = useState([
    strings.peopleTitleText,
    strings.teamsTitleText,
  ]);

  const tabChangePress = useCallback((changeTab) => {
    switch (changeTab) {
      case InvoiceRecipientTabType.People:
        break;
      case InvoiceRecipientTabType.Teams:
        break;
      default:
        break;
    }
    setCurrentTab(changeTab);
  }, []);

  useEffect(() => {
    console.log(peopleRecipient.length);

    if (isVisible) {
      setSelectedPeopleRecipient(peopleRecipient);
      setSelectedTeamsRecipient(teamsRecipient);
      setCurrentTab(InvoiceRecipientTabType.People);
      updateTabs(peopleRecipient, teamsRecipient);
    }
  }, [isVisible]);

  const updateTabs = (peopleCount, teamsCount) => {
    let peopleTitle = strings.peopleTitleText;
    let teamTitle = strings.teamsTitleText;
    if (peopleCount.length > 0) {
      peopleTitle = `${peopleTitle} (${peopleCount.length})`;
    }
    if (teamsCount.length > 0) {
      teamTitle = `${teamTitle} (${teamsCount.length})`;
    }
    setTabs([peopleTitle, teamTitle]);
  };

  const removeRecipient = ({item, index}) => {
    if (invoiceType === InvoiceType.Invoice) {
      if (currentTab === InvoiceRecipientTabType.People) {
        selectedPeopleRecipient.splice(index, 1);
        const result = [...selectedPeopleRecipient];
        setSelectedPeopleRecipient(result);
        onRemovePeople(item);
      } else {
        selectedTeamsRecipient.splice(index, 1);
        const result = [...selectedTeamsRecipient];
        setSelectedTeamsRecipient(result);
        onRemoveTeam(item);
      }
      updateTabs(selectedPeopleRecipient, selectedTeamsRecipient);
    }
  };

  const renderRecipient = ({item, index}) => (
    <RecipientCell
      item={item}
      index={index}
      onSelectCancel={removeRecipient}
      rowType={InvoiceRowType.CancelRecipient}
    />
  );

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

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={() => onClose()}
      modalType={ModalTypes.style9}
      containerStyle={{padding: 0}}
      Top={100}>
      {isShowTabs && invoiceType === InvoiceType.Invoice && (
        <View style={{backgroundColor: '#FFFFFF'}}>
          <CustomScrollTabs
            tabsItem={tabs}
            setCurrentTab={tabChangePress}
            currentTab={currentTab}
          />
        </View>
      )}
      {/* People list */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={
          currentTab === InvoiceRecipientTabType.Teams
            ? selectedTeamsRecipient
            : selectedPeopleRecipient
        }
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
        renderItem={renderRecipient}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={() => <View style={{marginBottom: 180}} />}
      />
    </CustomModalWrapper>
  );
};

export default SelectedRecipientsModal;

const styles = StyleSheet.create({
  dividerLine: {
    backgroundColor: colors.grayBackgroundColor,
    marginHorizontal: 15,
    height: 1,
  },
});
