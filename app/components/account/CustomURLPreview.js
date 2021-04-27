/* eslint-disable no-useless-escape */

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import RNUrlPreview from 'react-native-url-preview';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gmi

const addStr = (str, index, stringToAdd) => str.substring(0, index) + stringToAdd + str.substring(index, str.length)

const CustomURLPreview = memo(({ text }) => {
    let desc = text;
    const position = desc?.search(urlRegex)
    if (position !== -1 && desc?.substring(position)?.startsWith('www')) desc = addStr(text, position, 'http://')
    return (<RNUrlPreview
            text={text}
            containerStyle={styles.urlPreviewContainerStyle}
            imageProps={{ resizeMode: 'contain' }}
            titleNumberOfLines={2}
            imageStyle={styles.previewImageStyle}
            textContainerStyle={styles.textContainerStyle}
            titleStyle={styles.urlPreviewTitleText}
            descriptionStyle={styles.urlPreviewDescriptionText}
        />
    )
})

const styles = StyleSheet.create({
    urlPreviewContainerStyle: {
        flexDirection: 'column',
        margin: 5,
        marginHorizontal: 15,
    },
    previewImageStyle: {
        borderWidth: 1.5,
        borderColor: colors.grayBackgroundColor,
        borderRadius: 10,
        padding: 18,
        alignSelf: 'center',
        height: 150,
        width: wp('90%'),
    },
    textContainerStyle: {
        marginVertical: 5,
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    urlPreviewTitleText: {
        fontSize: 14,
        fontFamily: fonts.RBold,
        color: colors.lightBlackColor,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    urlPreviewDescriptionText: {
        textAlign: 'left',
        color: colors.userPostTimeColor,
        fontSize: 12,
        fontFamily: fonts.RRegular,
    },
})

export default CustomURLPreview;
