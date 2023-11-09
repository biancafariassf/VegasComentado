import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';

function AdminScreen({ navigation }) {
  const [username, setUsername] = useState('admin123');
  const [password, setPassword] = useState('2023');

  const handleLogin = () => {
    // Verificar se o nome de usuário e a senha estão corretos
    if (username === 'admin123' && password === '2023') {
      // Se forem corretos, navegar para a tela OpcoesScreen
      navigation.navigate('OpcoesScreen');
    } else {
      // Caso contrário, exibir um alerta de erro de login
      Alert.alert('Erro de Login', 'Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Admin}>Administrador: Login</Text>
      <Text style={styles.label}>Login</Text>
      <TextInput

      //abre uma caixa de texto onde o que deve ser digitado deve ser igual a username
        style={styles.input}
        placeholder="Digite seu login"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput

      ////abre uma caixa de texto onde o que deve ser digitado deve ser igual a username
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        // função que será chamada sempre que o texto dentro do componente for alterado.

        //setUsername(text): Dentro da função de retorno de chamada, está sendo chamada uma função setUsername que atualiza o estado
        // username com o novo valor de text, o estado username é usado para armazenar o valor do componente de entrada de texto.
        onChangeText={(text) => setPassword(text)}
      />

      {/*chama a função handleLogin quando o notão for clicado */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1EFFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    backgroundColor: '#E9F0FC',
    color: '#B6B6B6',
    width: '80%',
    height: 50,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 5,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 8,
    fontSize: 16,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#147DEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  Admin: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AdminScreen;
