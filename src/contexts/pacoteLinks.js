const pacoteUrls = {
    4: 'https://www.cvc.com.br/',
    3: 'https://www.kayak.com.br/',
    2: 'https://123milhas.com/',
    1: 'https://www.decolar.com/',
    // Adicione mais pacotes conforme necessário
  };
  
  // esse arquivo armazena todos os links que serão chamados
  // em PacotesScreen, cada um desses números é o código que aquela agência
  // ta no banco, ex: cód da CVC é 4, por isso ta "4=www.cvc..."
  //cada um dos links se conecta com o código que está no banco de acordo com cada agência
  export default pacoteUrls;
  