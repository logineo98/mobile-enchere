import { useNavigation } from '@react-navigation/native'
import { Alert, Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors, convertDateToMillis, formatNumberWithSpaces } from '../../../libs'
import CountdownTimer from '../../commons/timer/CountdownTimer'
import { api_public } from '../../../libs/redux/constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { dislike_enchere, like_enchere } from '../../../libs/redux/actions/enchere.action'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from 'react-native-animatable';
import { useEffect, useState } from 'react'

const Favorite = ({ data, width, height, theme }) => {
  const navigation = useNavigation()
  const [isCrownOn, setIsCrownOn] = useState(false);
  const { host, users } = useSelector(state => state?.user)
  const dispatch = useDispatch()

  const styles = StyleSheet.create({
    image: { height: 150, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    name: { width: "70%", fontWeight: 'bold', fontSize: 18, color: theme === "sombre" ? Colors.white : Colors.dark },
    categories: { width: '70%', flexDirection: 'row', alignItems: 'center', marginHorizontal: 3, marginVertical: 3, gap: 5 },
    categories_item: { marginRight: 3, fontSize: 10, color: theme === "sombre" ? "wheat" : Colors.brown },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#262626' },
    card: { marginRight: 20, borderRadius: 5, width: 300, borderWidth: 1, borderColor: data?.enchere_type === "private" ? "tomato" : "rgba(0,0,0,0.12)", backgroundColor: theme === "sombre" ? Colors.home_card : Colors.white, marginVertical: 5 },
    bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingVertical: 5 },
    left: { flexDirection: 'row', alignItems: "center" },
    right: { flexDirection: 'row', alignItems: "center" },
    delai: { flexDirection: 'row', alignItems: "center", backgroundColor: theme === "sombre" ? Colors.warning : Colors.light_red, borderRadius: 5, paddingHorizontal: 8 },
  })


  useEffect(() => {
    const interval = setInterval(() => {
      setIsCrownOn(!isCrownOn);
    }, 300);

    return () => clearInterval(interval);
  }, [isCrownOn]);

  const like = () => {
    if (host?.facebook || host?.vip === true) {
      dispatch(like_enchere(data?._id, host?._id, { user_id: host?._id }))
    } else {
      Alert.alert("Avertissement", "Veuillez, vous connecter à facebook d'abord au niveau du profil.", [{ text: "OK" }])
    }
  }

  const dislike = () => {
    if (host?.facebook || host?.vip === true) {
      Alert.alert("Avertissement", "Voulez-vous vraiment la retirer de vos favoris ?",
        [{ text: "Non" }, { text: "Oui", onPress: () => dispatch(dislike_enchere(data?._id, host?._id, { user_id: host?._id })) }]
      )
    } else {
      Alert.alert("Avertissement", "Veuillez, vous connecter à facebook d'abord au niveau du profil.", [{ text: "OK" }])
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("detail", { data })} style={[styles.card, { width: width ? width : 300 }]}>
      <Image source={{ uri: `${api_public}/images/${data?.medias[0]}` }} style={[styles.image, { height: height ? height : 150 }]} />
      <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: data?.enchere_type === "private" ? "tomato" : "rgba(0,0,0,0.1)" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={styles.name}>{data?.title?.length <= 22 ? data?.title?.slice(0, 22) : data?.title?.slice(0, 22) + "..."}
            {data?.enchere_type === "private" &&
              <Animatable.View style={{ alignItems: "center" }} animation={isCrownOn ? 'pulse' : null} iterationCount={isCrownOn ? 'infinite' : 1} >
                <FontAwesome5Icon name="crown" size={10} color={isCrownOn ? Colors.main : Colors.home_card} style={{ paddingLeft: 5 }} />
              </Animatable.View>}
          </Text>

          {(host?._id !== data?.sellerID) &&
            <TouchableOpacity>
              {data?.likes?.includes(host?._id) ?
                <Ionicons name={'md-bookmark'} color={Colors.main} size={25} onPress={dislike} /> :
                <Ionicons name={'ios-bookmark-outline'} color={theme === "sombre" ? Colors.white : Colors.gray} size={25} onPress={like} />
              }
            </TouchableOpacity>
          }
        </View>

        <View ><Text style={{ color: Colors.main, fontSize: 13, fontWeight: "200" }}> {formatNumberWithSpaces(data?.started_price)} FCFA</Text></View>

        <View style={styles.categories}>
          {data?.categories?.map((categorie, i) => (<TouchableOpacity key={i} ><Text style={styles.categories_item}>{categorie}</Text></TouchableOpacity>))}
        </View>

        <View style={styles.bottom}>
          <View style={styles.left}>
            <Ionicons name="ios-location-outline" size={16} color={theme === "sombre" ? Colors.white : Colors.black} />
            {users?.map((user, i) => {
              if (data?.sellerID === user?._id)
                return <Text key={i} style={{ fontSize: 12, color: theme === "sombre" ? Colors.white : Colors.black }}>{user?.town ? user?.town?.length <= 14 ? user?.town?.slice(0, 14) : user?.town?.slice(0, 14) + "..." : "Non renseignée"}</Text>
            })}
          </View>

          <View style={styles.right}>
            <View style={styles.delai}>
              {/* <Ionicons name="ios-time-outline" size={16} /> */}
              <CountdownTimer targetDate={convertDateToMillis(data?.expiration_time)} size={13} txtSize={5} hideLabel={false} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default Favorite


