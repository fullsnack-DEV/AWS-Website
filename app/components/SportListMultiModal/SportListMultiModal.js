import React, {useState, useEffect, useContext} from 'react';
import {FlatList, Image, Text, View, StyleSheet, Pressable} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import {getSportList} from '../../utils/sportsActivityUtils';
import AuthContext from '../../auth/context';
import Verbs from '../../Constants/Verbs';

const SportListMultiModal = ({
  isVisible,
  closeList = () => {},
  onNext = () => {},
  title = '',
  selectedSports = [],
}) => {
  const authContext = useContext(AuthContext);
  const [sportList, setSportList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const list = getSportList(authContext.sports, Verbs.entityTypeClub);
      setSportList(list);
    }
  }, [isVisible, authContext.sports]);

  useEffect(() => {
    if (isVisible && selectedSports.length > 0) {
      setSelectedList(selectedSports);
    }
  }, [isVisible, selectedSports]);

  const handleClick = (item) => {
    let list = [...selectedList];
    if (selectedList.length > 0) {
      const sport = selectedList.find(
        (obj) => obj.sport === item.sport && obj.sport_type === item.sport_type,
      );
      if (sport) {
        list = selectedList.filter(
          (obj) =>
            obj.sport !== item.sport && obj.sport_type !== item.sport_type,
        );
      } else {
        list.push(item);
      }
    } else {
      list.push(item);
    }
    setSelectedList([...list]);
  };

  const checkIsSelected = (item) => {
    const sport = selectedList.find(
      (obj) => obj.sport === item.sport && obj.sport_type === item.sport_type,
    );
    if (sport) {
      return true;
    }
    return false;
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={() => closeList()}
      modalType={ModalTypes.style1}
      title={title}
      headerRightButtonText={
        title === strings.createClubText ? strings.next : strings.applyTitle
      }
      onRightButtonPress={() => {
        if (selectedList.length === 0) {
          return;
        }
        onNext(selectedList);
      }}>
      {title === strings.createClubText ? (
        <>
          <Text style={styles.title}>{strings.clubModalTitle}</Text>
          <Text style={styles.description}>
            {title === strings.createClubText
              ? strings.sportSelectionModalSubTitle
              : strings.clubModalSubTitle}
          </Text>
        </>
      ) : null}

      <FlatList
        data={sportList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <>
            <Pressable
              style={styles.listItem}
              onPress={() => handleClick(item)}>
              <View>
                <Text style={styles.languageList}>{item.sport_name}</Text>
              </View>
              <View style={styles.checkbox}>
                <Image
                  source={
                    checkIsSelected(item)
                      ? images.orangeCheckBox
                      : images.uncheckWhite
                  }
                  style={styles.checkboxImg}
                />
              </View>
            </Pressable>
            <View style={styles.dividor} />
          </>
        )}
      />
    </CustomModalWrapper>
  );
};

export default SportListMultiModal;

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginBottom: 15,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    marginBottom: 7,
  },
  dividor: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
});
