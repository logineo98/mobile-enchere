import { useNavigation } from '@react-navigation/native'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors, formatNumberWithSpaces } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import CountdownTimer from '../../commons/timer/CountdownTimer'
import { api_public } from '../../../libs/redux/constants/constants'

const SearchedItem = ({ data, theme }) => {
  const navigation = useNavigation()

  const { host, users } = useSelector(state => state?.user)
  const dispatch = useDispatch()

  const styles = StyleSheet.create({
    container: { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 5, borderWidth: 1, borderColor: data?.enchere_type === "private" ? "tomato" : "rgba(0,0,0,0.1)", marginVertical: 5, marginHorizontal: 1 },

    content: { width: '100%', flexDirection: 'row', padding: 0 },
    image_box: { width: '30%', height: 120, backgroundColor: 'gray' },
    restaurant_infos: { paddingHorizontal: 5, width: '70%', borderLeftColor: data?.enchere_type === "private" ? "tomato" : "rgba(0,0,0,0.1)", borderLeftWidth: 1 },
    image: { width: '100%', height: "100%", resizeMode: 'cover', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },

    top: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    center: { flexDirection: 'row', marginVertical: 10, gap: 10, width: '70%' },
    bottom: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', width: '100%' },
  })

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('detail', { data })} style={[styles.container, { backgroundColor: theme === "sombre" ? Colors.home_card : Colors.white }]}>
      <View style={styles.content}>
        <View style={styles.image_box}>
          <Image source={{ uri: `${api_public}/images/${data?.medias[0]}` }} style={styles.image} />
        </View>
        <View style={styles.restaurant_infos}>
          <View style={styles.top}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: theme === "sombre" ? Colors.white : Colors.black }}>
              {(data.title && data.title.length <= 16) ? data.title.slice(0, 16) : data.title.slice(0, 16) + "..."}
            </Text>
          </View>

          <Text style={{ fontWeight: '300', fontSize: 12, color: Colors.main }}> {formatNumberWithSpaces(data?.started_price)} FCFA </Text>

          <View style={styles.center}>
            {data?.categories?.slice(0, 3)?.map((categorie, i) =>
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={{ color: theme === "sombre" ? "wheat" : Colors.black, fontSize: 12 }}> {categorie} </Text>
              </View>
            )}
          </View>

          <View style={styles.bottom}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="location-sharp" color={theme === "sombre" ? Colors.white : Colors.dark} size={16} />
              {users?.map(user => {
                if (data?.sellerID === user?._id)
                  return <Text key={data?._id} style={{ fontSize: 12, color: theme === "sombre" ? Colors.white : Colors.dark }}> {user.town ? user.town.length <= 14 ? user.town.slice(0, 14) : user.town.slice(0, 14) + "..." : "Non renseignée"}</Text>
              })}
            </View>

            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              {/* <Ionicons name="ios-time-outline" size={19} /> */}
              <CountdownTimer targetDate={new Date(data?.expiration_time).getTime()} size={13} txtSize={5} hideLabel={false} />
            </View>

          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SearchedItem

