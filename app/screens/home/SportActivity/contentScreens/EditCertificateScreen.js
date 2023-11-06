// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {strings} from '../../../../../Localization/translation';
import AuthContext from '../../../../auth/context';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import uploadImages from '../../../../utils/imageAction';

const certificate = {title: '', url: '', thumbnail: '', isLoading: false};

const EditCertificateScreen = ({
  list = [],
  setData = () => {},
  setLoading = () => {},
}) => {
  const [certificateList, setCertificateList] = useState([]);
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (certificateList.length > 0) {
      const filterList = certificateList.filter((item) => item.isLoading);
      setLoading(filterList.length > 0);
    }
  }, [certificateList, setLoading]);

  useEffect(() => {
    if (isFocused) {
      if (list.length > 0) {
        setCertificateList(list);
      } else if (list.length === 0) {
        setCertificateList([certificate]);
      }
    }
  }, [list, isFocused]);

  const handleCertification = async (index) => {
    const newList = [...certificateList];

    const result = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      maxFiles: 1,
    });

    if (result?.path) {
      newList[index] = {
        ...newList[index],
        url: result.path,
        thumbnail: result.path,
        isLoading: true,
      };
      setData([...newList]);
      uploadImages([result], authContext)
        .then((responses) => {
          newList[index] = {
            ...newList[index],
            url: responses?.[0].fullImage ?? '',
            thumbnail: responses?.[0].thumbnail ?? '',
            isLoading: false,
          };

          setData(newList);
        })
        .catch((error) => {
          newList[index] = {
            ...newList[index],
            isLoading: false,
          };
          Alert.alert(strings.alertmessagetitle, error.message);
        });
    }
  };

  const handleDelete = (index) => {
    const newList = [...certificateList];
    newList.splice(index, 1);
    if (newList.length === 0) {
      setCertificateList([certificate]);
      setData(newList);
    } else {
      setCertificateList(newList);
      setData(newList);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.parent}>
      <Text style={styles.title}>{strings.addCertiMainTitle}</Text>

      {certificateList.length > 0 &&
        certificateList.map((item, index) => (
          <View
            key={index}
            style={[
              {flex: 1},
              index === certificateList.length - 1 ? {} : {marginBottom: 25},
            ]}>
            <View style={{...styles.row, marginBottom: 15}}>
              <View style={styles.searchView}>
                <TextInput
                  style={styles.searchTextField}
                  placeholder={strings.titleOrDescriptionText}
                  value={item.title}
                  onChangeText={(text) => {
                    const newList = [...certificateList];
                    newList[index] = {
                      ...newList[index],
                      title: text,
                    };
                    setData(newList);
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handleCertification(index)}>
                <Image source={images.certificateCamera} style={styles.image} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.row,
                {justifyContent: 'space-between', alignItems: 'flex-start'},
              ]}>
              {item.url ? (
                <View style={styles.certificateContainer}>
                  <Image source={{uri: item.url}} style={styles.image} />
                  <TouchableOpacity style={styles.closeIcon}>
                    <Image source={images.refreshIcon} style={styles.image} />
                  </TouchableOpacity>
                  {item.isLoading ? (
                    <View style={styles.maskView}>
                      <TCInnerLoader visible />
                      <Text style={styles.maskViewText}>
                        {strings.uploadingText}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <View />
              )}
              {item.url ? (
                <TouchableOpacity onPress={() => handleDelete(index)}>
                  <Text style={styles.deleteBtn}>{strings.delete}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setCertificateList([...list, certificate])}>
        <Text style={styles.addButtonText}>{strings.addCertificate}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parent: {
    // flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 20,
  },
  searchView: {
    flex: 1,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchTextField: {
    fontSize: 16,
    color: colors.lightBlackColor,
    padding: 0,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeIcon: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 22,
    right: -10,
    top: -8,
    backgroundColor: colors.themeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateContainer: {
    width: 150,
    height: 195,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskView: {
    position: 'absolute',
    width: 150,
    height: 195,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskViewText: {
    fontFamily: fonts.RLight,
    fontSize: 20,
    lineHeight: 30,
    color: colors.whiteColor,
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 15,
    backgroundColor: colors.textFieldBackground,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  deleteBtn: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.redDelColor,
    fontFamily: fonts.RRegular,
  },
});
export default EditCertificateScreen;
