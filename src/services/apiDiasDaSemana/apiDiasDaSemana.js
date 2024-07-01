import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL

const getDiasDaSemana = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}diadasemana/`);
      return response.data
    } catch (error) {
      console.error('Erro ao obter os dias da semana:', error);
    }
  };
  
const getDiaDaSemana = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}diadasemana/${id}`);
      return response.data
    } catch (error) {
      console.log('Erro ao obter o registro de dia da semanaa ',error)
    }
  };

  const apiDiaDaSemana = {
    getDiaDaSemana,
    getDiasDaSemana
  }
  export default apiDiaDaSemana;