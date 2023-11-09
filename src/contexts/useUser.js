import React, { createContext, useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';



//criando um contexto chamado UserContext usando a função createContext do React
export const UserContext = createContext();


//definindo a função UserProvider que recebe o componente children
//função responável por prover o contexto criado, ou seja dentro dela serão definidos 
//os estados e funções relacionadas ao contexto
export function UserProvider({ children }) {

  //criando um estado chamado user, e uma função para atualiza´-lo chamada setUser, 
  //o estado inicial é true pq de inicio não tem um usuário
  const [user, setUser] = useState(true);

  //criando um estado chamado userInformations e uma função para atualiza-la chamada serUserInformation
  // informações essas no caso as coisas que o usuario favorita
  const [userInformations, setUserInformations] = useState({}); // {favorites: []}
  const [getInformations, setGetInformations] = useState(true);
  
  // está sendo utilizado o hook useNavigation do React Navigation para obter a função navigate, 
  //que permite navegar entre telas no aplicativo.
  const { navigate } = useNavigation();


  //definindo uma função de favoritar a partir do nome que está cadastrado no banco
  async function toggleFavorite(name) {
    //se o usuário ja estiver logado, navegar pra EntrarScreen, se não
    //exibir uma mensagem
    if(!user) {
      navigate("EntrarScreen");
      ToastAndroid.show('Faça o login para favoritar', ToastAndroid.SHORT);
      return;
    }
    

    //verificando se o item especificado já está nos favoritos do usuário no banco,
    //o resultado dessa verificação (verdadeiro ou falso) é armazenado na variável isFavorite.
    const isFavorite = userInformations.favorites.includes(name);
   

    // atualizando um documento na coleção "users" no Firestore
    // a parte { Favoritos: ... } está atualizando o campo "Favoritos" com um novo valor
    //se isFavorite for verdadeiro, o nome será removido da lista usando firestore.FieldValue.arrayRemove(name),
    // se nao, sera adicionado usando firestore.FieldValue.arrayUnion(name).
    firestore().collection('users').doc(user.uid).update({
      Favoritos: isFavorite === true ? firestore.FieldValue.arrayRemove(name) : firestore.FieldValue.arrayUnion(name)
    });


  //userInformations está sendo atualizado usando a função setUserInformations
  //ela aceita uma função de atualização de estado que recebe o estado anterior
  // (prevState) e retorna o novo estado.
    setUserInformations(prevState => ({

      //copia todos os valores do estado anterior.
      ...prevState,

      // campo "favorites" está sendo atualizado com um novo valor
      //se isFavorite for verdadeiro, o nome será removido da lista usando
      // .filter(), caso contrário, será adicionado usando o operador spread [...prevState.favorites, name].
      favorites: isFavorite === true
        ? prevState.favorites.filter(favorite => favorite !== name) 
        : [...prevState.favorites, name]
    }));
  };
  
  //define a função handleSignOut
  async function handleSignOut() {

    // utilizando o método signOut do objeto auth() para deslogar o usuário
   // está sendo utilizado o await para aguardar a conclusão da operação antes de continuar.
    await auth().signOut()

    //dps do signOut, um bloco de código é executado se a operação for bem sucedida
    // se sim, está sendo usado o método then com uma função async que contém as próximas etapas.
    .then(async () => {

      // chamando a função sign out do google para deslogar o usuário
      await GoogleSignin.signOut()

      //bloco de código é executado se a operação for bem-sucedida
      .then(async () => {

        //revoga o acesso do aplicativo às informações da conta do Google, etapa adicional de segurança.
        await GoogleSignin.revokeAccess();

        //atualizando o estado para nulo já que agora o usuário foi desligado
        setUser(null);

        //atualiza a lista de favoritos pra uma lista vazia
        setUserInformations({favorites: []});

        //msg de sucesso exibida quando consegue se deslogar
        ToastAndroid.show('Saiu com sucesso', ToastAndroid.SHORT);
      })

      //Se algum erro ocorrer durante o processo de signOut, o bloco catch será acionado
      // Neste caso, o estado do usuário também é atualizado para null.
      .catch(() => setUser(null));
    })

    // Se ocorrer um erro durante a execução de qualquer uma das operações,
    // uma mensagem de erro é exibida através do ToastAndroid.
    .catch(() => ToastAndroid.show('Erro ao sair', ToastAndroid.SHORT));
  };


  //define uma função que aceita o argumento (userUid) que é o id do usuário
  async function getUserInformations(userUid) {

    // Antes de realizar a consulta ao Firestore, verifica-se se a variável getInformations é falsa
    // Se for falsa, ela é atualizada para verdadeira (setGetInformations(true)) para indicar que a consulta está em andamento.
    !getInformations && setGetInformations(true);

    //Aqui, é feita uma consulta ao Firestore para obter o documento correspondente ao userUid na coleção 'users'. 
    firestore().collection('users').doc(userUid).get()

    //Em seguida, um bloco de código é executado se a operação for bem-sucedida. Dentro deste bloco,
   //  documentSnapshot contém os dados do documento.
    .then((documentSnapshot) => {

      //Aqui, verifica-se se o documento existe. Se existir, o estado userInformations é atualizado
      // com a lista de favoritos do usuário. Se não existir, a lista de favoritos é definida como um array vazio.
      if (documentSnapshot.exists) {
        setUserInformations({favorites: documentSnapshot.data().Favoritos});
      } else {
        setUserInformations({favorites: []});
      }
    })

    //O bloco finally é executado independentemente de a operação ter sido bem-sucedida ou não
    //neste caso, ele é usado para garantir que setGetInformations(false) seja chamado para indicar que a consulta foi concluída.
    .finally(() => {
      setGetInformations(false);
    })
  }

  //definindo a função 
  async function handleGoogleSignIn() {

    //verifica-se se o dispositivo possui os serviços do Google Play Services necessários para autenticação. 
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    //É feita uma chamada para iniciar o processo de autenticação com o Google
    //o idToken obtido será usado para criar credenciais de autenticação.
    const { idToken } = await GoogleSignin.signIn();

    //As credenciais de autenticação do Google são criadas a partir do idToken obtido.
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    //O Firebase Authenticação é usado para fazer login com as credenciais geradas.
    await auth().signInWithCredential(googleCredential)

    //Se o login for bem-sucedido, um bloco de código é executado. user contém as informações do usuário autenticado
    .then(async (user) => {

      //O estado user é atualizado com as informações do usuário autenticado.
      setUser(user.user);

      //É feita uma consulta ao Firestore para obter o documento associado ao UID do usuário autenticado.
      await firestore().collection('users').doc(user.user.uid).get()

      //Se a consulta for bem-sucedida, um bloco de código é executado. documentSnapshot contém os dados do documento
      .then(async (documentSnapshot) => {

        //verifica-se se o documento existe, se nao existir, 
        //um novo documento é criado na coleção 'users' com o UID do usuário autenticado e um campo 'favoritos' inicializado com um array vazio
        if (!documentSnapshot.exists) {
          await firestore().collection('users').doc(user.user.uid).set({
            Favoritos: [],
          });

          //Se o documento existir, a função getUserInformations é chamada para obter e atualizar as informações do usuário
        } else {
          getUserInformations(user.user.uid);
        }
      })

      //mensagem de sucesso
      .then(() => {
        ToastAndroid.show('Entrou com sucesso', ToastAndroid.SHORT);
      })
    })

    //se der erro aparece no console
    .catch((error) => {
      console.log(error)
    });
  };


  //todas as funções abaixo podem ser acessadas pelo restante dos arquivos
  return (
    <UserContext.Provider value={{ user, setUser, handleGoogleSignIn, handleSignOut, getInformations,
      setGetInformations, getUserInformations, userInformations, setUserInformations, toggleFavorite,  }}>
      {children}
    </UserContext.Provider>
  );
}