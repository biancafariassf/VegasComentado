import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

// biblioteca Axios para fazer requisições HTTP em JavaScript,
// que será usada para buscar dados de uma API de conversão de moedas.
import axios from 'axios';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(''); //Usa o hook useState para criar três estados: amount (que vai armazenar a quantidade de dinheiro a ser convertida),
  const [convertedAmount, setConvertedAmount] = useState(''); //vai armazenar o valor convertido
  const [exchangeRate, setExchangeRate] = useState(''); //que vai armazenar a taxa de câmbio

  //Define uma constante chamada API_BASE_URL que contém o URL da API 
  //de onde serão obtidas as taxas de câmbio.
  const API_BASE_URL = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL';

  //Define uma função convertCurrency que será chamada para converter a moeda. 
  //Ela é assíncrona (async) porque faz uma requisição HTTP usando Axios.
  const convertCurrency = async () => {

    //Dentro do try, a função faz uma requisição GET
    // para a API de taxas de câmbio e armazena a resposta em response.
    try {

      //O valor da taxa de câmbio é extraído da resposta 
      //(response.data.USDBRL.bid) e armazenado no estado exchangeRate.
      //Em seguida, verifica se amount tem um valor válido e não é NaN.
      // Se for o caso, calcula o valor convertido e o armazena no estado convertedAmount.
      const response = await axios.get(API_BASE_URL);

      //Se ocorrer algum erro durante a requisição, ele é capturado no bloco catch e exibido no console.
      console.log('Response:', response.data);
      const rate = response.data.USDBRL.bid;

      //etExchangeRate(rate); é uma chamada para a função setExchangeRate, 
      //que foi criada utilizando o hook useState. Ela serve para atualizar
      // o estado exchangeRate com o valor da taxa de câmbio obtida na resposta da requisição à API.
      setExchangeRate(rate);


      //Aqui começa uma condicional if, que verifica duas condições:
      //amount tem um valor (ou seja, não é uma string vazia ou null).
      //!isNaN(amount) verifica se amount não é um valor que não seja um número 
      //(NaN, que significa "Not a Number"). Isso garante que amount seja um valor numérico válido.
      if (amount && !isNaN(amount)) {

        //Se ambas as condições acima forem verdadeiras, o código dentro do if é executado. 
        //Aqui, parseFloat é usado para converter amount e rate em números de ponto flutuante
        // (números com decimais).
       //Em seguida, amount é dividido por rate para calcular o valor convertido.
       // Antes, na versão anterior, estava multiplicando, mas agora foi corrigido para a operação correta de divisão.
        const convertedValue = parseFloat(amount) / parseFloat(rate); // Alteração para dividir em vez de multiplicar
        
        //convertedValue.toFixed(2) arredonda convertedValue para dois dígitos após a vírgula decimal 
        //e retorna uma string.
        // Por exemplo, se o valor fosse 123.456789, após toFixed(2) seria "123.46".
       //setConvertedAmount atualiza o estado convertedAmount com o valor convertido, 
       //garantindo que a interface do usuário reflita a conversão.
        setConvertedAmount(convertedValue.toFixed(2));

        
      }

      //Esta linha começa um bloco catch que captura e lida com exceções
      // (erros) que podem ocorrer no bloco de código dentro de um
      // bloco try. error será a variável que conterá a informação
      // sobre o erro que ocorreu.
    } catch (error) {

      // imprime uma mensagem de erro no console. 
      //O texto 'Error fetching data:' é uma string 
      //que será impressa primeiro, seguido pelo valor 
      //contido na variável error. Isso é útil para depurar
      // e entender o que deu errado durante a execução do código.
      console.error('Error fetching data:', error);
    }
  };


//  indica o que o componente irá renderizar na tela quando for chamado.
  return (


    <View style={styles.container}>
      <View style={styles.content}>

        {/*  Aqui, um componente Text está sendo renderizado.
         Ele exibirá o texto "Valor em reais (BRL):". 
         o estilo label está sendo aplicado a este texto.*/}
      <Text style={styles.label}>Valor em reais (BRL):</Text>


      {/* Este é um componente de entrada de texto que permite aos usuários 
      inserirem valores. As propriedades value, onChangeText,
       keyboardType e placeholder estão sendo passadas 
       para este componente para controlar seu comportamento e aparência.*/ }
        <TextInput



          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
          placeholder="Digite o valor em reais"
          style={styles.input}
        />
        <TouchableOpacity onPress={convertCurrency} style={styles.button}>
          <Text style={styles.buttonText}>Converter</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Valor convertido em dólar (USD):</Text>
        
        <TextInput
          value={convertedAmount}
          style={styles.convertedInput}
          editable={false}
        />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  label: {
    alignItems: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 20,
  },
  container: {
    width: 350,
        height:400,
        borderRadius:14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
  },

  content: {
    
      width: 350,
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
  },
  input: {
    fontSize: 17,
        //fontWeight: 'bold',
        width: 310,
        height:50,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#D8D2FF',
        borderRadius:8,
  },
  button: {
    backgroundColor: '#147DEB',
    padding: 10,
    height:45,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize:21,
  },
  convertedInput: {
    width: 310,
    height:50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#D8D2FF',
    borderRadius:8,
    fontSize: 17,
  },
});

export default CurrencyConverter;
