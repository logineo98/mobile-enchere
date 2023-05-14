import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NetInfo from '@react-native-community/netinfo'
import { Colors } from '../../../libs'


const Screen404 = ({ route }) => {

    const checkConnection = () => {
        NetInfo.fetch().then(() => { })
    }

    return (
        <View style={styles.container}>
            <Text>Aucune connexion Internet</Text>
            <TouchableOpacity style={styles.actualisation} onPress={checkConnection}>
                <Text>Vous êtes hors ligne</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Screen404

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    actualisation: { marginVertical: 40, padding: 10, backgroundColor: Colors.light_gray },
})