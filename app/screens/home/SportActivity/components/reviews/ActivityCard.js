// @flow
import moment from 'moment';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {strings} from '../../../../../../Localization/translation';
import {ReviewRole} from '../../../../../Constants/GeneralConstants';
import images from '../../../../../Constants/ImagePath';
import styles from './ActivityCardStyles';
import BottomSheet from '../../../../../components/modals/BottomSheet';

const ActivityCard = ({
  onPressMore = () => {},
  role,
  isReviewPeriodEnd = false,
  // reply = [],
}) => {
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleMoreButtonPress = () => {
    setShowModal(true);
  };

  const renderMoreOptionIcon = () => {
    if (role === ReviewRole.Reviewer) {
      if (!isReviewPeriodEnd) {
        setOptions([strings.edit, strings.delete]);
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={handleMoreButtonPress}>
            <Image source={images.scheduleThreeDot} style={styles.image} />
          </TouchableOpacity>
        );
      }
    }

    if (role === ReviewRole.Reviewee) {
      if (isReviewPeriodEnd) {
        setOptions([strings.reportThisReview]);
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={handleMoreButtonPress}>
            <Image source={images.scheduleThreeDot} style={styles.image} />
          </TouchableOpacity>
        );
      }
    }

    if (role === ReviewRole.Other) {
      if (isReviewPeriodEnd) {
        setOptions([strings.reportThisReview]);
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={handleMoreButtonPress}>
            <Image source={images.scheduleThreeDot} style={styles.image} />
          </TouchableOpacity>
        );
      }
    }
    return null;
  };

  if (isReviewPeriodEnd || role === ReviewRole.Reviewer) {
    return (
      <View style={styles.parent}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            <View style={styles.profile}>
              <Image source={images.usaImage} style={styles.image} />
            </View>
            <View>
              <Text style={styles.userName}>Christiano Ronaldo</Text>
              <Text style={styles.date}>{moment().format('MMM DD')}</Text>
            </View>
            {renderMoreOptionIcon()}
          </View>
        </View>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
          <Text style={styles.description} numberOfLines={3}>
            Association football, more commonly known as football or soccer, is
            a team sport played between two teams of eleven between sport played
            between two teams of eleven between
          </Text>
          <TouchableOpacity onPress={onPressMore}>
            <Text style={styles.moreText}>{strings.moreText}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, {marginBottom: 13}]}>
          <View style={styles.activityImageContainer}>
            <Image source={images.activityImage} style={styles.image} />
          </View>

          <View style={styles.activityImageContainer}>
            <Image source={images.activityImage1} style={styles.image} />
            <View style={{position: 'absolute', alignItems: 'center'}}>
              <View style={styles.videoBtn}>
                <Image source={images.videoPlayIcon} style={styles.image} />
              </View>
              <Text style={styles.timer}>0:32</Text>
            </View>
          </View>

          <View style={styles.activityImageContainer}>
            <Image source={images.activityImage2} style={styles.image} />
            <View style={{position: 'absolute'}}>
              <Text style={styles.count}>+ 3</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.profile, {marginRight: 7}]}>
            <Image source={images.usaImage} style={styles.image} />
          </View>

          <TextInput
            placeholder={strings.leaveReplyText}
            style={styles.input}
            onFocus={() => {
              Alert.alert(strings.ratingsInfo);
            }}
          />
        </View>

        <BottomSheet
          isVisible={showModal}
          closeModal={() => {
            setShowModal(false);
          }}
          optionList={options}
          onSelect={(option) => {
            console.log({option});
          }}
        />
      </View>
    );
  }

  return null;
};

export default ActivityCard;
