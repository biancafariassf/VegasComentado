import React, { useLayoutEffect, useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import firestore from "@react-native-firebase/firestore";
import { UserContext } from '../contexts/useUser';
import {commerceImages} from '../utils/globalConts';


function ComercioCard({ commerce }) {
  //falando que vai usar essas funções dentro desse arquivo
  const { user, userInformations, toggleFavorite } = useContext(UserContext);

  const { nome_comer, localizacao_comer, descricao_comer } = commerce;// nome dos campos da tabela
  const imagens = commerceImages[nome_comer]; //chamando as imagens de acordo com o nome do comércio
  const rating = commerce.rating || 4.5; //estrelas

  //count: É o número de estrelas que a função irá gerar.
  //filled: Um valor booleano que indica se as estrelas devem estar preenchidas ou não.
  const renderStars = (count, filled) => {

    //está sendo determinado o nome do ícone da estrela a ser usado. Se filled for verdadeiro, o ícone será 'star', caso contrário, será 'star-border'.
    const starIconName = filled ? 'star' : 'star-border';
    
    //um novo array é criado com o comprimento igual a count. Em seguida, a função map é chamada para iterar sobre esse array e criar um novo array de elementos.
    //(_, index): A função de mapeamento recebe dois argumentos, mas aqui estamos usando apenas o segundo, que é o índice.
    //(...) : Aqui, está sendo retornado um componente MaterialIcons para representar uma estrela.
    return Array(count).fill().map((_, index) => (
      <MaterialIcons

      // Cada estrela precisa de uma chave única, e aqui o índice é usado como chave.
        key={index}

      //O nome do ícone da estrela (pode ser 'star' ou 'star-border').  
        name={starIconName}
        
        //tamanho do ícone em pixels
        size={20}
        color="#FFD700"
      />
    ));
  };

  return (
    <View style={styles.commerceCard}>
      <View style={styles.commerceHeader}>
       {/* chamar a função toggleFavorite passando o nome do hotel */}
     
        <Text style={styles.commerceName}>{nome_comer}</Text>
        <TouchableOpacity
        onPress={() => toggleFavorite(nome_comer)}
        style={styles.favoriteButton}
      >
        <MaterialIcons
          // verifica se o hotel esta na lista de favoritos, caso esteja ele exibira o icone de favorito preenchido, caso nao esteja ele exibira o icone de favorito vazio
          name={user && userInformations?.favorites.includes(nome_comer) ? 'favorite' : 'favorite-border'}
          size={24}
          color={user && userInformations?.favorites.includes(nome_comer) ? '#0D4BF2' : '#0D4BF2'}
        />
      </TouchableOpacity>
      </View>
      <View style={styles.carouselContainer}>

      {/*usado para criar um carrossel de elementos. A propriedade autoplay indica que o carrossel deve passar automaticamente para o próximo slide. A propriedade height define a altura do carrossel em pixels  */}
        <Swiper autoplay height={150}>

        {/* Esta é uma expressão JavaScript que verifica se a variável imagens não é undefined. Se não for, ele mapeia sobre o array de imagens.*/}
        {/*imagens.map((imagem, index) => (...): Para cada imagem no array, está sendo executada uma função de mapeamento que retorna um componente. */}
          {imagens !== undefined && imagens.map((imagem, index) => (
            <View key={index} style={styles.slide}>
              <Image
              //recebe o caminho ou URI da imagem
                source={imagem}
                //estiliza
                style={styles.image}
              />
            </View>
          ))}
        </Swiper>


      </View>
      <View style={styles.starsContainer}>

      {/*está sendo chamada uma função chamada renderStars com o valor Math.floor(rating) como argumento. Isso renderizará um conjunto de estrelas preenchidas, representando a parte inteira da classificação. */}
        {renderStars(Math.floor(rating), true)}

        {/*Esta expressão verifica se há uma parte decimal na classificação (rating % 1 !== 0). Se houver, ela renderiza uma estrela meio preenchida  */}
        {rating % 1 !== 0 && <MaterialIcons name="star-half" size={20} color="#FFD700" />}
        
        {/*Aqui, está sendo chamada novamente a função renderStars, desta vez com o argumento 5 - Math.ceil(rating), o que renderiza as estrelas vazias restantes. */}
        {renderStars(5 - Math.ceil(rating), false)}
      </View>

      {/*este componente envolve o ícone de localização. */}
      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>

        {/*Dentro do View de ícone de localização, está sendo renderizado um ícone de localização usando o componente MaterialIcons. */}
          <MaterialIcons name="location-on" size={16} color="#147DEB" style={styles.locationIcon} />
        </View>
        <Text style={styles.commerceLocation}>{localizacao_comer}</Text>
      </View>
      <Text style={styles.commerceDescription}>{descricao_comer}</Text>
    
    </View>
  );
};

const ComercioScreen = () => {
  // Isso permite que o componente navegue para outras telas.
  const navigation = useNavigation();

  //está sendo criado um estado chamado loading com um valor inicial de true
  //o estado loading  será usado para indicar se os dados estão sendo carregados.
  const [loading, setLoading] = useState(true);

  // está sendo criado um estado chamado commerceData com um valor inicial de um array vazio []
  //este estado será usado para armazenar os dados relacionados ao comércio.
  const [commerceData, setCommerceData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Centros Comerciais',
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

  useEffect(() => {
    const fetchCommerceData = async () => {
      try {

        //Cria uma referência à coleção 'centros_comerciais' em Firestore.
        const collectionRef = firestore().collection('centros_comerciais');//nome da tabela
       
       //Obtém uma "snapshot" da coleção, que contém os documentos atuais na coleção.
        const snapshot = await collectionRef.get();

        //Mapeia os dados dos documentos usando a função map. Para cada documento, está sendo chamada a função (doc) => doc.data(), que retorna os dados do documento
        const commerceList = snapshot.docs.map((doc) => doc.data());
        
        //  Atualiza o estado commerceData com a lista de dados obtidos.
        setCommerceData(commerceList);

        // Atualiza o estado de loading para false, indicando que os dados foram carregados.
        setLoading(false);
      } catch (error) {
        console.log('Erro ao buscar dados do Firestore:', error);
        setLoading(false);
      }
    };

    fetchCommerceData();
  }, []);

  if (loading) return null;

  return (
    <View style={styles.container}> 

      <ScrollView contentContainerStyle={styles.contentContainer}>
     
     {/*está sendo mapeado o array commerceData, que contém os dados dos comércios */}
    {/*Para cada commerce no array, está sendo executada a função de mapeamento, que retorna um componente. */}  
     {commerceData.map((commerce, index) => (

//A propriedade key é usada para fornecer uma chave única a cada item.
          <View key={index} style={styles.commerceWrapper}>

          {/*Dentro da View, está sendo renderizado um componente ComercioCard, componente é responsável por exibir informações sobre um comércio específico. */}
            <ComercioCard commerce={commerce} />
          </View>
        ))}
      </ScrollView>
    </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFFF',
  },
  favoriteIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  favoriteButton: {
    position: "absolute",
    top: -7,
    right: 10,
    marginRight: -10,
   
  }, 
  
  contentContainer: {
    paddingBottom: 20,
  },
  commerceWrapper: {
    marginBottom: 20,
  },
  commerceCard: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  commerceName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  commerceLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  commerceDescription: {
    fontSize: 16,
    color: '#333',
  },
  carouselContainer: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIconContainer: {
    marginRight: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0303',
  },
});

export default ComercioScreen;
