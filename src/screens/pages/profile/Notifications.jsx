import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Colors, ExpirationVerify, css } from '../../../libs'
import { Container, NotifCard, } from '../../../components'
import { Switch } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'

const Notifications = () => {

    const { host } = useSelector(state => state?.user);
    const { encheres } = useSelector(state => state?.enchere);
    const { themes } = useSelector(state => state?.setting)

    const [vip, setVip] = useState(host?.vip === true ? true : false)
    const [favorites, setFavorites] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    //recuperer les favoris du host selon qu'il soit vip ou pas
    useEffect(() => {
        switch (vip) {
            case true:
                // setFavorites(encheres?.filter(enchere => enchere?.sellerID !== host?._id && enchere?.enchere_type === "private" && enchere?.likes?.includes(host?._id) && !ExpirationVerify(enchere?.expiration_time)))
                setFavorites(encheres?.filter(enchere => enchere?.sellerID !== host?._id && enchere?.enchere_type === "private" && enchere?.likes?.includes(host?._id) && enchere?.enchere_status === "published"))
                break;

            case false:
                // setFavorites(encheres?.filter(enchere => enchere?.sellerID !== host?._id && enchere?.enchere_type === "public" && enchere?.likes?.includes(host?._id) && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_status === "published"))
                setFavorites(encheres?.filter(enchere => enchere?.sellerID !== host?._id && enchere?.enchere_type === "public" && enchere?.likes?.includes(host?._id) && enchere?.enchere_status === "published"))
                break;

            default:
                // setFavorites(encheres?.filter(enchere => enchere?.sellerID !== host?._id && enchere?.enchere_type === "public" && enchere?.likes?.includes(host?._id) && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_status === "published"))
                setFavorites(encheres?.filter(enchere => enchere?.sellerID !== host?._id && enchere?.enchere_type === "public" && enchere?.likes?.includes(host?._id) && enchere?.enchere_status === "published"))
                break;
        }

    }, [encheres, host, vip])

    // const onRefresh = useCallback(() => {
    //     dispatch(get_all_encheres(host?._id))
    //     setRefreshing(true)
    // }, [])

    // useEffect(() => {
    //     if (loading === false) setRefreshing(false)
    // }, [refreshing, loading])

    return (
        <View style={[styles.container, { backgroundColor: themes === "sombre" ? Colors.black : Colors.white }]}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.black} />
            <View style={{}}>

                <View style={{ width: "100%", alignItems: "center" }}>
                    <Container>
                        <View style={[css.explorer.is_auth_container, { width: "100%" }]}>
                            <Text style={[css.myAuctions.title, { marginTop: 0, padding: 0, color: themes === "sombre" ? Colors.white : Colors.black }]}>Notifications</Text>
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

                {/* {loading ? <Loading text="chargement en cours" color="green" /> : */}

                {/* <Reloader refreshing={refreshing} onRefresh={onRefresh} theme={themes}> */}
                {host?.notifications?.length <= 0 ?
                    <View style={{ flexGrow: 1, alignItems: "center", height: "100%", width: "100%", justifyContent: "center", backgroundColor: themes === "sombre" ? Colors.home_card : Colors.white }}>
                        <Text style={{ color: themes === "sombre" ? "wheat" : Colors.black }}>Aucune de notifications</Text>
                    </View>
                    :
                    <ScrollView  >
                        <View style={{ paddingHorizontal: 10, flex: 1, }}>
                            {host?.notifications?.map((notifs, i) => (<NotifCard key={i} notifs={notifs} />))}
                        </View>

                        <View style={css.space.spacer} />
                    </ScrollView>
                }
                {/* </Reloader> */}
            </View>

        </View >
    )
}

export default Notifications

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    main_container: { flexGrow: 1, paddingBottom: 120 }
})