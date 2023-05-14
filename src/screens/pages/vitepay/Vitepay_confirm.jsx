import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import WebView from 'react-native-webview'
import { Container, Vitepay_cards } from '../../../components'
import { Colors, css } from '../../../libs'
import { vitepay_prod, vitepay_return, vitepay_sandbox } from '../../../libs/redux/constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { add_bid_data_enchere, vider_bid_data } from '../../../libs/redux/actions/enchere.action'
import { send_notification } from '../../../libs/redux/actions/notification.action'

const Vitepay_confirm = ({ route }) => {
    const datas = route?.params

    const [urlSecond, setUrlSecond] = useState("")
    let [status, setStatus] = useState({ success: false, decline: false, cancel: false, vitepay: true })
    const webViewRef = useRef(null)

    const { bid_data, enchere } = useSelector(state => state?.enchere)
    const { users } = useSelector(state => state?.user)
    const dispatch = useDispatch()

    console.log(datas?.link)

    useEffect(() => {
        if (datas.link && datas.link === "Erreur de création du paiement: Une erreur est survenue lors de la création du paiement") {
            dispatch(vider_bid_data())
        } else {
            if (urlSecond === `${vitepay_return}/success`) {
                if (bid_data !== null) {
                    if (bid_data?.reserve_price === true) {
                        dispatch(add_bid_data_enchere(bid_data))

                        users?.forEach(user => {
                            if (user?._id === enchere?.sellerID) {
                                dispatch(send_notification({ title: "Alerte", body: `Une de vos enchères vient d'être remportée par un acheteur. Veuillez consulter vos listes d'enchères terminées`, to: user?.notification_token }))
                            }
                        })
                    } else {
                        dispatch(add_bid_data_enchere(bid_data))
                    }
                }
                setStatus({ success: true, decline: false, cancel: false, vitepay: false })
            } else if (urlSecond === `${vitepay_return}/decline`) {
                dispatch(vider_bid_data())
                setStatus({ success: false, decline: true, cancel: false, vitepay: false })
            } else if (urlSecond === `${vitepay_return}/cancel`) {
                dispatch(vider_bid_data())
                setStatus({ success: false, decline: false, cancel: true, vitepay: false })
            } else if (urlSecond.includes(vitepay_sandbox) || urlSecond.includes(vitepay_prod)) {
                setStatus({ success: false, decline: false, cancel: false, vitepay: true })
            }
        }
    }, [datas?.link, urlSecond])

    const handleNavigationStateChange = (newNavState) => {
        const { url } = newNavState
        setUrlSecond(url)

        if (url === `${vitepay_return}/success`) {
            setStatus({ success: true, decline: false, cancel: false, vitepay: false })
        } else if (url === `${vitepay_return}/decline`) {
            setStatus({ success: false, decline: true, cancel: false, vitepay: false })
        } else if (url === `${vitepay_return}/cancel`) {
            setStatus({ success: false, decline: false, cancel: true, vitepay: false })
        } else if (url.includes(vitepay_sandbox) || url.includes(vitepay_prod)) {
            setStatus({ success: false, decline: false, cancel: false, vitepay: true })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.black} />

            <View style={{ width: "100%", alignItems: "center", backgroundColor: Colors.white }}>
                <Container>
                    <View style={[css.explorer.is_auth_container, { width: "100%" }]}>
                        {datas.link && datas.link === "Erreur de création du paiement: Une erreur est survenue lors de la création du paiement" ?
                            <Text style={[css.myAuctions.title, { marginTop: 0, padding: 0 }]}>Problème pour le moment</Text> :
                            <Text style={[css.myAuctions.title, { marginTop: 0, padding: 0 }]}>
                                {status.vitepay ? "Confirmer le paiement" : status.success ? "Opération reussie" : status.cancel ? "Opération annulée" : status.decline && "Opération échouée"}
                            </Text>
                        }
                    </View>
                    <View style={[css.creer.screen_title_line, { marginTop: 0, width: "25%", alignSelf: "flex-start" }]} />
                </Container>
            </View>

            {datas.link && datas.link !== "Erreur de création du paiement: Une erreur est survenue lors de la création du paiement" ?
                <>
                    {status.vitepay &&
                        <WebView source={{ uri: datas?.link }}
                            ref={webViewRef}
                            onNavigationStateChange={handleNavigationStateChange}
                        />
                    }

                    {status.success ?
                        <View style={styles.cancel}><Vitepay_cards type={"success"} text={"Votre operation de paiement a reussie."} setStatus={setStatus} /></View> :
                        status.cancel ?
                            <View style={styles.cancel}><Vitepay_cards type={"cancel"} text={"Vous venez d'annuler l'operation de paiement."} setStatus={setStatus} /></View> :
                            status.decline &&
                            <View style={styles.cancel}><Vitepay_cards type={"decline"} text={"Une erreur est survenue lors du traitement de la transaction.."} setStatus={setStatus} /></View>
                    }
                </> :
                <View style={styles.cancel}><Vitepay_cards type={"cancel"} text={"Nous rencontrons un petit problème pour le moment"} setStatus={setStatus} /></View>
            }
        </View>
    )
}

export default Vitepay_confirm

const styles = StyleSheet.create({
    cancel: { flex: 1, alignItems: "center", justifyContent: "center" }
})