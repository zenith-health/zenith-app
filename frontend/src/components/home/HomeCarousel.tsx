import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import anamneseImage from '../../assets/anamiseseCarrossel.png';
import dadosImage from '../../assets/DadosCarrossel.png';
import estatisticasImage from '../../assets/EstatisticasCarrossel.png';
import solucoesImage from '../../assets/SolucoesCarrossel.png';

function SmallHomeCarousel() {
  return (
    <div style={{ width: '70%', margin: '0 auto' }}>
      <Carousel 
        showArrows={true} 
        showThumbs={false} 
        infiniteLoop={true} 
        autoPlay={true} 
        interval={3000} 
        transitionTime={500}
        dynamicHeight={true}
      >
        <div>
          <img src={anamneseImage} alt="Anamnese Image" />
        </div>
        <div>
          <img src={dadosImage} alt="Imagem 2" />
        </div>
        <div>
          <img src={estatisticasImage} alt="Imagem 3" />
        </div>
        <div>
          <img src={solucoesImage} alt="Imagem 4" />
        </div>
      </Carousel>
    </div>
  );
}

export default SmallHomeCarousel;
