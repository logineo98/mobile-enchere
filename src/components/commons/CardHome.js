import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../libs'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { filtre_enchere_by_category } from '../../libs/redux/actions/enchere.action'

const CardHome = ({ h_img, container_width, mb, category, theme }) => {
    const navigation = useNavigation()

    const title = category.title
    const image = category.image

    const { host } = useSelector(state => state?.user)
    const dispatch = useDispatch()

    const styles = StyleSheet.create({
        // pour les items de la partie enchere : chaque enchère correspond à un item
        item_container: { width: container_width ? container_width : 210, marginRight: 10, marginBottom: mb ? mb : 0, backgroundColor: theme === "sombre" ? Colors.home_card : Colors.white, paddingBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12 },

        // pour l'image dans le item container
        item_img_container: { height: h_img ? h_img : 200 },
        item_img: { height: "100%", width: "100%", resizeMode: "cover", borderTopLeftRadius: 10, borderTopRightRadius: 10 },

        // pour les informations en dessous de l'image dans le item container
        item_info_container: { paddingHorizontal: 10, justifyContent: "center", backgroundColor: theme === "sombre" ? Colors.home_card : Colors.white },
        item_title: { color: theme === "sombre" ? Colors.white : Colors.black, textAlign: "right", fontWeight: "bold", marginTop: 7 },
        item_description: { color: Colors.black, textAlign: "left", marginTop: 5 },
        item_participate_enchere_container: { alignItems: "flex-end", marginTop: 10 },
        item_participate_enchere_texte: { fontSize: 12, color: Colors.main },
    })

    const handleNavigate = () => {
        dispatch(filtre_enchere_by_category(host?._id, { category: title }))
        navigation.navigate("search")
    }

    return (
        <TouchableOpacity style={styles.item_container} onPress={handleNavigate}>
            <View style={styles.item_img_container}>
                <Image source={image} style={styles.item_img} />
            </View>
            <View style={styles.item_info_container}>
                <Text style={styles.item_title} numberOfLines={1}> {title} </Text>
            </View>
        </TouchableOpacity>
    )
}

export default CardHome