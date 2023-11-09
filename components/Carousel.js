import React from 'react';
import { ScrollView, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';


// Define o componente "Carousel" como uma função que recebe a propriedade "navigation"
const Carousel = ({ navigation }) => {
   // Cria um array de objetos, cada um representando uma imagem com propriedades específicas

   //Array: Um array de objetos é uma estrutura de dados em programação que permite armazenar 
   //uma coleção de objetos em uma única variável. Cada elemento do array é um objeto completo
   // por si só, e cada objeto pode ter suas próprias propriedades e valores mas são armazenados em uma única váriavel,
   //nesse caso, "images"

  const images = [
    {
      id: 1,
      imageUrl: require('../assets/comercio.jpg'), //Caminho da imagem
      description: 'Comércios', // Descrição da imagem
      nextPage: 'ComercioScreen', // Tela que será chamada ao clicar na imagem
    },

    {
      id: 2,
      imageUrl: require('../assets/placas.jpg'),
      description: 'Placas',
      nextPage: 'PlacaScreen',
    },
    {
      id: 3,
      imageUrl: require('../assets/coversacao.jpg'),
      description: 'Conversação',
      nextPage: 'AudioScreen',
    },
    // Pode adicionar mais fotos
  ];

  const images2 = [
    {
      id: 4,
      imageUrl: require('../assets/zonasdeperigo.jpg'),
      description: 'Zonas de perigo',
      nextPage: 'ZonaPerigoScreen',
    },
    {
      id: 5,
      imageUrl: require('../assets/monetario.jpg'),
      description: 'Converter monetário',
      nextPage: 'ConverterScreen',
    },
  ];

  return (
    <View style={styles.container}>
  {/* Renderiza uma View que serve como container principal */}
  <ScrollView horizontal contentContainerStyle={styles.carousel}>
    {/* Renderiza um ScrollView que permite rolagem horizontal */}
    {images.map((image) => (
      // Mapeia cada objeto do array "images"
      <TouchableOpacity
        key={image.id}
        onPress={() => {
          if (image.nextPage === 'AudioScreen') {
            // Navega para 'AudioScreen' se o nextPage for 'AudioScreen'
            navigation.navigate('AudioScreen');
          } else {
            // Caso contrário, navega para a tela especificada em nextPage
            navigation.navigate(image.nextPage);
          }
        }}
      >
        {/* Renderiza um componente TouchableOpacity, que é clicável */}
        <View style={styles.imageContainer}>
          {/* Renderiza uma View que contém a imagem e a descrição */}
          <Image source={image.imageUrl} style={styles.image} />
          {/* Renderiza a imagem */}
          <Text style={styles.description}>{image.description}</Text>
          {/* Renderiza o texto de descrição */}
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
  
  <View style={styles.spacing} />
  {/* Renderiza um espaço entre os dois carrosséis */}
  
  <ScrollView horizontal contentContainerStyle={styles.carousel}>
    {images2.map((image) => (
      // Mapeia cada objeto do array "images2"
      <TouchableOpacity
        key={image.id}
        onPress={() => {
          navigation.navigate(image.nextPage);
          // Navega para a tela especificada em nextPage
        }}
      >
        {/* Renderiza um componente TouchableOpacity, que é clicável */}
        <View style={styles.imageContainer}>
          {/* Renderiza uma View que contém a imagem e a descrição */}
          <Image source={image.imageUrl} style={styles.image} />
          {/* Renderiza a imagem */}
          <Text style={styles.description}>{image.description}</Text>
          {/* Renderiza o texto de descrição */}
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  carousel: {
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 30,
    marginLeft: 2,
    width: 150,
    height: 140,
    borderRadius: 8,
    overflow: 'visible',
    backgroundColor: '#F7F7F7',
  },
  image: {
    marginRight: 2,
    marginLeft: 2,
    width: 145,
    height: 75,
    borderRadius: 9,
    resizeMode: 'center',
  },
  description: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  spacing: {
    height: 1,
  },
});

export default Carousel;
