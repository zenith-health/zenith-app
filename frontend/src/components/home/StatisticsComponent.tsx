import {
    Box,
    Heading,
    Text
  } from '@chakra-ui/react'
  import { useEffect, useState } from 'react';
  import ReactApexChart from 'react-apexcharts';
  

  interface Anamnese {
    id: string;
    historico_medico: string;
    alergias: string;
    medicamentos: string;
    user_id: string;
  }

export function StatisticsComponent() {
    const [anamnesisList, setAnamnesisList] = useState<Anamnese[]>([]);
  
    useEffect(() => {
      const fetchAnamnesisData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token não encontrado no localStorage');
          }
  
          const response = await fetch('http://localhost:5000/api/anamnesis/', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
  
          const data = await response.json();
          setAnamnesisList(data);
        } catch (error) {
          console.error('Error fetching anamnese data:', error);
        }
      };
  
      fetchAnamnesisData();
    }, []);
  
    const chartOptions = {
      series: anamnesisList.map(() => Math.random() * 100), 
      options: {
        chart: {
          type: 'polarArea',
        },
        labels: anamnesisList.map((anamnese) => anamnese.historico_medico || 'N/A'),
        fill: {
          opacity: 1,
          colors: ['#006400', '#008000', '#32CD32', '#7CFC00', '#ADFF2F'], 
        },
        stroke: {
          width: 1,
          colors: ['#006400'],
        },
        yaxis: {
          show: false,
        },
        legend: {
          position: 'bottom',
        },
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 0,
            },
            spokes: {
              strokeWidth: 0,
            },
          },
        },
        theme: {
          monochrome: {
            enabled: true,
            shadeTo: 'light',
            shadeIntensity: 0.6,
          },
        },
      },
    };
  
    return (
      <Box p={6}>
        <Heading>Estatísticas de Anamnese</Heading>
        <Text>Veja as análises e relatórios sobre sua saúde e bem-estar.</Text>
        <Box display='flex' justifyContent='center' mt={6}>
          <ReactApexChart options={chartOptions.options} series={chartOptions.series} type="polarArea" width={600} />
        </Box>
      </Box>
    );
  }
  