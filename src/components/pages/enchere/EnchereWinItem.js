import { Image, TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import { Colors, api_public, convertDateToMillis, css, formatNumberWithSpaces } from '../../../libs'
import CountdownTimer from '../../commons/timer/CountdownTimer'
import { useSelector } from 'react-redux'

const EnchereWinItem = ({ data, toggleOverlay, setData }) => {

  const { host, users } = useSelector(state => state?.user)

  const handlePress = () => {
    toggleOverlay()
    setData(data)
  }

  const styles = StyleSheet.create({
    // container: { width: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, shadowColor: Colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 2, borderRadius: 5, marginVertical: 5, },
    container: { width: "100%", borderRadius: 5, marginVertical: 5, borderWidth: 1, borderColor: data?.enchere_type === "private" ? "tomato" : "rgba(0,0,0,0.2)" },

    content: { width: '100%', flexDirection: 'row' },
    image_box: { width: '30%', height: 120, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
    image: { width: '100%', height: "100%", resizeMode: 'cover', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
    restaurant_infos: { paddingHorizontal: 5, paddingTop: 7, width: '70%', },

    top: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', width: '100%' },
    center: { flexDirection: 'row', gap: 10, width: '100%' },
    bottom: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', width: '100%' },
  })

  const handleConfirm = () => {
    Alert.alert("Attention choix irréversible", "Avez-vous vraiment reçu votre produit ?",
      [{ text: "Non" }, { text: "Oui" }]
    )
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.container}>

      <View style={styles.content}>
        <View style={styles.image_box}>
          <Image source={{ uri: `${api_public}/images/${data?.medias[0]}` }} style={styles.image} />
        </View>
        <View style={styles.restaurant_infos}>
          <View style={styles.top}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: Colors.dark }}>{(data?.title && data?.title?.length <= 16) ? data?.title?.slice(0, 16) : data?.title?.slice(0, 16) + "..."}</Text>
            <TouchableOpacity onPress={toggleOverlay}>
              <Feather name="check-circle" size={19} color={(data.receive_confirmation && data.receive_confirmation === true) ? "green" : "red"} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontWeight: '300', fontSize: 12, color: Colors.main }}>
            {formatNumberWithSpaces(data?.started_price)} FCFA
          </Text>

          <View style={styles.center}>
            {data?.categories?.slice(0, 3)?.map((categorie, i) =>
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={{ color: Colors.brown, fontSize: 12 }}>
                  {categorie}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.center}>
            {data?.categories?.slice(0, 3)?.map((categorie, i) =>
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={{ color: Colors.brown, fontSize: 12 }}>
                  {categorie}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottom}>
            <View style={{ flexDirection: 'row' }}>
              {/* <Ionicons name="location-sharp" color={Colors.dark} size={19} />
              {users?.map(user => {
                if (data?.sellerID === user?._id)
                  return <Text key={user?._id} style={{ fontSize: 13, color: Colors.dark }}>{user?.town ? user?.town?.length <= 14 ? user?.town?.slice(0, 14) : user?.town?.slice(0, 14) + "..." : "Non renseignée"}</Text>
              })} */}
            </View>

            <TouchableOpacity style={{ backgroundColor: data.receive_confirmation && data.receive_confirmation === true ? "rgba(0,0,0,0.2)" : Colors.home_card, borderRadius: 5 }} activeOpacity={0.7} onPress={handleConfirm} disabled={(data.receive_confirmation && data.receive_confirmation === true) ? true : false}>
              <Text style={{ paddingHorizontal: 10, paddingVertical: 3, color: Colors.white }}>Confirmer reception</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default EnchereWinItem
