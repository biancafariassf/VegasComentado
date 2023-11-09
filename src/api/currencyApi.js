//biblioteca popular para fazer requisições HTTP em JavaScript.
import axios from 'axios';

//Define duas constantes: BASE_URL que contém o URL base da API de conversão de moedas 
//TOKEN = chave de autenticação para usar a api.
const BASE_URL = 'https://api.invertexto.com/api-conversor-moedas';
const TOKEN = '4121|t41vewuMEuMvZCLvjyNcTsfepihCmirg';



//Exporta uma função chamada getCurrencyConversion
//que é marcada como assíncrona (async). 

//assíncrona=   não espera que uma operação, como uma requisição de rede, seja concluída antes de prosseguir para a próxima instrução.

//Ela aceita três argumentos: fromCurrency (moeda de origem), 
//toCurrency (moeda de destino) e amount (quantidade de dinheiro a ser convertida).
export const getCurrencyConversion = async (fromCurrency, toCurrency, amount) => {
  //try-catch que lida com possíveis erros que podem ocorrer durante a execução do código.


  //o bloco try, a função faz uma requisição GET usando Axios para o endpoint de conversão da API.
  // Ela passa os parâmetros fromCurrency, toCurrency e amount como parte da URL.
  //Além disso, envia um cabeçalho de autorização (Authorization) que contém o token de autenticação obtido da constante TOKEN.
  //Se a requisição for bem-sucedida, a resposta é armazenada na constante response e é retornado
  // o response.data que  contém a informação de conversão de moedas.
  try {
    const response = await axios.get(`${BASE_URL}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;

    //Se ocorrer um erro, ele é capturado pelo bloco catch e é 
    //lançado novamente  para ser tratado por quem chamar esta função.
  } catch (error) {
    throw error;
  }
};

