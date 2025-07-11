import api from '../api/axiosConfig'; // Importe a instância configurada do Axios 
import { CredenciaisLogin, RespostaLoginAPI } from '../types/api'; 

export async function realizarLogin(credenciais: CredenciaisLogin): Promise<RespostaLoginAPI> {  
    try {    // A Fake Store API espera 'username' e 'password'
        const resposta = await api.post<RespostaLoginAPI>('auth/login', {      
            username: credenciais.usuario,      
            password: credenciais.senha,    
        });    
        return resposta.data;  
    } catch (erro: any) {    // Tratamento de erro específico para Axios    
        if (erro.response && erro.response.status === 401) {      
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');    
        }    
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');  
    } 
}