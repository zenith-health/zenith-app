import { Box, Text, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  25% { opacity: 1; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(0); }
  75% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const slides = [
  {
    title: "Um Novo Começo em Saúde",
    subtitle: "Inovação que Cuida de Você",
    text: "Fundada em 2024, por Vinicius Henrique, Jonas Bueno e Victor Portela, em São José dos Campos, SP, a Zenith nasceu com o propósito de revolucionar o cuidado à saúde. Como uma startup de tecnologia, focamos em proporcionar soluções inteligentes para armazenar anamneses e analisar seus dados de saúde. Estamos comprometidos em oferecer ferramentas que ajudam a melhorar a qualidade de vida, com segurança e eficiência.",
  },
  {
    title: "Sua Saúde em Primeiro Lugar",
    subtitle: "Tecnologia e Cuidado de Mãos Dadas",
    text: "Na Zenith, acreditamos que a tecnologia pode transformar o cuidado à saúde. Nossa missão é permitir que cada pessoa tenha acesso a análises precisas e personalizadas, utilizando seus próprios dados de saúde. Com a Zenith, seus dados estão seguros e você está no controle do seu bem-estar.",
  },
  {
    title: "Zenith: Sua Saúde, Nosso Compromisso",
    subtitle: "Alcançando o Topo do Bem-Estar",
    text: "Na Zenith, nosso compromisso é com a sua saúde. Oferecemos uma plataforma intuitiva e segura para que você possa gerenciar suas anamneses e acompanhar de perto a sua saúde. 'Zenith: sua saúde, nosso compromisso' é mais do que um slogan, é a nossa essência.",
  }
];

function TextSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Box 
      w='100%' 
      h='100%' 
      display='flex' 
      flexDir='column' 
      justifyContent='center' 
      alignItems='flex-start'
      color='white'
      animation={`${fadeInOut} 10s ease-in-out infinite`}
    >
      <Heading as='h2' size='2xl' mb={4}>
        {slides[currentSlide].title}
      </Heading>
      <Text fontSize='x-large' mb={2}>
        {slides[currentSlide].subtitle}
      </Text>
      <Text maxW='80%' fontSize='lg'>
        {slides[currentSlide].text}
      </Text>
    </Box>
  );
}

export default TextSlider;
