import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';


//definindo um componente funcional
const ComercioCrud = () => {

  //utilizando o hook useNavigation do React Navigation para obter a referência de navegação
  //Essa referência é armazenada na variável navigation.
  const navigation = useNavigation();
   

  //usado para realizar ações que dependem do layout da tela 
  //aqui, você está definindo uma função que será executada quando o componente for montado.
  React.useLayoutEffect(() => {

    //chamando setOptions na referência de navegação. Isso é usado para definir as opções de navegação para esta tela. 
    navigation.setOptions({
      headerShown: true,
      title: 'Crud Centros Comerciais',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#147DEB',
        height: 110,
        borderBottomColor: 'transparent',
        shadowColor: 'transparent',
      },
      //setinha de voltar
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => null,
    });
  }, [navigation]);

  //chamando os dados do banco e uma função para atualizar cada um deles
  const [centros_comerciais, setComercios] = useState([]);
  const [nome_comer, setNome] = useState('');
  const [localizacao_comer, setLocalizacao] = useState('');
  const [descricao_comer, setDescricao] = useState('');
  const [cod_comer, setCodComer] = useState('');
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);



  useEffect(() => {

    //Dentro do useEffect, está sendo feita uma chamada ao Firebase Firestore para obter a coleção 'centros_comerciais'
    const unsubscribe = firestore()
  .collection('centros_comerciais')

  //Este método onSnapshot escuta as alterações na coleção e retorna um snapshot representando o estado atual da coleção
      .onSnapshot((snapshot) => {

        // Aqui, o snapshot é transformado em um array de objetos, onde cada objeto representa um documento na coleção 
        //o campo selecionado é adicionado com o valor inicial false
        const centros_comerciaisData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), selecionado: false }));
        
        //O estado centros_comerciais é atualizado com os dados obtidos do Firestore
        setComercios(centros_comerciaisData);
      });

      //cancela a subscrição para as atualizações da coleção
    return () => unsubscribe();
  }, []);

  const handleCriarComercio = async () => {
    try {

      //está sendo utilizado o método add para adicionar um novo documento à coleção 'centros_comerciais'
      //O objeto passado como argumento contém os dados do comércio (nome, localização, descrição, código).
      await firestore().collection('centros_comerciais').add({ nome_comer, localizacao_comer, descricao_comer, cod_comer });
      setNome('');
      setLocalizacao('');
      setDescricao('');
      setCodComer('');

      //  Esta linha está alterando o estado mostrarFormulario para false, o que indica que o formulário para criar um novo comércio deve ser ocultado
      setMostrarFormulario(false);

      ///mostra o erro no console
    } catch (error) {
      console.log('Erro ao criar comércio:', error);
    }
  };

  const handleEditarComercio = async () => {

    // verificando se o estado editando é null ou undefined
    //se for, uma mensagem de alerta é exibida e a função é encerrada, evitando que a edição prossiga
    if (!editando) {
      Alert.alert('Atenção', 'Nenhum comércio selecionado para editar.');
      return; // Evitar a edição caso a placa selecionada não esteja definida
    }

    try {

      // usando o método update para atualizar um documento existente na coleção 'centros_comerciais'
      // o editando.id é usado para identificar o documento específico.
      await firestore().collection('centros_comerciais').doc(editando.id).update({ nome_comer, localizacao_comer, descricao_comer, cod_comer });
      
      //atualizam os campos
      setNome('');
      setLocalizacao('');
      setDescricao('');
      setCodComer('');

      //Aqui, o estado editando é atualizado para null, indicando que nenhum comércio está mais em processo de edição 
      setEditando(null);

      // indica que o formulário para editar um comércio deve ser ocultado
      setMostrarFormulario(false);


    } catch (error) {
      console.log('Erro ao editar comércio:', error);
    }
  };

  const handleExcluirComercio = async () => {

    //Esta linha procura na lista centros_comerciais um comércio que esteja marcado como "selecionado" (comercio.selecionado).
  const comercioSelecionado = centros_comerciais.find((comercio) => comercio.selecionado);


  //Em seguida, verifica se um comércio foi encontrado. Se sim, a exclusão do comércio será realizada. Caso contrário, uma mensagem de alerta será exibida.
    if (comercioSelecionado) {


      try {
        //está sendo usado o método delete para excluir um documento existente na coleção 'centros_comerciais'. O comercioSelecionado.id é usado para identificar o documento específico
        await firestore().collection('centros_comerciais').doc(comercioSelecionado.id).delete();
        
        //Esta linha atualiza o estado editando para null, indicando que nenhum comércio está mais em processo de edição
        setEditando(null);

        //altera o estado
        setMostrarFormulario(false);


      } catch (error) {
        console.log('Erro ao excluir comércio:', error);
      }
    } else {
      Alert.alert('Atenção', 'Nenhum comércio selecionado para excluir.');
    }
  };

  const handleEditar = (comercio) => {

    //verifica se o argumento comercio é verdadeiro (ou seja, se foi fornecido um comércio para edição). Se sim, a edição do comércio é iniciada
    if (comercio) {

      //O estado editando é atualizado com as informações do comércio que será editado. Isso indica que um comércio está atualmente em processo de edição
      setEditando(comercio);

      //atualizando
      setNome(comercio.nome_comer);
      setLocalizacao(comercio.localizacao_comer);
      setDescricao(comercio.descricao_comer);
      setCodComer(comercio.cod_comer);
      setMostrarFormulario(true);
    } else {
      Alert.alert('Atenção', 'Nenhum comércio selecionado para editar.');
    }
  };

   
  //selecionando comércio no banco puxando pelo código
  const handleSelecionarComercio = (comercio) => {
    const novosComercios = centros_comerciais.map((item) =>
      item.id === comercio.id ? { ...item, selecionado: !item.selecionado } : item
    );
    setComercios(novosComercios);
  };

  //posicionando os itens no banco na tela 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.tableCellHeader, styles.centeredHeader]}>
            <Text style={styles.tableCellHeaderText}>Selecionar</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellHeader, styles.centeredHeader]}>
            <Text style={styles.tableCellHeaderText}>Código</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellHeader, styles.centeredHeader]}>
            <Text style={styles.tableCellHeaderText}>Nome</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellHeader, styles.centeredHeader]}>
            <Text style={styles.tableCellHeaderText}>Localização</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellHeader, styles.centeredHeader]}>
            <Text style={styles.tableCellHeaderText}>Descrição</Text>
          </View>
        </View>

        {/*renderizando uma lista de comércios em uma interface de usuário, onde cada comércio é representado como uma linha na tabela */}
        
        {/*mapeando sobre o array centros_comerciais, que contém informações sobre os comércios. Para cada item no array, ele renderiza o conteúdo dentro dos parênteses */}
        {centros_comerciais.map((item) => (

          //renderizado um componente TouchableOpacity que envolve todo o conteúdo da linha
          //este componente permite que a linha seja clicável
          // O key={item.id} é usado para dar uma chave única a cada linha. Quando a linha é pressionada, a função handleEditar(item) é chamada, passando o comércio como argumento.
          <TouchableOpacity key={item.id} onPress={() => handleEditar(item)}>
           
           {/*define o layout da tabela onde estão os comércios*/}
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.centeredCell]}>
               
               {/* representa uma caixa de seleção (check box) que indica se o comércio está selecionado
               o valor (value) da caixa de seleção é obtido do campo selecionado do comércio e uando a caixa de seleção é clicada, a função handleSelecionarComercio(item) é chamada, 
               passando o comércio como argumento. */}
                <CheckBox
                  value={item.selecionado}
                  onValueChange={() => handleSelecionarComercio(item)}
                />


              </View>
              <View style={[styles.tableCell, styles.centeredCell]}>
                <Text style={styles.tableCellText}>{item.cod_comer}</Text>
              </View>
              <View style={[styles.tableCell, styles.centeredCell]}>
                <Text style={styles.tableCellText}>{item.nome_comer}</Text>
              </View>
              <View style={[styles.tableCell, styles.centeredCell]}>
                <Text style={styles.tableCellText}>{item.localizacao_comer}</Text>
              </View>
              <View style={[styles.tableCell, styles.centeredCell]}>

              {/* o componente Text exibe a descrição do comércio. O estilo styles.tableCellText provavelmente define a formatação do texto
               O numberOfLines={2} limita o número de linhas a 2 e ellipsizeMode="tail" indica que o texto que não cabe será truncado com reticências.*/}
                <Text style={styles.tableCellText} numberOfLines={2} ellipsizeMode="tail">
                  {item.descricao_comer}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      

      {/*renderiza um formulário para editar ou criar um novo comércio, 
      dependendo da condição mostrarFormulario */}

      {/*verifica se a variável mostrarFormulario é verdadeira. Se for, o conteúdo dentro dos parênteses será renderizado. */}
      {mostrarFormulario && (

          
        <View style={styles.formulario}>

        {/*Este componente Text exibe o título do formulário. Se editando for verdadeiro, o texto será "Editar comércio:", caso contrário, será "Novo comércio:". */}
          <Text style={styles.formTitle}>{editando ? 'Editar comércio:' : 'Novo comércio:'}</Text>
          
          {/*Outro componente View é renderizado para conter o campo de entrada de texto (TextInput). Este componente pode definir o layout ou agrupar elementos relacionados. */}
          <View style={styles.inputContainer}>

          {/*componente TextInput é usado para obter a entrada de texto do usuário. 
          Ele possui um espaço reservado ("Código"), um valor (value) definido pelo 
          estado cod_comer, e uma função de retorno de chamada (onChangeText) que atualiza o estado cod_comer quando o texto é alterado. */}
          <TextInput
              placeholder="Código"
              value={cod_comer}
              onChangeText={(text) => setCodComer(text)}
              style={styles.input}
            />


            <TextInput
              placeholder="Nome"
              value={nome_comer}
              onChangeText={(text) => setNome(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Localização"
              value={localizacao_comer}
              onChangeText={(text) => setLocalizacao(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição"
              value={descricao_comer}
              onChangeText={(text) => setDescricao(text)}
              style={styles.input}
            />
          </View>
          {/*quando o botão é pressionado a função de editar é chamada, iniciando o processo de edição */}
          <TouchableOpacity
            style={styles.button}
            onPress={editando ? handleEditarComercio : handleCriarComercio}
          >
            <Text style={styles.buttonText}>{editando ? 'Salvar' : 'Criar'}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.botoesContainer}>

      {/*Quando o botão é pressionado, a função setMostrarFormulario(true) é chamada. Isso  exibe o formulário para adicionar um novo comércio. */}
        <TouchableOpacity style={[styles.botao, { marginRight: 8 }]} onPress={() => setMostrarFormulario(true)}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>

        {/*Quando o botão é pressionado, a função handleEditar é chamada, passando o comércio selecionado como argumento. Essa ação provavelmente inicia o processo de edição do comércio. */}
        <TouchableOpacity style={[styles.botao, { marginRight: 8 }]} onPress={() => handleEditar(centros_comerciais.find(comercio => comercio.selecionado))}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        {/*Quando o botão é pressionado, a função handleExcluirComercio é chamada. Isso inicia o processo de exclusão do comércio. */}
        <TouchableOpacity style={styles.botao} onPress={handleExcluirComercio}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  table: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: '#F4F5F4',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tableCell: {
    flex: 1,
    padding: 8,
  },
  tableCellHeader: {
    backgroundColor: '#F4F5F4',
  },
  tableCellHeaderText: {
    fontWeight: 'bold',
  },
  tableCellText: {
    textAlign: 'center',
  },
  centeredHeader: {
    alignItems: 'center',
  },
  centeredCell: {
    alignItems: 'center',
  },
  formulario: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#147DEB',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    flex: 1,
    height: 49,
    backgroundColor: '#147DEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default ComercioCrud;