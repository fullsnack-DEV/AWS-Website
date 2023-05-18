// @flow
/* eslint-disable no-param-reassign */
import React, {useState, useCallback, useContext, useEffect} from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {format} from 'react-string-format';
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
import TCScrollableProfileTabs from '../../../components/TCScrollableProfileTabs';
import AuthContext from '../../../auth/context';
import Verbs from '../../../Constants/Verbs';
import SelectedRecipientsModal from './SelectedRecipientsModal';
import RecipientCell from './RecipientCell';

const TAB_ITEMS = [strings.peopleTitleText, strings.teamsTitleText];

const AddRecipientsModal = ({
  isVisible,
  onDone = () => {},
  onClose = () => {},
  recipientMembers = [],
  recipientTeams = [],
  recipientAttendees = [],
  selectedRecipients = [],
  invoiceType = InvoiceType.Invoice,
  modalTitle = '',
  rightbuttonText = '',
}) => {
  const authContext = useContext(AuthContext);
  const isShowTabs = authContext.entity.role === Verbs.entityTypeClub;
  const [currentTab, setCurrentTab] = useState(InvoiceRecipientTabType.People);
  const [searchPeoples, setSearchPeoples] = useState([]);
  const [searchTeams, setSearchTeams] = useState([]);
  const [selectedPeoples, setSelectedPeoples] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [showSelectedRecipientsModal, setShowSelectedRecipientsModal] =
    useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (isVisible) {
      setCurrentTab(InvoiceRecipientTabType.People);
      setSearchText('');
      setSearchPeoples(recipientMembers);
      setSearchTeams(recipientTeams);
      if (invoiceType === InvoiceType.Invoice) {
        const l_selectedPeoples = [];
        const l_selectedTeams = [];
        recipientMembers.forEach((recipient) => {
          if (
            selectedRecipients.some(
              (reci) => reci.user_id === recipient.user_id,
            )
          ) {
            recipient.isChecked = true;
            l_selectedPeoples.push(recipient);
          } else {
            recipient.isChecked = false;
          }
        });
        setSelectedPeoples(l_selectedPeoples);

        recipientTeams.forEach((recipient) => {
          if (
            selectedRecipients.some(
              (reci) => reci.group_id === recipient.group_id,
            )
          ) {
            recipient.isChecked = true;
            l_selectedTeams.push(recipient);
          } else {
            recipient.isChecked = false;
          }
        });
        setSelectedTeams(l_selectedTeams);
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (searchText.length > 0) {
      const result = recipientMembers.filter((obj) =>
        `${obj.first_name} ${obj.last_name}`
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );
      setSearchPeoples(result);
      const result1 = recipientTeams.filter((obj) =>
        obj.group_name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setSearchTeams(result1);
    } else {
      setSearchPeoples(recipientMembers);
      setSearchTeams(recipientTeams);
    }
  }, [searchText]);

  const showSelectedRecipientsText = () => {
    let returnStr = '';
    if (invoiceType === InvoiceType.Invoice) {
      if (selectedPeoples.length > 0) {
        returnStr =
          selectedPeoples.length === 1
            ? `1 ${strings.Person}`
            : `${selectedPeoples.length} ${strings.PeopleText}`;
      }

      if (selectedTeams.length > 0) {
        const str =
          selectedTeams.length === 1
            ? `1 ${strings.team}`
            : `${selectedTeams.length} ${strings.teams}`;
        if (returnStr.length > 0) {
          returnStr = `${returnStr} & ${str} ${strings.selected}`;
        } else {
          returnStr = `${str} ${strings.selected}`;
        }
      } else if (returnStr.length > 0) {
        returnStr = `${returnStr} ${strings.selected}`;
      }
    } else if (invoiceType === InvoiceType.Event) {
      returnStr = `${selectedAttendees.length} ${strings.people}`;
    }

    if (returnStr.length > 0) {
      return returnStr;
    }

    return strings.noneselected;
  };

  const showCurrentGroupAllMember = () => {
    if (
      recipientMembers.length + recipientTeams.length <=
      Verbs.MAXIMUM_RECIPIENT_INVOICE
    ) {
      let isChecked = false;
      if (currentTab === InvoiceRecipientTabType.Teams) {
        isChecked = recipientTeams.length === selectedTeams.length;
      } else {
        isChecked = recipientMembers.length === selectedPeoples.length;
      }
      return renderSelectMemberRow(isChecked);
    }

    return <></>;
  };

  const renderSelectMemberRow = (isChecked) => {
    const title =
      currentTab === InvoiceRecipientTabType.Teams
        ? format(strings.selectallteam, recipientTeams.length)
        : format(strings.selectallgroupmember, recipientMembers.length);
    return (
      <>
        {authContext.entity.role === Verbs.entityTypeClub &&
          invoiceType === InvoiceType.Invoice && (
            <View style={{height: 10}}></View>
          )}

        <RecipientCell
          item={authContext.entity.obj}
          index={0}
          onSelecteRow={selectMembers}
          isChecked={isChecked}
          selectAllTitle={title}
          rowType={InvoiceRowType.SelectAll}
        />
        <View style={styles.dividerLine} />
      </>
    );
  };

  const renderRecipient = ({item, index}) => (
    <RecipientCell
      item={item}
      index={index}
      onSelecteRow={selectCurrentEntity}
    />
  );

  const onCloseThisModal = () => {
    onClose();
  };

  const selectCurrentEntity = ({item, index}) => {
    if (invoiceType === InvoiceType.Invoice) {
      if (
        selectedPeoples.length + selectedTeams.length >
          Verbs.MAXIMUM_RECIPIENT_INVOICE - 1 &&
        !item.isChecked
      ) {
        Alert.alert(strings.maximuminvoicerecipientvalidation);
        return;
      }

      if (currentTab === InvoiceRecipientTabType.People) {
        const l_selectedPeoples = [];
        searchPeoples[index].isChecked = !item.isChecked;
        recipientMembers.map((obj) => {
          if (obj.isChecked) {
            l_selectedPeoples.push(obj);
          }
          return obj;
        });

        setSelectedPeoples(l_selectedPeoples);
      } else {
        const l_selectedTeams = [];
        searchTeams[index].isChecked = !item.isChecked;
        recipientTeams.map((obj) => {
          if (obj.isChecked) {
            l_selectedTeams.push(obj);
          }
          return obj;
        });

        setSelectedTeams(l_selectedTeams);
      }
    }
  };

  const selectMembers = () => {
    if (invoiceType === InvoiceType.Invoice) {
      if (currentTab === InvoiceRecipientTabType.Teams) {
        const l_selectedTeams = [];
        if (selectedTeams.length !== recipientTeams.length) {
          recipientTeams.map((obj) => {
            obj.isChecked = true;
            l_selectedTeams.push(obj);
            return obj;
          });
        } else {
          recipientTeams.map((obj) => {
            obj.isChecked = false;
            return obj;
          });
        }
        setSelectedTeams(l_selectedTeams);
      } else {
        const l_selectedPeoples = [];
        if (selectedPeoples.length !== recipientMembers.length) {
          recipientMembers.map((obj) => {
            obj.isChecked = true;
            l_selectedPeoples.push(obj);
            return obj;
          });
        } else {
          recipientMembers.map((obj) => {
            obj.isChecked = false;
            return obj;
          });
        }
        setSelectedPeoples(l_selectedPeoples);
      }
    } else {
      const l_selectedAttendees = [];
      if (selectedAttendees.length !== recipientAttendees.length) {
        recipientAttendees.map((obj) => {
          obj.isChecked = true;
          l_selectedAttendees.push(obj.group_id || obj.user_id);
          return obj;
        });
      } else {
        recipientAttendees.map((obj) => {
          obj.isChecked = false;
          return obj;
        });
      }
      setSelectedAttendees(l_selectedAttendees);
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

  const tabChangePress = useCallback((changeTab) => {
    switch (changeTab.i) {
      case InvoiceRecipientTabType.People:
        break;
      case InvoiceRecipientTabType.Teams:
        break;
      default:
        break;
    }
    setCurrentTab(changeTab.i);
  }, []);

  const showSelectedRecipient = () => {
    const recipients = [
      ...selectedPeoples,
      ...selectedTeams,
      ...selectedAttendees,
    ];
    if (recipients.length > 0) {
      setShowSelectedRecipientsModal(true);
    }
  };

  const onAddRecipients = () => {
    const recipients = [
      ...selectedPeoples,
      ...selectedTeams,
      ...selectedAttendees,
    ];
    onCloseThisModal();
    onDone(recipients);
  };

  const onRemovePeople = (item) => {
    const people = recipientMembers.find(
      (recipient) => recipient.user_id === item.user_id,
    );
    if (people !== -1) {
      const l_selectedPeoples = [];
      people.isChecked = false;
      recipientMembers.map((obj) => {
        if (obj.isChecked) {
          l_selectedPeoples.push(obj);
        }
        return obj;
      });
      setSelectedPeoples(l_selectedPeoples);
    }
  };

  const onRemoveTeam = (item) => {
    const team = recipientTeams.find(
      (recipient) => recipient.group_id === item.group_id,
    );
    if (team) {
      const l_selectedTeams = [];
      team.isChecked = false;
      recipientTeams.map((obj) => {
        if (obj.isChecked) {
          l_selectedTeams.push(obj);
        }
        return obj;
      });
      setSelectedTeams(l_selectedTeams);
    }
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={() => onCloseThisModal()}
      modalType={ModalTypes.style1}
      title={modalTitle || strings.newRecipents}
      containerStyle={{padding: 0, width: '100%', height: '100%'}}
      headerRightButtonText={rightbuttonText || strings.done}
      onRightButtonPress={() => onAddRecipients()}
      Top={75}>
      {/* Code for Search Field */}
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
      {/* Recipient selections */}
      <TouchableOpacity
        style={{marginHorizontal: 15}}
        onPress={() => showSelectedRecipient()}>
        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
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
      </TouchableOpacity>
      {/* show the tabs if club is sending the invoice */}
      {isShowTabs && invoiceType === InvoiceType.Invoice && (
        <View style={{backgroundColor: '#FFFFFF'}}>
          <TCScrollableProfileTabs
            tabItem={TAB_ITEMS}
            tabVerticalScroll={false}
            onChangeTab={tabChangePress}
            currentTab={currentTab}
          />
        </View>
      )}

      {showCurrentGroupAllMember()}

      {invoiceType === InvoiceType.Invoice && (
        <FlatList
          extraData={
            currentTab === InvoiceRecipientTabType.People
              ? searchPeoples
              : searchTeams
          }
          showsVerticalScrollIndicator={false}
          data={
            currentTab === InvoiceRecipientTabType.People
              ? searchPeoples
              : searchTeams
          }
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.dividerLine} />}
          renderItem={renderRecipient}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={() => <View style={{marginBottom: 100}} />}
        />
      )}

      {/* People list */}
      <SelectedRecipientsModal
        isVisible={showSelectedRecipientsModal}
        onClose={() => setShowSelectedRecipientsModal(false)}
        onRemovePeople={onRemovePeople}
        onRemoveTeam={onRemoveTeam}
        peopleRecipient={selectedPeoples}
        teamsRecipient={selectedTeams}
        invoiceType={invoiceType}
      />
    </CustomModalWrapper>
  );
};

export default AddRecipientsModal;

const styles = StyleSheet.create({
  searchSectionStyle: {
    backgroundColor: colors.textFieldBackground,
    marginTop: 20,
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
