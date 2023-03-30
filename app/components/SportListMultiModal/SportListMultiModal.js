// @flow
import React, {useState, useEffect, useContext} from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import images from '../../Constants/ImagePath';

import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import TCThinDivider from '../TCThinDivider';

import {getHitSlop, getSportName} from '../../utils';

import AuthContext from '../../auth/context';

const SportListMultiModal = ({
  isVisible,
  closeList = () => {},
  onNext = () => {},
  title = '',
}) => {
  const [sportList, setSportList] = useState([]);
  const [visible, setVisible] = useState(false);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  useEffect(() => {
    getSports();
  }, [isFocused]);

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });

    const arr = [];
    for (const tempData of sportArr) {
      const obj = {};
      obj.entity_type = tempData.entity_type;
      obj.sport = tempData.sport;
      obj.sport_type = tempData.sport_type;
      obj.isChecked = false;
      arr.push(obj);
    }
    setVisible(false);
    setSportList(arr);
  };

  const isIconCheckedOrNot = ({item, index}) => {
    sportList[index].isChecked = !item.isChecked;
    setSportList([...sportList]);
  };

  const renderSports = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        if (!visible) {
          setVisible(true);
        }

        isIconCheckedOrNot({item, index});
      }}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 40,
          paddingVertical: 20,
        }}>
        <Text style={styles.languageList}>
          {getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportList[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeList}
        onRequestClose={closeList}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.07,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
          }}>
          <View
            style={{
              flexDirection: 'row',
              // paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={[styles.closeButton, {marginTop: 20, marginBottom: 10}]}
              onPress={() => closeList()}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                //  marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                textAlign: 'center',
                marginTop: 20,
                marginLeft: 20,
                marginBottom: 14,
              }}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const filterChecked = sportList.filter((obj) => obj.isChecked);
                if (filterChecked.length === 0) {
                  return;
                }
                onNext(filterChecked);
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  opacity: visible ? 1 : 0.5,
                  fontSize: 16,
                  fontFamily: fonts.RMedium,

                  marginRight: 17,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                {strings.next}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />

          <Text style={styles.title}>{strings.clubModalTitle}</Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              fontFamily: fonts.RRegular,
              marginLeft: 30,
              marginRight: 19,
              color: colors.lightBlackColor,
            }}>
            {strings.clubModalSubTitle}
          </Text>

          <FlatList
            style={{marginTop: 5}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
    </>
  );
};

export default SportListMultiModal;

const styles = StyleSheet.create({
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: widthPercentageToDP('100%'),
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 20,
    resizeMode: 'contain',
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4%'),
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: widthPercentageToDP('10%'),
    width: widthPercentageToDP('80%'),
    paddingHorizontal: 60,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    marginBottom: 7,
    paddingHorizontal: 30,
    marginTop: 20,
  },
});
