import { useState, useEffect, Component } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, TouchableOpacity } from "react-native";
import { obterTodosProdutos } from '../services/servicosProdutos';
import { ProdutoAPI } from '../types/api';
import { View, StyleSheet, Text, FlatList, Image, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "./TelaBuscaProdutos";
import Toast from "react-native-toast-message";
import Svg, {Path} from "react-native-svg";



interface TelaProdutosProps {
    aoLogout: () => void;
  }


const TelaAdmin = ({aoLogout} : TelaProdutosProps) => {
    const Route = useRoute();
    const naveg = useNavigation();
    const [itens, setItens] = useState<string>('');
    const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoAPI[]>([]);
    const [carregandoProdutos, setCarregandoProdutos] = useState(true);
    const [mensagemErro, setMensagemErro] = useState('');
    const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);
    const [Visible, setVisible ] = useState(false);
    const [NomeProduto, setNomeProduto] = useState('');
    const [preco, setPreco] = useState('');


    useEffect(() => {
        const carregarProdutos = async () => {
          setCarregandoProdutos(true);
          setMensagemErro('');
          try {
            const produtos = await obterTodosProdutos();
            setListaProdutos(produtos);
            setProdutosFiltrados(produtos); // Inicialmente, a lista filtrada é a lista completa
          } catch (erro: any) {
            setMensagemErro(erro.message || 'Não foi possível carregar os produtos.');
            // O interceptor do Axios já lida com 401, mas você pode querer um fallback aqui
            if (erro.message.includes('Sessão expirada')) {
              aoLogout(); // Força o logout se a mensagem indicar sessão expirada
            }
          } finally {
            setCarregandoProdutos(false);
          }
        };
        carregarProdutos();
      }, [aoLogout]);

    useEffect(() => {
        const filtrarProdutos = listaProdutos.filter(produto =>
            produto.title.toLowerCase().includes(itens.toLowerCase()) ||
            produto.category.toLowerCase().includes(itens.toLowerCase())
          );

        setProdutosFiltrados(filtrarProdutos);

      }, [itens, listaProdutos]);
    
      useEffect(() => {
        if (itens === '') {
          setProdutosFiltrados(listaProdutos);
        } else {
          const produtosEncontrados = listaProdutos.filter(produto =>
            produto.title.toLowerCase().includes(itens.toLowerCase()) ||
            produto.category.toLowerCase().includes(itens.toLowerCase())
          );
          setProdutosFiltrados(produtosEncontrados);
        }
      }, [itens, listaProdutos]);

      const excluirProduto = async (id: number) => {
        try {
          await fetch(`https://fakestoreapi.com/products${id}`, {
            method: 'DELETE',
          });
      
          setListaProdutos(listaProdutos.filter(produto => produto.id !== id));
        } catch (error) {
          console.error('Erro ao excluir produto:', error);
        }
      };

      const addProduto = async () => {
        const contemLetras = /[a-zA-Z]/.test(preco)
        if (preco.trim() === '' || NomeProduto.trim() === '') {
          setVisible(false)
          Toast.show({
            type: "error",
            text1: "Complete os campos corretamente"
          })
        }
        else if (contemLetras) {
          setVisible(false)
          Toast.show({
            type: 'error',
            text1: 'Preço invalido!'
          })
        } else {
          setVisible(false)
          Toast.show({
            type:"info",
            text1 : 'Produto Adicionado!'
          })
          try {
            const resposta = await fetch ('https://fakestoreapi.com/products', {
              method : 'POST',
              headers : {'content-type' : 'application/json',
  
              },
              body: JSON.stringify({
                valor1 : NomeProduto,
                valor2 : preco
              }),
            })
            await resposta.json();
            console.log(resposta);
          } catch (erro) {
            console.error('Erro ao enviar', erro);
          }
        }
        
      }

    const renderizarItemProduto = ({ item }: { item: ProdutoAPI }) => (
            <TouchableOpacity
            style={styles.itemProduto}
            onPress={() => naveg.navigate("DetalhesProduto", { produtoId: item.id })}
            >
            <Image source={{ uri: item.image }} style={styles.imagemProduto} />
            <View style={styles.pai}>
                <View style={styles.detalhesProduto}>
                    <Text style={styles.tituloProduto}>{item.title}</Text>
                    <Text style={styles.categoriaProduto}>{item.category}</Text>
                    <Text style={styles.precoProduto}>R$ {item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.excluir}>
                    <TouchableOpacity onPress={() => excluirProduto(item.id)} style={styles.botaoExcluir}><Svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></Svg></TouchableOpacity>
                </View>
            </View>
            </TouchableOpacity>
        );

      return(
            <View style={styles.container}>
                <Modal animationType="slide" visible={Visible} transparent={true} presentationStyle="overFullScreen" onRequestClose={() => {setVisible(!Visible)}}>
                  <View style = {styles.component}>
                    <View style={styles.quest}>
                      <Text style = {styles.TextModal}>Adicione um Produto</Text>
                      <View style = {styles.ViewInput}>
                        <TextInput value={NomeProduto} onChangeText={setNomeProduto} style = {styles.input} placeholder="Digite o nome do produto"></TextInput>
                        <TextInput value={preco} onChangeText={setPreco} keyboardType="numeric" style = {styles.input} placeholder="Adicione o preço do produto. Ex : R$ 15,99"></TextInput>
                      </View>
                      <TouchableOpacity onPress={addProduto}><Text style={styles.novoProduto}>Adicionar Produto</Text></TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <View style = {styles.configs}>
                  <TouchableOpacity style={styles.botao} onPress={() => naveg.goBack()}>
                      <Text>{"< Voltar"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setVisible(!Visible)}>
                    <Text style = {styles.addProduto}>Adicionar Produto</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                    data={produtosFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderizarItemProduto}
                    contentContainerStyle={styles.listaConteudo}
                    />
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

    Text : {
        display: "flex",
        fontSize: 26,
        marginTop : 10,

    },
    itemProduto: { 
        flexDirection: 'row', 
        padding: 15, borderWidth: 1, 
        borderColor: '#eee', 
        borderRadius: 8, 
        marginBottom: 10, 
        alignItems: 'center' 
    },

    imagemProduto: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
    detalhesProduto: { flex: 1 },
    tituloProduto: { fontSize: 16, marginBottom: 5 },
    categoriaProduto: { fontSize: 12, marginBottom: 5, opacity: 0.7 },
    precoProduto: { fontSize: 15, fontWeight: 'bold' },
    listaConteudo: { paddingBottom: 20 },
    mensagemErro: { textAlign: 'center', marginBottom: 20 },
    botaoExcluir : {backgroundColor: 'red', padding: 5, alignItems: 'center', borderRadius: 10, width: 30, },
    excluir : {flex : 1, alignItems: 'flex-end'},
    pai : {flexDirection: 'row',  flex : 1},
    component : {flex : 1, alignItems : "center", justifyContent : "center", backgroundColor : 'rgba(0, 0, 0, 0.5)' },
    quest : {display : "flex", flexDirection : "column", backgroundColor : "white", borderRadius : 10, padding: 50, alignItems : "center", justifyContent : "space-between",},
    configs : {display : "flex", flexDirection : "row", justifyContent : "space-between"}, 
    addProduto : {marginRight : 30},
    input : {width: 'auto', padding : 10, borderRadius : 10, marginTop : 50, borderWidth : 1, borderColor : "black", color : "gray "},
    ViewInput : {display : "flex"},
    TextModal : {fontFamily : "Arial", fontSize : 16, fontWeight : "bold", marginTop : 15},
    novoProduto : {marginTop: 30}
})
export default TelaAdmin;