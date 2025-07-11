import axios from 'axios';
import { obterToken, removerToken } from '../services/servicoArmazenamento'; // Será criado no Passo 2

const api = axios.create({
  baseURL: 'https://fakestoreapi.com/', // URL base da Fake Store API
  timeout: 10000, // Tempo limite da requisição em ms
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---
//Interceptor de Requisição

//Este interceptor adiciona o token de autenticação a todas as requisições, se ele existir.
api.interceptors.request.use(
  async (config) => {
    const token = await obterToken(); // Obtém o token armazenado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  }
);

// ---Interceptor de Resposta

//Este interceptor lida com respostas de erro, especificamente com erros 401 (Não Autorizado), que geralmente indicam um token expirado ou inválido.
api.interceptors.response.use(
  (response) => response,
  async (erro) => {
    if (erro.response && erro.response.status === 401) {
      // Se o token for inválido/expirado, remove-o e pode forçar o logout
      await removerToken();
      // Sugestão: Você pode adicionar uma lógica aqui para redirecionar para a tela de login
      // ou emitir um evento global para notificar o App.tsx.
      console.warn('Token de autenticação expirado ou inválido. Realize o login novamente.');
    }
    return Promise.reject(erro);
  }
);

export default api;