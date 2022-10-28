import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function ConversationItem(props) {

    const baloonStyle = [];
    const containerStyle = [];

    if (props.isUserMessage) {
        baloonStyle.push(styles.userBaloon);
        containerStyle.push(styles.userContainer);
    } else {
        baloonStyle.push(styles.botBaloon);
        containerStyle.push(styles.botContainer);
    }

    return (
        <View style={containerStyle}>
            <Text style={baloonStyle}>{props.children}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    botContainer: {
        flexDirection: "row",
    },
    userContainer: {
        flexDirection: "row-reverse",
    },
    botBaloon: {
        fontSize: 16,
        margin: 6,
        padding: 8,
        backgroundColor: "#8c8c8c",
        color: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    userBaloon: {
        fontSize: 16,
        padding: 6,
        backgroundColor: "#1fd655",
        color: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
});