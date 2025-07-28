import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { obterTodosProdutos } from '../services/servicosProdutos';
import { ProdutoAPI } from '../types/api'; // Reutilize a interface
import Input from './TelaBuscaProdutos';

interface TelaProdutosProps {
  aoLogout: () => void;
}

export default function TelaProdutos({ aoLogout }: TelaProdutosProps) {
  const navegacao = useNavigation(); 
  const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoAPI[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemErro, setMensagemErro] = useState('');
  const [termoBusca, setTermoBusca] = useState(''); // Estado para o campo de busca

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
  }, [aoLogout]); // aoLogout como dependência para garantir que a função esteja atualizada

 
  const renderizarItemProduto = ({ item }: { item: ProdutoAPI }) => (
    <TouchableOpacity
      style={estilos.itemProduto}
      onPress={() => navegacao.navigate("DetalhesProduto", { produtoId: item.id })}
    >
      <Image source={{ uri: item.image }} style={estilos.imagemProduto} />
      <View style={estilos.detalhesProduto}>
        <Text style={estilos.tituloProduto}>{item.title}</Text>
        <Text style={estilos.categoriaProduto}>{item.category}</Text>
        <Text style={estilos.precoProduto}>R$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (carregandoProdutos) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (mensagemErro) {
    return (
      <View style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Fazer Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.tituloPagina}>Produtos</Text>
        <TouchableOpacity onPress={() => navegacao.navigate("Busca")}>
          <Text style={estilos.lupa}>🔍︎ Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Sair</Text>
          <TouchableOpacity onPress={() => navegacao.navigate("TelaAdmin")}>
            <text style={estilos.adm}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg></text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View>

      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemProduto}
        contentContainerStyle={estilos.listaConteudo}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 10, },
  containerCentral: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tituloPagina: { fontSize: 26 },
  botaoLogout: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, flexDirection: 'row'},
  lupa : { fontSize: 20, },
  textoBotao: { fontSize: 14, marginRight: 15 },
  inputBusca: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15 },
  itemProduto: { flexDirection: 'row', padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  imagemProduto: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
  detalhesProduto: { flex: 1 },
  tituloProduto: { fontSize: 16, marginBottom: 5 },
  categoriaProduto: { fontSize: 12, marginBottom: 5, opacity: 0.7 },
  precoProduto: { fontSize: 15, fontWeight: 'bold' },
  listaConteudo: { paddingBottom: 20 },
  mensagemErro: { textAlign: 'center', marginBottom: 20 },
  adm : { fontSize: 12 }
});

