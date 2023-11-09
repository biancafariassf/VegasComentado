import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { UserContext } from "../contexts/useUser";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// Objetos de imagens
import {
  hotelImages,
  PontoTuristicoImages,
  pacoteImages,
  commerceImages,
} from "../utils/globalConts";

//  Esta é a definição de uma função chamada FavoriteCard que recebe cinco propriedades 
//como argumentos, essas propriedades são passadas quando o componente é usado em outro lugar.
function FavoriteCard({ nome, descricao, onRemove, imageURIs, onPressCard }) {
  return (
    //está sendo renderizado um componente TouchableOpacity que representa o card de favorito
    // Quando este card é pressionado, a função onPressCard será chamada.
    <TouchableOpacity style={styles.card} onPress={onPressCard}>

    {/*  Este é um componente Image que exibe a primeira imagem da lista imageURIs como a imagem do card
    O estilo styles.cardImage é aplicado.*/}
      <Image style={styles.cardImage} source={imageURIs[0]} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{nome}</Text>

        {/* Renderiza a descrição do card, limitando o número de linhas a três e aplicando um efeito de elipse para texto que ultrapassa as três linhas */}
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.cardText}>
          {descricao}
        </Text>
      </View>
      <TouchableOpacity style={styles.heartButton} onPress={onRemove}>

      {/*Renderiza o ícone de coração usando o componente AntDesign. */}
        <AntDesign name="heart" size={24} color="#0D4BF2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

//chamando um pacote diferente pq puxa campos diferentes do restante
function FavoriteCardPacotes2({
  agencia,
  hotel_pct,
  valor,
  descricao,
  onRemove,
  imageURIs,
  onPressCard,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPressCard}>
      <Image style={styles.cardImage} source={imageURIs[0]} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{agencia}</Text>
        <Text style={styles.cardTitlePacote}>{hotel_pct}</Text>
        <Text style={styles.cardTextPacote}>Valor: R$ {valor}</Text>
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.cardText}>
          {descricao}
        </Text>
      </View>
      <TouchableOpacity style={styles.heartButton} onPress={onRemove}>
        <AntDesign name="heart" size={24} color="#0D4BF2" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export function Profile() {

  //O componente está usando o Context API do React para consumir os valores de UserContext,
  //ele está extraindo os valores de user, userInformations, handleSignOut, toggleFavorite e getInformations do contexto.
  const { user, userInformations, handleSignOut, toggleFavorite, getInformations } = useContext(UserContext);

  //Estão sendo usados hooks de estado (useState) para inicializar variáveis locais.
  const [hoteis, setHoteis] = useState([]);
  const [pontosTuristicos, setPontosTuristicos] = useState([]);
  const [comercio, setComercio] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigationHoteis = useNavigation(); // Para hotéis


  // inicia um efeito de foco usando o useFocusEffect. 
  //Isso significa que o código dentro desta função será executado quando o componente receber o foco.
  useFocusEffect(useCallback(() => {

    //Verifica se a variável loading é falsa. Se for, então chama setLoading(true) 
    //para indicar que o carregamento está em andamento.
    !loading && setLoading(true);

    // Esta função vai buscar os dados dos hotéis, mas também pode buscar dados de outras coleções, 
    //dependendo do restante do código que não foi mostrado aqui.
    async function getData() {

      //Usa o Firestore para obter todos os documentos da coleção "hoteis".
      await firestore().collection("hoteis").get().then((querySnapshot) => {
        
        //inicia uma lista vazia chamada hoteis para armazenar dados dos hoteis
        const hoteis = [];

        //Percorre todos os documentos obtidos na coleção "hoteis".
        querySnapshot.forEach((documentSnapshot) => {

          //Verifica se userInformations.favorites existe e então itera sobre os favoritos do usuário.
          userInformations.favorites && userInformations.favorites.forEach((favorite) => {

            //Verifica se o nome do hotel no favorito do usuário corresponde ao nome do hotel no documento atual.
            if (favorite === documentSnapshot.data().nome_hot) {

              //Se houver correspondência, adiciona os dados do hotel à array hoteis.
              hoteis.push(documentSnapshot.data());
            }
          });
        });

        //Define o estado hoteis com a array de dados dos hotéis.
        setHoteis(hoteis);
      });





     //Utiliza o Firestore para buscar todos os documentos da coleção "pontos_turisticos".
      await firestore().collection("pontos_turisticos").get().then((querySnapshot) => {

        //Cria uma array vazia chamada pontosTuristicos que será usada para armazenar os dados dos pontos turísticos.
        const pontosTuristicos = [];

        //Percorre todos os documentos obtidos na coleção "pontos_turisticos".
        querySnapshot.forEach((documentSnapshot) => {

          //Adiciona os dados do ponto turístico atual à array pontosTuristicos.
          pontosTuristicos.push(documentSnapshot.data());
        });

        //Atualiza o estado pontosTuristicos com a array de dados dos pontos turísticos.
        setPontosTuristicos(pontosTuristicos);
      });


      await firestore().collection("centros_comerciais").get().then((querySnapshot) => {
        const comercio = [];
        querySnapshot.forEach((documentSnapshot) => {
          comercio.push(documentSnapshot.data());
        });
        setComercio(comercio);
      });
      await firestore().collection("pacotes_viagem").get().then((querySnapshot) => {
        const pacotes = [];
        querySnapshot.forEach((documentSnapshot) => {
          pacotes.push(documentSnapshot.data());
        });
        setPacotes(pacotes);
      });
      setLoading(false);
    };
    getData();
  }, [user, userInformations.favorites]));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image style={styles.image} source={{ uri: user.photoURL }} />
          <Text style={styles.username}>{user.displayName}</Text>
        </View>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleSignOut}>
          <Feather name="log-out" size={20} color="white" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/*Esta linha verifica várias condições antes de renderizar o conteúdo dentro do bloco condicional. */}
      {/*!loading: Verifica se a variável loading é falsa. Ou seja, se o carregamento dos dados já foi concluído. */}
      {/* !getInformations: Verifica se a variável getInformations é falsa.*/}
      {/*  Verifica se a array de favoritos userInformations.favorites não está vazia.*/}
      {/*userInformations.favorites !== null: Verifica se a array de favoritos userInformations.favorites não é nula. */}

      {!loading && !getInformations && userInformations.favorites.length !== 0 && userInformations.favorites !== null ? (
        <ScrollView contentContainerStyle={styles.contentContainer}>

        {/*Usa map para iterar sobre cada elemento da array userInformations.favorites. favorite é o elemento atual e index é o índice do elemento. */}
          {userInformations.favorites.map((favorite, index) => {

            //Para cada favorite, procura na array hoteis um hotel cujo nome seja igual ao favorite. O resultado é armazenado em favoriteData.
              const favoriteData = hoteis.find((hotel) => hotel.nome_hot === favorite);

              //Verifica se favoriteData (ou seja, se um hotel correspondente foi encontrado).
              if (favoriteData) {
                return (

                  //
                  <FavoriteCard

                  //Define uma chave única para o componente, que é importante para o React gerenciar a renderização eficientemente.
                    key={index}

                    //Passa o nome do hotel (favoriteData.nome_hot) como uma propriedade chamada nome para o componente FavoriteCard.
                    nome={favoriteData.nome_hot}

                    //Passa a descrição do hotel (favoriteData.descricao_hot) como uma propriedade chamada descricao para o componente FavoriteCard.
                    descricao={favoriteData.descricao_hot}

                    //Passa um conjunto de imagens associadas ao hotel (hotelImages[favoriteData.nome_hot]) como uma propriedade chamada imageURIs para o componente FavoriteCard.
                    imageURIs={hotelImages[favoriteData.nome_hot]}

                    //Passa uma função que, quando chamada, remove o hotel da lista de favoritos (toggleFavorite(favoriteData.nome_hot)) como uma propriedade chamada onRemove para o componente FavoriteCard.
                    onRemove={() => toggleFavorite(favoriteData.nome_hot)}

                    //quando clicar no card, ir para hotel screen
                    onPressCard={() =>
                      navigationHoteis.navigate("HotelScreen", {
                        hotelData: favoriteData,
                      })
                    }
                  />
                );
              }
              return null;
            })}

          {userInformations.favorites.map((favorite, index) => {
              const favoriteData = pontosTuristicos.find(
                (pontosTuristicos) => pontosTuristicos.nome_ptur === favorite
              );

              if (favoriteData) {
                return (
                  <FavoriteCard
                    key={index}
                    nome={favoriteData.nome_ptur}
                    descricao={favoriteData.descricao_ptur}
                    imageURIs={PontoTuristicoImages[favoriteData.nome_ptur]}
                    onRemove={() => toggleFavorite(favoriteData.nome_ptur)}
                    onPressCard={() =>
                      navigationHoteis.navigate("PontoTuristicoScreen", {
                        hotelData: favoriteData,
                      })
                    }
                  />
                );
              }
              return null;
            })}

          {userInformations.favorites.map((favorite, index) => {
              const favoriteData = comercio.find(
                (comercio) => comercio.nome_comer === favorite
              );

              if (favoriteData) {
                return (
                  <FavoriteCard
                    key={index}
                    nome={favoriteData.nome_comer}
                    descricao={favoriteData.descricao_comer}
                    imageURIs={commerceImages[favoriteData.nome_comer]}
                    onRemove={() => toggleFavorite(favoriteData.nome_comer)}
                    onPressCard={() =>
                      navigationHoteis.navigate("ComercioScreen", {
                        hotelData: favoriteData,
                      })
                    }
                  />
                );
              }
              return null;
            })}

          {userInformations.favorites.map((favorite, index) => {
            const favoriteData = pacotes.find(
              (pacote) => pacote.valor === favorite
            );
            if (favoriteData) {
              return (
                <FavoriteCardPacotes2
                  key={index}
                  agencia={favoriteData.agencia}
                  hotel_pct={favoriteData.hotel_pct}
                  valor={favoriteData.valor}
                  imageURIs={pacoteImages[favoriteData.agencia]}
                  onRemove={() => toggleFavorite(favoriteData.valor)}
                  onPressCard={() =>
                    navigationHoteis.navigate("PacoteScreen", {
                      hotelData: favoriteData,
                    })
                  }
                />
              );
            }
            return null;
          })}
        </ScrollView>
      ) : !loading && !getInformations && userInformations.favorites.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* criar quando nao tem favoritos */}
          <Text>Você não favoritou nada ainda</Text>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* carregando */}
          <Text>Carregando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1EFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#147DEB",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  username: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
  },
  buttonLogout: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#0D4BF2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardImage: {
    width: 104,
    height: 148,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "black",
  },
  cardTitlePacote: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
    color: "black",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: "black",
  },
});
