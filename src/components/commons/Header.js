import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Fontisto from "react-native-vector-icons/Fontisto"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Colors, images, vider_filtre_enchere } from '../../libs'
import { useDispatch, useSelector } from 'react-redux'
import * as Animatable from 'react-native-animatable';



const Header = ({ navigation, stackHeader, tabHeader, searchHeader, text, setText, filter }) => {
    const { notifs, msgs } = useSelector(state => state?.setting)
    const { host } = useSelector(state => state?.user)
    const dispatch = useDispatch();
    const [isCrownOn, setIsCrownOn] = useState(false);


    const styles = StyleSheet.create({
        //stack
        s_container: { backgroundColor: Colors.black, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", },
        s_left: { padding: 10, alignItems: "center", justifyContent: "center" },
        s_center: { alignItems: 'center', justifyContent: "center" },
        s_image: { width: 170, height: 40, resizeMode: "cover" },
        s_right: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, position: "relative", paddingRight: 10 },
        s_badge: { position: "absolute", height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.main, top: 0, right: "5%" },

        //tab
        t_container: { backgroundColor: Colors.black, padding: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", },
        t_left: { alignItems: "center", justifyContent: "center", },
        t_image: { width: 170, height: 40, resizeMode: "cover" },
        t_badge: { position: "absolute", height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.main, top: 0, right: 0 },
        t_right: { padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18, paddingRight: 20 },
        t_right_item: { position: "relative", alignItems: "center", justifyContent: "center" },
        t_mes_enchere: { backgroundColor: Colors.white, padding: 3, borderRadius: 100, alignItems: "center", justifyContent: "center" },

        //search
        // pour la partie logo
        sh_container: { backgroundColor: Colors.black, padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        sh_img_container: { width: 50, height: 50, alignItems: "center", justifyContent: "center", backgroundColor: "red" },
        sh_img: { width: "100%", height: "100%", resizeMode: "cover" },

        // pour la partie input et icon de recherche      @with notif icon width:"85%"
        sh_input_search_container: { flexDirection: "row", height: 40, width: "100%", alignItems: "center", borderRadius: 5, backgroundColor: Colors.white },
        sh_input_search: { paddingLeft: 10, paddingRight: 35, borderRadius: 5, width: "100%" }, //@with notif icon width:"80%"
        sh_search_icon: { fontWeight: "bold", paddingHorizontal: 4 },
        sh_filter: { position: "absolute", right: 2, alignItems: "center" },

        // pour la partie notification
        sh_notification_container: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
        sh_notification_icon: { fontWeight: "bold" },
        sh_badge: { position: "absolute", height: 10, width: 10, borderRadius: 10, backgroundColor: Colors.main, top: 0, right: 3 },

    })

    useEffect(() => {
        const interval = setInterval(() => {
            setIsCrownOn(!isCrownOn);
        }, 1000);

        return () => clearInterval(interval);
    }, [isCrownOn]);


    const handleGoBack = () => { navigation.goBack(); }
    const handleNavigate = (link) => { navigation.navigate(link); }

    // --------------STACK HEADER---------------
    const Back = () => (<TouchableOpacity activeOpacity={0.7} style={styles.s_left} onPress={handleGoBack}><Fontisto name='angle-left' size={22} color={"white"} /></TouchableOpacity>)

    const StackCenter = () => {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.s_center}>
                <Image source={images.logo_white_content} style={styles.s_image} />
            </TouchableOpacity>
        )
    }
    const StackRight = () => (
        <>
            <View style={[styles.s_right]}>
                {notifs && <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("notifications")}  ><Fontisto name='bell-alt' size={24} color={"white"} />{host?.notifications?.length > 0 && <View style={styles.s_badge} />}</TouchableOpacity>}

                {host?.vip &&
                    <Animatable.View style={{ alignItems: "center" }} animation={isCrownOn ? 'pulse' : null} iterationCount={isCrownOn ? 'infinite' : 1} >
                        <FontAwesome5 name="crown" size={40} color={isCrownOn ? 'gold' : Colors.main} />
                        <Text style={{ color: isCrownOn ? Colors.main : 'gold' }}>VIP</Text>
                    </Animatable.View>
                }
            </View>
            {(!notifs && !host?.vip) && <View style={[styles.s_right]}></View>}
        </>
    )

    // --------------TAB HEADER---------------
    const TabHeaderLeft = () => (
        <TouchableOpacity onPress={() => handleNavigate("home")} activeOpacity={1} style={styles.t_left}>
            <Image source={images.logo_white_content} style={styles.t_image} />
        </TouchableOpacity>)

    const TabHeaderRight = () => (
        <View style={styles.t_right}>
            {notifs && <TouchableOpacity activeOpacity={0.7} style={styles.t_right_item} onPress={() => navigation.navigate("notifications")}><Fontisto name='bell-alt' size={24} color={"white"} />{host?.notifications?.length > 0 && <View style={styles.t_badge} />}</TouchableOpacity>}
            {msgs && <TouchableOpacity activeOpacity={0.7} style={styles.t_right_item} ><MaterialIcons name='message' size={26} color={"white"} /><View style={styles.t_badge} /></TouchableOpacity>}
            <TouchableOpacity onPress={() => handleNavigate("my_auctions")} activeOpacity={0.5} style={[styles.t_right_item, styles.t_mes_enchere]}><MaterialCommunityIcons name='gavel' size={26} color={Colors.black} /></TouchableOpacity>

            {host?.vip &&
                <TouchableOpacity onPress={() => navigation.navigate("Explorer")}>
                    <Animatable.View style={{ alignItems: "center" }} animation={isCrownOn ? 'pulse' : null} iterationCount={isCrownOn ? 'infinite' : 1} >
                        <FontAwesome5 name="crown" size={40} color={isCrownOn ? 'gold' : Colors.main} />
                        <Text style={{ color: isCrownOn ? Colors.main : 'gold' }}>VIP</Text>
                    </Animatable.View>
                </TouchableOpacity>
            }
        </View>)


    if (stackHeader)
        return (<View style={[styles.s_container,]}><Back /><StackCenter /><StackRight /></View>)

    else if (tabHeader)
        return (<View style={styles.t_container}><TabHeaderLeft /><TabHeaderRight /></View>)

    // --------------SEARCH HEADER---------------
    else if (searchHeader)
        return (
            <View style={styles.sh_container}>
                <View style={styles.sh_input_search_container}>
                    <Fontisto name='search' size={22} style={styles.sh_search_icon} />
                    <TextInput style={styles.sh_input_search} placeholder='Search...' value={text} onChangeText={(txt) => setText(txt)} />

                    {!filter ?
                        <TouchableOpacity onPress={() => handleNavigate("filter")} style={styles.sh_filter} ><Ionicons name='ios-filter' size={28} color={Colors.main} /></TouchableOpacity> :
                        <TouchableOpacity onPress={() => dispatch(vider_filtre_enchere())} style={styles.sh_filter} ><MaterialCommunityIcons name='filter-variant-remove' size={28} color={Colors.main} /></TouchableOpacity>
                    }
                </View>
                {/* <TouchableOpacity activeOpacity={0.7} style={styles.sh_notification_container}>
                <Ionicons name='notifications' size={28} color={Colors.white} style={styles.sh_notification_icon} />
                <View style={styles.sh_badge} />
            </TouchableOpacity> */}
            </View>)
}

export default Header;

