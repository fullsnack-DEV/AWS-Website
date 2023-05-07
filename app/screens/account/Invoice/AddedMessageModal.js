import {View, StyleSheet, FlatList, Text} from 'react-native';
import React from 'react';
import moment from 'moment';
import {format} from 'react-string-format';
import ReadMore from '@fawazahmed/react-native-read-more';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCThinDivider from '../../../components/TCThinDivider';

import {getJSDate} from '../../../utils';
import Verbs from '../../../Constants/Verbs';

export default function AddedMessagesModal({isVisible, closeList, Messages}) {
  const RenderMessageRows = ({item}) => (
    <View style={styles.containerstyle}>
      <ReadMore
        numberOfLines={6}
        style={styles.ReadMorestyle}
        seeMoreText={strings.moreText}
        seeLessText={strings.lessText}
        seeLessStyle={[
          styles.moreLessText,
          {
            color: colors.userPostTimeColor,
          },
        ]}
        seeMoreStyle={[
          styles.moreLessText,
          {
            color: colors.userPostTimeColor,
          },
        ]}>
        {item.message}
      </ReadMore>
      <Text
        style={{
          marginTop: 15,
          color: colors.userPostTimeColor,
          fontSize: 12,
          lineHeight: 18,
        }}>
        {`${strings.sentBy} ${item.resend_by.first_name} ${
          item.resend_by.last_name
        } ${format(
          strings.atText,
          moment(getJSDate(item.resend_date)).format(Verbs.DATE_FORMAT),
        )} `}
      </Text>
    </View>
  );

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style3}
      onRightButtonPress={() => console.log('NextPressed')}
      headerRightButtonText={strings.done}
      title={format(strings.addedMeesages, Messages?.length)}
      containerStyle={{padding: 0, width: '100%', height: '90%'}}
      showBackButton>
      <View
        style={{
          flex: 1,
          marginTop: -5,
        }}>
        {/* Flatlist */}

        <FlatList
          data={Messages}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <TCThinDivider />}
          renderItem={RenderMessageRows}
        />
      </View>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  ReadMorestyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    lineHeight: 24,
  },
  containerstyle: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
});
