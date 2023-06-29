/* eslint-disable no-useless-escape */
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
// import UrlPreview from 'react-native-url-preview';
import ImageButton from '../../../../WritePost/ImageButton';
import SelectedImageList from '../../../../WritePost/SelectedImageList';
import ActivityLoader from '../../../../loader/ActivityLoader';
import fonts from '../../../../../Constants/Fonts';
import colors from '../../../../../Constants/Colors';
import images from '../../../../../Constants/ImagePath';
import {
  getPickedData,
  MAX_UPLOAD_POST_ASSETS,
} from '../../../../../utils/imageAction';
import {strings} from '../../../../../../Localization/translation';

const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim;

export default function WriteReviewScreen({navigation, route}) {
  const textInputRef = useRef();
  const [comment, setComment] = useState(route.params.comment ?? '');
  const [selectImage, setSelectImage] = useState(
    route.params.selectedImageList,
  );
  const [loading, setloading] = useState(false);
  const [comeFrom] = useState(route.params.comeFrom);

  const renderHeader = useMemo(
    () => (
      <SafeAreaView>
        <View style={styles.containerStyle}>
          <View style={styles.backIconViewStyle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={images.backArrow} style={styles.backImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.writePostViewStyle}>
            <Text style={styles.writePostTextStyle}>
              {strings.leaveareview}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.doneViewStyle}
            onPress={async () => {
              const uploadTimeout = selectImage?.length * 300;
              setloading(true);
              navigation.navigate(comeFrom, {
                selectedImageList: selectImage,
                comment,
              });
              setTimeout(() => {
                setloading(false);
              }, uploadTimeout);
            }}>
            <Text style={styles.doneTextStyle}>{strings.done}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    ),
    [navigation, comment, selectImage],
  );

  const addStr = (str, index, stringToAdd) =>
    str.substring(0, index) + stringToAdd + str.substring(index, str.length);

  const renderUrlPreview = useMemo(() => {
    if (comment?.length > 0) {
      let desc = comment;
      const position = desc.search(urlRegex);
      if (position !== -1 && desc.substring(position)?.startsWith('www'))
        desc = addStr(desc, position, 'http://');
      return null;
      // <UrlPreview text={desc} containerStyle={styles.previewContainerStyle} />
    }
    return null;
  }, [comment]);

  const onImageItemPress = useCallback(
    (item) => {
      const imgs = [...selectImage];
      const idx = imgs.indexOf(item);
      if (idx > -1) {
        imgs.splice(idx, 1);
      }
      setSelectImage(imgs);
    },
    [selectImage],
  );

  const renderSelectedImage = useCallback(
    ({item, index}) => (
      <SelectedImageList
        data={item}
        itemNumber={index + 1}
        totalItemNumber={selectImage?.length}
        onItemPress={() => onImageItemPress(item)}
      />
    ),
    [onImageItemPress, selectImage?.length],
  );

  const ItemSeparatorComponent = useCallback(
    () => <View style={{width: wp('1%')}} />,
    [],
  );

  const renderSelectedImageList = useMemo(
    () =>
      selectImage?.length > 0 && (
        <FlatList
          data={selectImage}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderSelectedImage}
          ItemSeparatorComponent={ItemSeparatorComponent}
          style={{paddingVertical: 10, marginHorizontal: wp('3%')}}
          keyExtractor={(item, index) => index.toString()}
        />
      ),
    [ItemSeparatorComponent, renderSelectedImage, selectImage],
  );

  const onImagePress = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true,
      maxFiles: MAX_UPLOAD_POST_ASSETS - (selectImage?.length ?? 0),
    })
      .then((data) => {
        const pickedData = getPickedData(data, selectImage?.length);
        let allSelectData = [];
        const secondData = [];
        if (selectImage?.length > 0) {
          pickedData?.map((dataItem) => {
            secondData.push(dataItem);
            return null;
          });
          allSelectData = [...selectImage, ...secondData];
          setSelectImage(allSelectData);
        } else {
          setSelectImage(pickedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectImage]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ActivityLoader visible={loading} />
      {renderHeader}
      <View style={styles.sperateLine} />
      <ScrollView bounces={false} style={{flex: 1, overflow: 'visible'}}>
        {/* eslint-disable no-nested-ternary */}
        <TextInput
          ref={textInputRef}
          placeholder={
            route.params.comeFrom === 'RefereeReviewScreen'
              ? strings.writerefereereviewplacholder
              : route.params.comeFrom === 'ScorekeeperReviewScreen'
              ? strings.writescorekeeperreviewplacholder
              : route.params.isPlayer
              ? strings.writeplayerreviewplacholder
              : strings.writeteamreviewplacholder
          }
          placeholderTextColor={colors.userPostTimeColor}
          onChangeText={setComment}
          style={styles.textInputField}
          multiline={true}
          textAlignVertical={'top'}
          value={comment}
        />

        {renderUrlPreview}
        {renderSelectedImageList}
      </ScrollView>
      <SafeAreaView style={styles.bottomSafeAreaStyle}>
        <View style={styles.bottomImgView}>
          <View style={[styles.onlyMeViewStyle, {justifyContent: 'flex-end'}]}>
            {selectImage?.length < MAX_UPLOAD_POST_ASSETS && (
              <ImageButton
                source={images.pickImage}
                imageStyle={{width: 30, height: 30}}
                onImagePress={onImagePress}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backIconViewStyle: {
    justifyContent: 'center',
    width: 30,
  },
  backImage: {
    height: 20,
    tintColor: colors.lightBlackColor,
    width: 10,
  },
  bottomImgView: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    width: wp('92%'),
  },
  containerStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    width: wp('92%'),
  },
  doneTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  doneViewStyle: {},
  onlyMeViewStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    width: wp('46%'),
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('1%'),
  },
  textInputField: {
    fontSize: 16,
    fontFamily: fonts.Roboto,
    fontWeight: '400',
    lineheight: 21,
    height: 200,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  writePostTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontSize: 16,
    fontWeight: '700',
  },
  writePostViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSafeAreaStyle: {
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: -3,
      width: 0,
    },
  },
  // previewContainerStyle: {
  //   margin: 5,
  //   borderWidth: 1,
  //   borderColor: colors.grayBackgroundColor,
  //   padding: 8,
  //   borderRadius: 10,
  // },
});
