import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Colors, ExpirationVerify, css, isEmpty } from '../../../libs'
import { Container, Loading, NoEnchere, Reloader, Small_Enchere_Card } from '../../../components'
import { get_all_encheres } from '../../../libs/redux/actions/enchere.action'
import { Switch } from 'react-native-elements'

const My_Auctions = () => {

    const header_item = { encours: true, termine: false, rejete: false, attente: false }

    const { host } = useSelector(state => state?.user)
    const { encheres, loading } = useSelector(state => state?.enchere)
    const { themes } = useSelector(state => state?.setting)
    const dispatch = useDispatch()

    let [headerItem, setHeaderItem] = useState(header_item)
    const [vip, setVip] = useState(host?.vip === true ? true : false)
    const [refreshing, setRefreshing] = useState(false)
    const [enchere_en_cours, setEnchere_en_cours] = useState([])
    const [enchere_en_rejetee, setEnchere_en_rejetee] = useState([])
    const [enchere_en_terminee, setEnchere_en_terminee] = useState([])
    const [enchere_en_attente_de_validation, setEnchere_en_attente_de_validation] = useState([])

    //recuperer les favoris du host selon qu'il soit vip ou pas
    useEffect(() => {
        switch (vip) {
            case true:
                setEnchere_en_cours(encheres?.filter(enchere => enchere?.sellerID === host?._id && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_type === "private" && enchere?.enchere_status === "published"))
                setEnchere_en_terminee(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_type === "private" && (ExpirationVerify(enchere?.expiration_time) || enchere?.enchere_status === "closed")))
                break

            case false:
                setEnchere_en_cours(encheres?.filter(enchere => enchere?.sellerID === host?._id && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_type === "public" && enchere?.enchere_status === "published"))
                setEnchere_en_terminee(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_type === "public" && (ExpirationVerify(enchere?.expiration_time) || enchere?.enchere_status === "closed")))
                host?.vip === false && setEnchere_en_rejetee(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_status === "rejected" && enchere?.enchere_type === "public"))
                host?.vip === false && setEnchere_en_attente_de_validation(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_status === "pending" && enchere?.enchere_type === "public"))
                break

            default:
                setEnchere_en_cours(encheres?.filter(enchere => enchere?.sellerID === host?._id && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_type === "public" && enchere?.enchere_status === "published"))
                setEnchere_en_terminee(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_type === "public" && (ExpirationVerify(enchere?.expiration_time) || enchere?.enchere_status === "closed")))
                host?.vip === false && setEnchere_en_rejetee(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_status === "rejected" && enchere?.enchere_type === "public"))
                host?.vip === false && setEnchere_en_attente_de_validation(encheres?.filter(enchere => enchere?.sellerID === host?._id && enchere?.enchere_status === "pending" && enchere?.enchere_type === "public"))
                break
        }
    }, [encheres, host, vip])

    const onRefresh = useCallback(() => {
        dispatch(get_all_encheres(host?._id))
        setRefreshing(true)
    }, [])

    useEffect(() => {
        if (loading === false) setRefreshing(false)
    }, [refreshing, loading])


    const Encours = () => {
        const RenderItem = ({ item }) => {
            return (
                <View style={styles.item_container}>
                    <Container>
                        <Small_Enchere_Card data={item} theme={themes} />
                    </Container>
                </View>
            )
        }

        return (
            loading ? <Loading text="chargement en cours" color="green" /> :

                <Reloader style={styles.screen_container} refreshing={refreshing} onRefresh={onRefresh} theme={themes}>
                    {isEmpty(enchere_en_cours) ?
                        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 20, height: "100%", justifyContent: "center", backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }}>
                            <NoEnchere theme={themes} style={{ textAlign: "center" }} message="Aucune enchère en cours trouvée pour le moment" />
                        </View> :
                        <>
                            {enchere_en_cours?.map(enchere => <RenderItem key={enchere._id} theme={themes} item={enchere} width={"100%"} height={200} />)}
                            <View style={css.space.spacer} />
                        </>
                    }
                </Reloader>
        )
    }

    const Terminee = () => {
        const RenderItem = ({ item }) =>
            <View style={styles.item_container}>
                <Container>
                    <Small_Enchere_Card data={item} theme={themes} type={"finished"} />
                </Container>
            </View>

        return (
            loading ? <Loading text="chargement en cours" color="green" /> :

                <Reloader style={styles.screen_container} refreshing={refreshing} onRefresh={onRefresh} theme={themes}>
                    {isEmpty(enchere_en_terminee) ?
                        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 20, height: "100%", justifyContent: "center", backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }}>
                            <NoEnchere theme={themes} style={{ textAlign: "center" }} message="Aucune enchère terminée trouvée pour le moment" />
                        </View> :
                        <>
                            {enchere_en_terminee?.map(enchere => <RenderItem key={enchere._id} theme={themes} item={enchere} width={"100%"} height={200} />)}
                            <View style={css.space.spacer} />
                        </>
                    }
                </Reloader>
        )
    }

    const Rejetee = () => {
        const RenderItem = ({ item }) =>
            <View style={styles.item_container}>
                <Container><Small_Enchere_Card data={item} theme={themes} type={"reject"} /></Container>
            </View>

        return (
            loading ? <Loading text="chargement en cours" color="green" /> :

                <Reloader style={styles.screen_container} refreshing={refreshing} onRefresh={onRefresh} theme={themes}>
                    {isEmpty(enchere_en_rejetee) ?
                        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 20, height: "100%", justifyContent: "center", backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }}>
                            <NoEnchere theme={themes} style={{ textAlign: "center" }} message="Aucune enchère rejetée trouvée pour le moment" />
                        </View> :
                        <>
                            {enchere_en_rejetee?.map(enchere => <RenderItem key={enchere._id} theme={themes} item={enchere} width={"100%"} height={200} />)}
                            <View style={css.space.spacer} />
                        </>
                    }
                </Reloader>
        )
    }

    const AttenteValidation = () => {
        const RenderItem = ({ item }) =>
            <View style={styles.item_container}>
                <Container><Small_Enchere_Card data={item} theme={themes} type={"pending"} /></Container>
            </View>

        return (
            loading ? <Loading text="chargement en cours" color="green" /> :

                <Reloader style={styles.screen_container} refreshing={refreshing} onRefresh={onRefresh} theme={themes}>
                    {isEmpty(enchere_en_attente_de_validation) ?
                        <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 20, height: "100%", justifyContent: "center", backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }}>
                            <NoEnchere theme={themes} style={{ textAlign: "center" }} message="Aucune enchère en attente de validation trouvée pour le moment" />
                        </View> :
                        <>
                            {enchere_en_attente_de_validation?.map(enchere => <RenderItem key={enchere._id} theme={themes} item={enchere} width={"100%"} height={200} />)}
                            <View style={css.space.spacer} />
                        </>
                    }
                </Reloader>
        )
    }

    const styles = StyleSheet.create({
        header: { height: 55, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.1)", marginBottom: 5 },
        element: { height: "100%", width: host?.vip ? "50%" : "25%", justifyContent: "center", alignItems: "center", position: "relative" },
        element_text: { width: "100%", textAlign: "center", fontSize: 12, fontWeight: "bold" },
        active_under: { height: 4, width: "100%", backgroundColor: "tomato", position: "absolute", bottom: 0, left: 0, borderRadius: 5 },

        container: { flex: 1, },
        screen_container: { flex: 1, paddingTop: 10 },
        item_container: { width: "100%", alignItems: "center" },
    })

    const handlePress = (type) => {
        dispatch(get_all_encheres(host?._id))

        if (type === "encours") setHeaderItem({ encours: true, termine: false, rejete: false, attente: false })
        else if (type === "termine") setHeaderItem({ encours: false, termine: true, rejete: false, attente: false })
        else if (type === "rejete") setHeaderItem({ encours: false, termine: false, rejete: true, attente: false })
        else if (type === "attente") setHeaderItem({ encours: false, termine: false, rejete: false, attente: true })
    }

    return (
        <View style={[styles.container, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.black} />

            <View style={{ width: "100%", alignItems: "center" }}>
                <Container>
                    <View style={[css.explorer.is_auth_container, { width: "100%" }]}>
                        <Text style={[css.myAuctions.title, { marginTop: 0, padding: 0, color: themes === "sombre" ? Colors.white : Colors.black }]}>Mes enchères</Text>

                        {host?.vip &&
                            <View style={css.explorer.is_auth_button}>
                                <Text style={{ color: themes === "sombre" ? Colors.white : Colors.dark }}>Public</Text>
                                <Switch value={vip} onValueChange={vip => setVip(vip)} trackColor={{ false: '#767577', true: '#767577' }} thumbColor={vip ? Colors.main : '#f4f3f4'} />
                                <Text style={{ color: vip ? Colors.main : themes === "sombre" ? Colors.white : Colors.dark }}>VIP</Text>
                            </View>
                        }
                    </View>
                    <View style={[css.creer.screen_title_line, { marginTop: 0, width: "25%", alignSelf: "flex-start" }]} />
                </Container>
            </View>

            <View style={[styles.header, { backgroundColor: "white" }]}>
                <TouchableOpacity style={styles.element} onPress={() => handlePress("encours")}>
                    <Text style={{ ...styles.element_text, color: headerItem.encours ? "tomato" : "rgba(0,0,0,0.7)" }}>EN COURS</Text>
                    {headerItem.encours && <View style={styles.active_under} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.element} onPress={() => handlePress("termine")}>
                    <Text style={{ ...styles.element_text, color: headerItem.termine ? "tomato" : "rgba(0,0,0,0.7)" }}>TERMINÉE</Text>
                    {headerItem.termine && <View style={styles.active_under} />}
                </TouchableOpacity>

                {host?.vip === false &&
                    <>
                        <TouchableOpacity style={styles.element} onPress={() => handlePress("rejete")}>
                            <Text style={{ ...styles.element_text, color: headerItem.rejete ? "tomato" : "rgba(0,0,0,0.7)" }}>REJETÉE</Text>
                            {headerItem.rejete && <View style={styles.active_under} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.element} onPress={() => handlePress("attente")}>
                            <Text style={{ ...styles.element_text, color: headerItem.attente ? "tomato" : "rgba(0,0,0,0.7)" }}>ATTENTE DE VALIDATION</Text>
                            {headerItem.attente && <View style={styles.active_under} />}
                        </TouchableOpacity>
                    </>
                }
            </View>

            {headerItem.encours && <Encours />}
            {headerItem.termine && <Terminee />}
            {host?.vip === false &&
                <>
                    {headerItem.rejete && <Rejetee />}
                    {headerItem.attente && <AttenteValidation />}
                </>
            }

        </View>
    )
}

export default My_Auctions