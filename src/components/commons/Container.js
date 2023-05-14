import { StyleSheet, View } from 'react-native'
import React from 'react'

const Container = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    )
}

export default Container

const styles = StyleSheet.create({
    container: { width: "95%", alignItems: "center" }
})