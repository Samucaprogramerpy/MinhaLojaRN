import api from '../api/axiosConfig';
import { ProdutoAPI } from '../types/api';

export async function obterTodosProdutos(): Promise<ProdutoAPI[]> {
  try {
    const resposta = await api.get<ProdutoAPI[]>('products');
    return resposta.data;
  } catch (erro: any) {
    // O interceptor do Axios em axiosConfig.ts já lida com 401
    throw new Error(erro.message || 'Erro ao buscar produtos.');
  }
}