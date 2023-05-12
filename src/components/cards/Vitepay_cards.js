import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { Colors } from '../../libs'
import { colors } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const Vitepay_cards = ({ text, type, setStatus }) => {
    const navigation = useNavigation()
    const { enchere } = useSelector(state => state?.enchere)

    console.log("vitepay_card ", enchere)


    const styles = StyleSheet.create({
        info_card: {
            width: "80%", height: "50%", alignItems: "center", justifyContent: "center",
            gap: 10,
            padding: 20, borderWidth: 1, borderColor: type === "success" ? colors.success : type === "cancel" ? Colors.warning : Colors.danger,
            paddingVertical: 40, borderRadius: 5,
            backgroundColor: Colors.white,
            shadowColor: type === "success" ? colors.success : type === "cancel" ? Colors.warning : Colors.danger,
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 10,
            borderRadius: 10
        },
        text: { fontSize: 22, letterSpacing: 1, fontWeight: 300 },
        return_btn: { marginTop: 35, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: Colors.home_card, borderRadius: 5 },
        return_text: { color: Colors.white }
    })

    return (
        <View style={styles.info_card}>
            {type === "cancel" ?
                <FontAwesome name="warning" size={50} color={Colors.warning} /> :
                <FontAwesome5 name={type === "success" ? "handshake" : type === "decline" && "times-circle"} size={50} color={type === "success" ? colors.success : type === "decline" && Colors.danger} />
            }
            <Text style={[styles.text, { color: type === "success" ? colors.success : type === "cancel" ? Colors.warning : Colors.danger, textAlign: "center" }]}>{text}</Text>

            <TouchableOpacity onPress={() => { setStatus({ success: false, decline: false, cancel: false, vitepay: true }); navigation.goBack() }} style={styles.return_btn} activeOpacity={0.7}>
                <Text style={styles.return_text}>Retourner à l'enchère</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Vitepay_cards

