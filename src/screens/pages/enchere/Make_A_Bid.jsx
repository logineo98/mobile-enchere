import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { Bid_Counter, CountdownTimer, Encherisseur, Loading, Reloader, Separateur } from '../../../components'
import { Colors, ExpirationVerify, Vitepay, api_public, convertDateToMillis, css, formatNumberWithSpaces, isEmpty, updateUser } from '../../../libs'
import { Overlay } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'
import { add_bid_data, get_all_encheres } from '../../../libs/redux/actions/enchere.action'

const Make_A_Bid = ({ navigation, route }) => {
    const { data, own } = route?.params

    const [visible, setVisible] = useState(false);
    const [montant, setMontant] = useState(data?.increase_price);
    const [refreshing, setRefreshing] = useState(false)

    const { loading } = useSelector(state => state?.enchere)
    const { host } = useSelector(state => state?.user)
    const { themes } = useSelector(state => state?.setting)
    const dispatch = useDispatch()

    const lastAmount = parseInt(data?.history[data?.history?.length - 1]?.montant) || parseInt(data?.started_price);

    const toggleOverlay = () => setVisible(!visible)

    const handleOpenVitepay = (e, orderId, amount, reserve) => {
        e.preventDefault()

        const tmp_data = { enchereID: data?._id, montant: amount, reserve_price: true, date: new Date().getTime() }
        const tmp_bid_data = { hostID: host?._id, enchereID: data?._id, real_montant: amount, montant: amount, reserve_price: true, date: new Date().getTime() }

        if (reserve === true) {
            dispatch(updateUser({ id: host?._id, hostID: host?._id, tmp: tmp_data }))
            dispatch(add_bid_data(tmp_bid_data))
        }

        const vitepay = new Vitepay()
        vitepay.post_data(orderId, amount)
            .then(link => navigation.navigate("vitepay_confirm", { link }))
            .catch(error => console.error(error))
    }

    const onRefresh = useCallback(() => {
        dispatch(get_all_encheres(host?._id))
        setRefreshing(true)
    }, [])

    useEffect(() => {
        if (loading === false) setRefreshing(false)
    }, [refreshing, loading])

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.black} />

            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={css.details.bottomSheet} animationType="slide" animationDuration={1000}>
                <View style={css.details.sheet_header}>
                    <Text style={css.details.sheet_title}>Les mises disponibles</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={toggleOverlay}><Fontisto name="close-a" size={18} style={css.details.sheet_close} /></TouchableOpacity>
                </View>

                <View style={css.creer.screen_title_line} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={css.details.desc_container}>
                    {(((data?.history?.length > 0 && data?.history[data?.history?.length - 1]?.montant) < data?.reserve_price) || isEmpty(data?.history)) && (montant + lastAmount < data?.reserve_price) &&
                        <View style={{ marginVertical: 4, marginBottom: 20 }}>
                            <TouchableOpacity onPress={(e) => handleOpenVitepay(e, host?._id, data?.reserve_price, true)} style={[styles.make, { backgroundColor: Colors.black }]}>
                                <Text style={styles.btn_text}>Reserver le produit</Text>
                            </TouchableOpacity>
                            <View style={styles.reserver}><Text style={styles.reserve_txt}>prix de reservation: </Text><Text style={styles.reserce_prix}>{formatNumberWithSpaces(data?.reserve_price)} FCFA</Text></View>
                        </View>
                    }

                    <Separateur text={lastAmount > data?.reserve_price ? "OU MISER" : "MISER"} />

                    <View style={{ marginVertical: 4 }}>
                        <Bid_Counter toggleOverlay={toggleOverlay} montant={montant} setMontant={setMontant} lastAmount={lastAmount} data={data} handleOpenVitepay={handleOpenVitepay} />
                    </View>
                </ScrollView>
            </Overlay>

            <View style={[styles.product, { backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }]}>
                <TouchableOpacity onPress={() => navigation.navigate("detail", { data })} style={styles.prod}>
                    <View style={styles.image_container}>
                        <Image source={{ uri: `${api_public}/images/${data?.medias[0]}` }} style={styles.image} />
                    </View>
                    <View style={styles.infos}>
                        <Text style={[styles.name, { color: themes === "sombre" ? Colors.white : Colors.black }]}>{(data?.title && data?.title?.length <= 14) ? data?.title.slice(0, 14) : data?.title.slice(0, 14) + "..."}</Text>
                        <Text style={styles.price}>{formatNumberWithSpaces(data?.history[data?.history?.length - 1]?.montant || data?.started_price)} FCFA</Text>
                    </View>
                </TouchableOpacity>

                <View style={[styles.expiration, { alignItems: "center" }]}>
                    <Text style={{ color: themes === "sombre" ? Colors.white : Colors.black }}>Délai d'expiration</Text>
                    <CountdownTimer targetDate={convertDateToMillis(data?.expiration_time)} size={13} txtSize={5} hideLabel={false} />
                </View>
            </View>
            <View style={{ width: "100%", alignItems: "center" }}><View style={[css.creer.screen_title_line, { marginTop: 0 }]} /></View>


            {loading ? <Loading text="chargement en cours" color="green" /> :
                <Reloader refreshing={refreshing} onRefresh={onRefresh} theme={themes} >
                    {data?.history?.length > 0 ?
                        data?.history?.map((enchere) => <Encherisseur data={data} enchere={enchere} own={host?._id === enchere?.buyerID ? true : false} key={enchere?._id} />) :
                        <View style={{ height: "100%", alignItems: "center", justifyContent: "center", }}>
                            <Text style={{ fontSize: 16, letterSpacing: 1, fontWeight: 300, color: themes === "sombre" ? "wheat" : Colors.black }}>Aucune participation pour l'instant</Text>
                            {((!own && !ExpirationVerify(data?.expiration_time) || data?.enchere_status !== "closed")) && <Text style={{ fontSize: 13, letterSpacing: 1, fontWeight: 300, color: themes === "sombre" ? "wheat" : Colors.black }}>Voulez-vous bien être la première!</Text>}
                        </View>
                    }
                </Reloader>
            }
            {/* <ScrollView contentContainerStyle={{ paddingVertical: 10, flexGrow: 1, backgroundColor: themes === "sombre" ? "#262626" : Colors.white }}>
                {data?.history?.length > 0 ?
                    data?.history?.map((enchere) => <Encherisseur data={data} enchere={enchere} own={host?._id === enchere?.buyerID ? true : false} key={enchere?._id} />) :
                    <View style={{ height: "100%", alignItems: "center", justifyContent: "center", }}>
                        <Text style={{ fontSize: 16, letterSpacing: 1, fontWeight: 300, color: themes === "sombre" ? "wheat" : Colors.black }}>Aucune participation pour l'instant</Text>
                        {((!own && !ExpirationVerify(data?.expiration_time) || data?.enchere_status !== "closed")) && <Text style={{ fontSize: 13, letterSpacing: 1, fontWeight: 300, color: themes === "sombre" ? "wheat" : Colors.black }}>Voulez-vous bien être la première!</Text>}
                    </View>
                }
            </ScrollView> */}
            {!own &&
                <View style={[styles.bottom, { backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }]}>
                    {!ExpirationVerify(data?.expiration_time) && data?.enchere_status !== "closed" ?
                        <TouchableOpacity onPress={toggleOverlay} style={styles.make}>
                            <Text style={styles.btn_text}>Placer une offre</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity activeOpacity={0.8} style={[styles.make, { backgroundColor: Colors.secondary }]}>
                            <Text style={styles.btn_text}>Enchère terminée</Text>
                        </TouchableOpacity>
                    }
                </View>
            }
        </View>
    )
}

export default Make_A_Bid

const styles = StyleSheet.create({
    container: { flex: 1 },
    product: { flexDirection: "row", justifyContent: "space-between", padding: 5 },
    prod: { flexDirection: "row", justifyContent: "space-between", padding: 5 },
    image_container: { width: 65, height: 65 },
    image: { width: "100%", height: "100%" },
    bottom: { padding: 10, paddingHorizontal: 20 },
    make: { padding: 15, backgroundColor: Colors.main, alignItems: "center", justifyContent: "center", borderRadius: 5 },
    infos: { paddingLeft: 5 },
    name: { fontSize: 15, color: Colors.dark },
    price: { color: Colors.main, paddingLeft: 5, paddingTop: 5, fontSize: 14 },
    btn_text: { textAlign: "center", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: Colors.white, fontSize: 16 }
    , reserver: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    reserve_txt: { color: Colors.dark },
    reserce_prix: { color: Colors.main, fontWeight: "bold" },
    expiration: { paddingRight: 10 }
})


