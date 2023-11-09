import React, { useContext, useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';

import EntrarScreen from "../pages/EntrarScreen";
import { StackRoutes } from "./stack.routes";

import { UserContext } from "../contexts/useUser";
import HomeScreen from "../pages/HomeScreen";
import { BottomTabRoutes } from "./tab.routes";

export function Routes() {
  const { user, setUser } = useContext(UserContext);

  const [initializing, setInitializing] = useState(true);

  // recebe um parâmetro chamado user. Esta função será 
  //chamada sempre que houver uma alteração no estado de autenticação do usuário.
  function onAuthStateChanged(user) {

    //chamando a função setUser que foi recebida através do contexto UserContext
    // Ela serve para atualizar o estado do usuário com o novo valor user que foi passado como parâmetro para a função onAuthStateChanged.
    setUser(user);

    //Isto verifica se o aplicativo está em um estado inicial de inicialização (initializing). 
    //Se for o caso, então setInitializing(false) é chamado para indicar que a inicialização foi concluída.
    if (initializing) setInitializing(false);
  }
  
  //
  useEffect(() => {

    //Aqui, está sendo chamada a função onAuthStateChanged quando ocorre uma mudança no estado de autenticação.
    // O onAuthStateChanged é um método oferecido por algumas bibliotecas de autenticação (como o Firebase Authentication)
    // que permite observar mudanças no estado de autenticação.
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
   
   //Esta parte do código é responsável por lidar com a desinscrição (unsubscribe) da 
   //função que observa mudanças no estado de autenticação quando o componente for desmontado. 
   //Isto é importante para evitar vazamentos de memória ou comportamentos inesperados.
    return subscriber; 
  }, []);

  //voltar pra home
  if(initializing) return null;
  return <BottomTabRoutes />;
}