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

export async function obterProdutoPorId(id: number): Promise<ProdutoAPI> {
  try {
    const resposta = await api.get<ProdutoAPI>(`products/${id}`);
    return resposta.data;
  } catch (erro: any) {
    if (erro.response && erro.response.status === 404) {
      throw new Error("Produto não encontrado.");
    }
    throw new Error(erro.message || "Erro ao buscar detalhes do produto.");
  }
}