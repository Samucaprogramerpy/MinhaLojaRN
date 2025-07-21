import { Text, StyleSheet, View, SafeAreaView, ImageComponent } from "react-native";
import { TextInput } from "react-native";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";



const Input = () => {
    const Route = useRoute();
    const naveg = useNavigation();
    const [produto, setProduto] = useState<string>();

    return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.botao} onPress={() => naveg.goBack()}>
                    <Text>{"< Voltar"}</Text>
                </TouchableOpacity>
                <TextInput style={styles.input} placeholder="Digite um produto:" value={produto}/>
            </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'column',
        marginTop : 50

    },
    botao : {
      marginBottom: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderWidth : 1,
      width : 85,
      alignItems : "center",
      marginLeft : 5,
      borderRadius: 5,
      backgroundColor: "#f0f0f0",
    },
    input : {
        borderRadius : 10,
        borderColor : "black",
        borderWidth : 1.5,
        marginTop : 50,
        padding : 10

    }
})

export default Input