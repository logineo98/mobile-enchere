import React, { useState } from 'react'
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { Colors, ExpirationVerify, areIn, convertDateToMillis, css, formatNumberWithSpaces } from '../../../libs'
import { Container, CountdownTimer, Loading, Related } from '../../../components'
import { Overlay } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { api_public } from '../../../libs/redux/constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRef } from 'react'
import { get_enchere, vider_new_enchere } from '../../../libs/redux/actions/enchere.action'

const Detail = ({ route }) => {
    const navigation = useNavigation()
    const enchere_id = route?.params?.data?._id

    const [visible, setVisible] = useState(false)
    const [data, setData] = useState(null)
    const [relatedData, setRelatedData] = useState([])
    const [enchereStatus, setEnchereStatus] = useState("non connu")
    const [enchereType, setEnchereType] = useState("non connu")

    const scrollViewRef = useRef(null)

    const { host, users } = useSelector(state => state?.user)
    const { encheres, new_enchere, enchere, loading } = useSelector(state => state?.enchere)
    const { themes } = useSelector(state => state?.setting)
    const dispatch = useDispatch()

    const toggleOverlay = () => setVisible(!visible)

    useEffect(() => {
        dispatch(get_enchere(enchere_id, host?._id))
    }, [enchere_id, host])

    useEffect(() => {
        setData(enchere)
    }, [enchere])

    useEffect(() => {
        const tab = []
        encheres?.forEach(enchere => {
            if (areIn(enchere?.categories, data?.categories))
                if (host?.vip === true) {
                    if (enchere?._id !== data?._id && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_status === "published" && (enchere?.enchere_type === "private" || enchere?.enchere_type === "public")) tab.push(enchere)
                } else if (enchere?._id !== data?._id && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_status === "published" && enchere?.enchere_type === "public") tab.push(enchere)
        })
        setRelatedData(tab)

        if (data?.enchere_status === "published") setEnchereStatus("publiée")
        else if (data?.enchere_status === "pending") setEnchereStatus("en attente de validation")
        else if (data?.enchere_status === "rejected") setEnchereStatus("rejetée")
        else if (data?.enchere_status === "closed") setEnchereStatus("terminée")

        if (data?.enchere_type === "private") setEnchereType("VIP")
        else setEnchereType("publique")
    }, [encheres, data])

    useEffect(() => {
        if (host?.vip === false)
            new_enchere !== null && Alert.alert("Information", "Votre enchère a été créée avec succès, veuillez patienter le temps de son approbation.", [{ text: "Ok", onPress: () => dispatch(vider_new_enchere()) }])
        else new_enchere !== null && Alert.alert("Information", "Votre enchère a été créée avec succès", [{ text: "Ok", onPress: () => dispatch(vider_new_enchere()) }])
    }, [])

    const participate_enchere = () => {
        const own = data?.sellerID !== host?._id ? false : true
        if (host?.facebook || host?.vip === true) {
            navigation.navigate("make_a_bid", { enchere_id: data?._id, own })
        } else {
            Alert.alert("Avertissement", "Veuillez, vous connecter à facebook d'abord au niveau du profil.", [{ text: "OK" }])
        }
    }

    return (
        loading ? <Loading text="veuillez patientez..." color="green" /> :
            <>
                <StatusBar barStyle={"light-content"} backgroundColor={Colors.black} />

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} ref={scrollViewRef}>
                    <View style={css.details.container}>
                        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={[css.details.bottomSheet, { backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }]} animationType="slide" animationDuration={1000}>
                            <View style={css.details.sheet_header}>
                                <Text style={[css.details.sheet_title, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Description</Text>
                                <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlay}><Fontisto name="close-a" size={18} style={css.details.sheet_close} /></TouchableOpacity>
                            </View>

                            <View style={css.creer.screen_title_line} />

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.details.desc_container}>
                                <Text style={[css.details.desc, { color: themes === "sombre" ? Colors.white : Colors.black }]}>
                                    {data?.description}
                                </Text>
                            </ScrollView>
                        </Overlay>

                        <View style={[css.details.detail_image_container, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
                            <View style={css.details.detail_image_box}>
                                {data?.medias?.length > 0 && <Image source={{ uri: `${api_public}/images/${data?.medias[0]}` }} style={[css.details.image, { width: data?.medias?.length === 1 ? "100%" : "80%", resizeMode: data?.medias?.length === 1 ? "cover" : "contain", }]} />}

                                {data?.medias?.length > 1 &&
                                    <View style={css.details.others_images}>
                                        {data?.medias?.slice(1)?.map((image, i) => (
                                            <Image source={{ uri: `${api_public}/images/${image}` }} style={css.details.others_images_image} key={i} />
                                        ))}
                                    </View>
                                }

                                <View style={[css.details.desc_button_container, { left: data?.medias?.length === 1 ? "90%" : "70%" }]}>
                                    <TouchableOpacity onPress={toggleOverlay} activeOpacity={0.6} style={css.details.desc_button}>
                                        <Entypo name="info-with-circle" size={22} color={Colors.dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <Container>
                            <View style={[css.details.main_content, { paddingBottom: 0, backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
                                <View style={[css.details.detail_title_container, { paddingBottom: 0 }]}>
                                    <View style={css.details.left}>
                                        <Text style={[css.details.detail_title_text, { color: themes === "sombre" ? Colors.white : Colors.black }]}>{(data?.title && data?.title?.length <= 14) ? data?.title?.slice(0, 14) : data?.title?.slice(0, 14) + "..."}</Text>
                                        <View style={[css.details.location]}>
                                            <Ionicons name="location-sharp" size={12} color={themes === "sombre" ? Colors.white : Colors.black} />
                                            {users?.map((user, i) => {
                                                if (data?.sellerID === user?._id)
                                                    return <Text key={i} style={[css.details.detail_text, { color: themes === "sombre" ? Colors.white : Colors.black }]}>{user?.town ? user?.town?.length <= 14 ? user?.town?.slice(0, 14) : user?.town?.slice(0, 14) + "..." : "Non renseignée"}</Text>
                                            })}
                                        </View>
                                    </View>

                                    <View style={css.details.right}>
                                        <Text style={[css.details.detail_categorie_text, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Categories</Text>
                                        {data?.categories?.length > 0 &&
                                            <View style={css.details.detail_categorie_item}>
                                                {data?.categories?.slice(0, 3)?.map((categorie, i) => (<Text key={i} style={[css.details.categorie, { color: themes === "sombre" ? "wheat" : Colors.brown }]}>.{categorie}</Text>))}
                                            </View>
                                        }
                                    </View>
                                </View>

                                <View style={css.details.separateur} />

                                <View style={css.details.detail_price_container}>
                                    <View style={css.details.price_info}>
                                        <Text style={[css.details.detail_label, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Prix initial</Text>
                                        <Text style={[css.details.price, { color: themes === "sombre" ? Colors.white : Colors.black }]}>{formatNumberWithSpaces(data?.started_price)} FCFA</Text>
                                    </View>
                                    <View style={css.details.price_info}>
                                        <Text style={[css.details.detail_label, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Prix de reserve</Text>
                                        <Text style={[css.details.price, , { color: themes === "sombre" ? Colors.white : Colors.black }]}>{formatNumberWithSpaces(data?.reserve_price)} FCFA</Text>
                                    </View>
                                </View>

                                <View style={css.details.detail_bid_info}>
                                    <View style={css.details.detail_bid_left}></View>
                                    <View style={css.details.detail_bid_right}></View>
                                </View>
                            </View>

                            <View style={[css.details.main_content, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
                                <View style={css.details.detail_bid_info}>
                                    <View style={css.details.detail_bid_left}>
                                        <Text style={[css.details.detail_label, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Prix d'enchère actuel</Text>
                                        <Text style={[css.details.price, { color: themes === "sombre" ? Colors.white : Colors.black }]}>{formatNumberWithSpaces(data?.history[data?.history?.length - 1]?.montant || data?.started_price)} FCFA</Text>
                                    </View>

                                    <View style={css.details.detail_bid_right}>
                                        <Text style={[css.details.detail_label, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Délai d'expiration</Text>

                                        <View style={css.details.delai}>
                                            {(data?.enchere_status === "closed" || ExpirationVerify(data?.expiration_time)) ? <Text style={{ color: Colors.danger }}>Terminée</Text> : <CountdownTimer targetDate={convertDateToMillis(data?.expiration_time)} size={13} txtSize={5} hideLabel={false} />}
                                        </View>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ color: themes === "sombre" ? Colors.white : Colors.black }}>Status :</Text>
                                        <Text style={{ color: Colors.warning }}> {enchereStatus} </Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={{ color: themes === "sombre" ? Colors.white : Colors.black }}>Type :</Text>
                                        <Text style={{ color: Colors.warning }}> {enchereType} </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: themes === "sombre" ? Colors.white : Colors.black }}>Propriétaire :</Text>
                                    {users?.map((user, i) => {
                                        if (data?.sellerID === user?._id)
                                            if (data?.sellerID === host?._id) return <Text key={i} style={{ color: Colors.main }}> moi </Text>
                                            else return <Text key={i} style={{ color: Colors.main }}> {user?.phone} </Text>
                                    })}
                                </View>
                            </View>

                        </Container>

                        {data?.sellerID !== host?._id && data?.enchere_status === "published" ?
                            !ExpirationVerify(data?.expiration_time) ?
                                <Container>
                                    <View style={[css.details.main_content, css.details.button, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
                                        <TouchableOpacity onPress={participate_enchere} style={css.details.detail_bid_button}>
                                            <Text style={css.details.detail_bid_button_text}>Participer à l'enchère</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Container> :
                                <Container>
                                    <View style={[css.details.main_content, css.details.button, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
                                        <TouchableOpacity onPress={participate_enchere} style={[css.details.detail_bid_button, { backgroundColor: Colors.info }]}>
                                            <Text style={css.details.detail_bid_button_text}>Voir l'etat de l'enchère</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Container> :
                            <Container>
                                <View style={[css.details.main_content, css.details.button, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
                                    <TouchableOpacity onPress={participate_enchere} style={[css.details.detail_bid_button, { backgroundColor: Colors.info }]}>
                                        <Text style={css.details.detail_bid_button_text}>Voir l'etat de l'enchère</Text>
                                    </TouchableOpacity>
                                </View>
                            </Container>

                        }

                        {/* related products down */}
                        {relatedData?.length > 0 &&
                            <>
                                <View style={[css.details.separateur, { marginTop: 40 }]} />
                                <Container >
                                    <View style={{ width: "100%", backgroundColor: themes === "sombre" ? Colors.black : Colors.white, padding: 10 }}>
                                        <Text style={css.details.detail_title_text}>Articles similaires</Text>
                                        <View style={css.creer.screen_title_line} />

                                        <View>
                                            {relatedData?.slice(0, 5)?.map((related, i) => (
                                                <Related scrollViewRef={scrollViewRef} theme={themes} data={related} key={i} />
                                            ))}
                                        </View>

                                    </View>
                                </Container>
                            </>
                        }

                    </View>
                </ScrollView >
            </>
    )
}

export default Detail