import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Colors } from '../../libs'

const NoEnchere = ({ message, size, theme, style }) => {
    const styles = StyleSheet.create({
        message: { fontSize: size ? size : 17 }
    })

    return <Text style={[styles.message, style, { color: theme === "sombre" ? "wheat" : Colors.black }]}> {message} </Text>
}

export default NoEnchere

