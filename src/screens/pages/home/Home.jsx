import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StatusBar, Text, View } from 'react-native'
import { CategoriesArticleHome, Colors, ExpirationVerify, css, isEmpty, notificationListener, requestUserPermission, updateUser } from '../../../libs'
import { CardHome, CustSwiper, Favorite, Loading, NoEnchere, Reloader } from '../../../components'
import { useDispatch, useSelector } from 'react-redux'
import { get_all_encheres } from '../../../libs/redux/actions/enchere.action'
import messaging from '@react-native-firebase/messaging'


const Home = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [data, setData] = useState([])
    const [firebase_token, setFirebase_token] = useState("")

    const { host } = useSelector(state => state?.user)
    const { encheres, loading } = useSelector(state => state?.enchere)
    const { themes } = useSelector(state => state?.setting)
    const dispatch = useDispatch()

    useEffect(() => {
        if (host?.vip === true)
            setData(encheres?.filter(enchere => enchere?.enchere_status === "published" && !ExpirationVerify(enchere?.expiration_time) && (enchere?.enchere_type === "private" || enchere?.enchere_type === "public")))
        else
            setData(encheres?.filter(enchere => enchere?.enchere_status === "published" && !ExpirationVerify(enchere?.expiration_time) && enchere?.enchere_type === "public"))

    }, [encheres])


    const onRefresh = useCallback(() => {
        dispatch(get_all_encheres(host._id))
        setRefreshing(true)
    }, [])

    useEffect(() => {
        if (loading === false) setRefreshing(false)
    }, [refreshing, loading])

    useEffect(() => {
        requestUserPermission()
        notificationListener()

        if (!host.notification_token || host?.notification_token === "") {
            messaging().getToken()
                .then(res => setFirebase_token(res))
        }
    }, [])

    // useEffect(() => {
    //     if (firebase_token !== "") {
    //         dispatch(updateUser({ id: host?._id, hostID: host?._id, notification_token: firebase_token }))
    //     }
    // }, [firebase_token])

    return (
        loading ? <Loading text="chargement en cours" color="green" /> : (

            <Reloader refreshing={refreshing} onRefresh={onRefresh} theme={themes}>
                <StatusBar barStyle={"light-content"} backgroundColor={Colors.black} />
                <View style={css.home.img_container}>
                    <CustSwiper />
                </View>

                <View style={css.home.enchere_container}>
                    <Text style={[css.home.enchere_category_title, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Enchères en vedette</Text>
                    <View style={[css.creer.screen_title_line, { marginTop: 0, width: "20%" }]} />

                    {isEmpty(data) ?
                        <View style={{ height: 180, justifyContent: "center" }}>
                            <NoEnchere size={15} style={{ textAlign: "center" }} theme={themes} message="Aucune enchère en vedette n'existe pour le moment." />
                        </View> :
                        <FlatList data={data.slice(0, 4)} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item) => item?._id.toString()}
                            renderItem={({ item }) => <Favorite data={item} theme={themes} width={data.length <= 1 ? 340 : 290} height={180} />}
                        />
                    }
                </View>

                <View style={css.home.category_container}>
                    <Text style={[css.home.enchere_category_title, { color: themes === "sombre" ? Colors.white : Colors.black }]}>Les catégories</Text>
                    <View style={[css.creer.screen_title_line, { marginTop: 0, marginBottom: 15, width: "20%" }]} />

                    <View style={css.home.categories_lists}>
                        {CategoriesArticleHome.slice(0, 6).map((category, i) => <CardHome key={i} h_img={135} theme={themes} container_width={"47%"} mb={10} category={category} />)}
                    </View>
                </View>
            </Reloader>
        )
    )
}

export default Home