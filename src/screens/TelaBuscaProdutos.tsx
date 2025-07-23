import { Text, StyleSheet, View, SafeAreaView, Image, FlatList } from "react-native";
import { TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { obterTodosProdutos } from '../services/servicosProdutos';
import { ProdutoAPI } from '../types/api';
import Toast from "react-native-toast-message";

interface TelaProdutosProps {
    aoLogout: () => void;
  }


const Input = ({aoLogout} : TelaProdutosProps) => {
    const Route = useRoute();
    const naveg = useNavigation();
    const [itens, setItens] = useState<string>('');
    const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoAPI[]>([]);
    const [carregandoProdutos, setCarregandoProdutos] = useState(true);
    const [mensagemErro, setMensagemErro] = useState('');
    const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);

    

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
          if (produtosEncontrados.length === 0 && itens !== '') {
            Toast.show ({
                type : 'info',
                text1: "Nenhum item encontrado",
                text2: `Para "${itens}"`
            })
          } else {
            Toast.show ({
                type: 'info',
                text1: `Foram encontrados ${produtosEncontrados.length}`,
                text2: `Para "${itens}"`
            });
          }
        }
      }, [itens, listaProdutos]); // Dependências: termoBusca e listaProdutos
    
      const renderizarItemProduto = ({ item }: { item: ProdutoAPI }) => (
        <TouchableOpacity
          style={styles.itemProduto}
          onPress={() => naveg.navigate("DetalhesProduto", { produtoId: item.id })}
        >
          <Image source={{ uri: item.image }} style={styles.imagemProduto} />
          <View style={styles.detalhesProduto}>
            <Text style={styles.tituloProduto}>{item.title}</Text>
            <Text style={styles.categoriaProduto}>{item.category}</Text>
            <Text style={styles.precoProduto}>R$ {item.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
      );

    return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.botao} onPress={() => naveg.goBack()}>
                    <Text>{"< Voltar"}</Text>
                </TouchableOpacity>
                <Text style={styles.Text}>Procure um Produto</Text>
                <TextInput style={styles.input} placeholder="Digite um produto:" value={itens} onChangeText={setItens}/>
                <Text></Text>
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
    input : {
        borderRadius : 10,
        borderColor : "black",
        borderWidth : 1.5,
        marginTop : 50,
        padding : 10

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
})

export default Input