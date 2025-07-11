import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { realizarLogin } from '../services/servicoAutenticacao';
import { salvarToken } from '../services/servicoArmazenamento';

interface TelaLoginProps {
  aoLoginSucesso: () => void; // Função para notificar o App.tsx do sucesso
}

export default function TelaLogin({ aoLoginSucesso }: TelaLoginProps) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const lidarComLogin = async () => {
    setCarregando(true);
    setMensagemErro('');
    try {
      // Credenciais de teste da Fake Store API: 'mor_2314' e '83r5^_'(senha)
      const resposta = await realizarLogin({ usuario: nomeUsuario, senha: senhaUsuario });
      await salvarToken(resposta.token);
      aoLoginSucesso();
    } catch (erro: any) {
      setMensagemErro(erro.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Login</Text>
      <TextInput
        style={estilos.input}
        placeholder="Nome de Usuário"
        value={nomeUsuario}
        onChangeText={setNomeUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senhaUsuario}
        onChangeText={setSenhaUsuario}
        secureTextEntry
      />
      {carregando ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity
          style={estilos.botao}
          onPress={lidarComLogin}
          disabled={!nomeUsuario || !senhaUsuario}
        >
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      )}
      {mensagemErro ? <Text style={estilos.mensagemErro}>{mensagemErro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
  botao: { width: '100%', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  textoBotao: { fontSize: 16 },
  mensagemErro: { marginTop: 15, textAlign: 'center' },
});