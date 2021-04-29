import React, {
 useCallback, useContext, useEffect, useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import QB from 'quickblox-react-native-sdk';
import FastImage from 'react-native-fast-image';
import { QBgetUserDetail } from '../../utils/QuickBlox';
import AuthContext from '../../auth/context';

const MessageOccupantsProfilePic = ({ occupantsIds }) => {
    const [occupantsData, setOccupantsData] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (occupantsIds.length > 0) {
            getUserData()
        }
    }, [occupantsIds])

    const getUserData = useCallback(() => {
        QBgetUserDetail(
            QB.users.USERS_FILTER.FIELD.ID,
            QB.users.USERS_FILTER.TYPE.STRING,
            [occupantsIds].join(),
        ).then((res) => {
            const myQBID = authContext?.entity?.QB?.id;
            const users = res?.users?.filter((item) => item?.id !== myQBID)
            setOccupantsData([...users]);
        }).catch((e) => {
            console.log(e);
        })
    }, [authContext?.entity?.QB?.id, occupantsIds])

    return (
      <View>
        <ProfileView occupantsData={occupantsData} />
      </View>
    )
}

const ProfileView = ({ occupantsData }) => {
    const [imageArray, setImageArray] = useState([]);
    useEffect(() => {
        if (occupantsData?.length > 0) {
            const imgArray = occupantsData.slice(0, 4).map((item) => (JSON.parse(item.customData)))
            setImageArray([...imgArray])
        }
    }, [occupantsData])

     return (
       <View style={styles.mainContainer}>
         <View style={styles.subContainer}>
           {/* Fourth Image */}
           <View style={styles.imageContainer}>
             {imageArray?.[3]?.full_image ? (
               <FastImage
                       resizeMode={'cover'}
                       source={{ uri: imageArray?.[3]?.full_image }}
                       style={styles.image}
                   />
               ) : null}
           </View>

           {/* Third Image */}
           <View style={styles.imageContainer}>
             <FastImage
                     resizeMode={'cover'}
                     source={{ uri: imageArray?.[2]?.full_image }}
                     style={styles.image}
                 />
           </View>
         </View>

         <View style={styles.subContainer}>
           {/* Second Image */}
           <View style={styles.imageContainer}>
             <FastImage
                       resizeMode={'cover'}
                       source={{ uri: imageArray?.[1]?.full_image }}
                       style={styles.image}
                   />
           </View>

           {/* First Image */}
           <View style={styles.imageContainer}>
             <FastImage
                       resizeMode={'cover'}
                       source={{ uri: imageArray?.[0]?.full_image }}
                       style={styles.image}
                   />
           </View>
         </View>
       </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: 15,
        height: 60,
        width: 60,
        backgroundColor: 'red',
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    imageContainer: {
        flex: 1,
        margin: 3,
        borderRadius: 50,
        backgroundColor: 'green',
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 50,
    },
})
export default MessageOccupantsProfilePic;
