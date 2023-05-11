import { Image, TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { Colors, api_public, formatNumberWithSpaces } from '../../../libs'
import { useDispatch, useSelector } from 'react-redux'
import { edit_enchere } from '../../../libs/redux/actions/enchere.action'

const EnchereWinItem = ({ data, toggleOverlay, setData }) => {

  const { host, users } = useSelector(state => state?.user)
  const { themes } = useSelector(state => state?.setting)
  const dispatch = useDispatch()

  const handlePress = () => {
    toggleOverlay()
    setData(data)
  }

  const prix_gagnant = data?.history[data?.history?.length - 1]?.montant

  const styles = StyleSheet.create({
    // container: { width: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, shadowColor: Colors.dark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 2, borderRadius: 5, marginVertical: 5, },
    container: { backgroundColor: themes === "sombre" ? Colors.black : Colors.white, width: "100%", borderRadius: 5, marginVertical: 5, borderWidth: 1, borderColor: data?.enchere_type === "private" ? "tomato" : "rgba(0,0,0,0.2)" },

    content: { width: '100%', flexDirection: 'row' },
    image_box: { width: '30%', height: 142, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
    image: { width: '100%', height: "100%", resizeMode: 'cover', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
    restaurant_infos: { paddingHorizontal: 5, paddingTop: 7, width: '70%', },

    top: { flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', width: '100%' },
    center: { flexDirection: 'row', gap: 10, width: '100%' },
    bottom: { flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end', width: '100%', marginTop: 5 },
  })

  const handleConfirm = () => {
    if (data?.receive_confirmation === false) {
      Alert.alert("Attention action irréversible", "Avez-vous vraiment reçu votre produit ?",
        [{ text: "Non" }, { text: "Oui", onPress: () => dispatch(edit_enchere(data?._id, host?._id, null, { receive_confirmation: true })) }]
      )
    } else {
      Alert.alert("Information", "Vous avez confirmé déjà avoir reçu votre produit", [{ text: "Ok" }])
    }
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

          <View style={styles.center}>
            {data?.categories?.slice(0, 3)?.map((categorie, i) =>
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={{ color: Colors.brown, fontSize: 12 }}> {categorie} </Text>
              </View>
            )}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: themes === "sombre" ? Colors.white : Colors.black }}>Prix initial :</Text>
            <Text style={{ fontSize: 12, color: Colors.main }}> {formatNumberWithSpaces(data?.started_price)} FCFA </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: themes === "sombre" ? Colors.white : Colors.black }}>Prix gagnant :</Text>
            <Text style={{ fontSize: 12, color: Colors.success }}> {formatNumberWithSpaces(prix_gagnant)} FCFA </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: themes === "sombre" ? Colors.white : Colors.black }}>Propriétaire :</Text>
            <Text style={{ fontSize: 12, color: Colors.primary }}>
              {users?.map((user, i) => {
                if (data?.sellerID === user?._id) {
                  return user?.phone
                }
              })}
            </Text>
          </View>

          <View style={styles.bottom}>
            <TouchableOpacity style={{ backgroundColor: data.receive_confirmation && data.receive_confirmation === true ? Colors.success : Colors.home_card, borderRadius: 5 }} activeOpacity={0.7} onPress={handleConfirm}>
              <Text style={{ paddingHorizontal: 10, paddingVertical: 3, color: Colors.white }}> {data.receive_confirmation && data.receive_confirmation === true ? "Réception déjà confirmée" : "Confirmer la réception"} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default EnchereWinItem
