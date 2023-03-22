// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const CertificateList = ({list = [], onAdd = () => {}, onPress = () => {}}) =>
  list.length > 0 ? (
    <FlatList
      data={list}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => (
        <Pressable
          style={styles.parent}
          onPress={() => onPress(item, `${index + 1}/${list.length}`)}>
          <View style={styles.imageContainer}>
            <Image source={{uri: item.url}} style={styles.image} />
          </View>
          <View>
            <Text
              style={[styles.buttonText, {fontFamily: fonts.RRegular}]}
              numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        </Pressable>
      )}
    />
  ) : (
    <TouchableOpacity style={styles.buttonContainer} onPress={onAdd}>
      <Text style={styles.buttonText}>{strings.addCerticateTitle}</Text>
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
  parent: {
    width: 150,
    marginRight: 15,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 7,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});
export default CertificateList;
