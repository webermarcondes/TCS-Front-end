import axios from "axios";


const apiUrl = process.env.REACT_APP_API_URL

const getSalas = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}/salas`);
      return response.data
    
    } catch (error) {
      console.error('erro ao obter:', error);
    }
  };
  const getSala = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/sala/${id}`);
      return response.data
    } catch (error) {
      console.log('Erro ao obter o registro de sala: ',error)
    }
  };
  
  const addSala = async (numero) => {
    try {
      const response = await axios.post(`${apiUrl}/sala`, { numero });
      console.log('sala adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar sala:', error);
    }
  };

  const excludeSala = async(id) => { 
    try{
        const response = await axios.delete(`${apiUrl}/sala/${id}`);
        console.log('sala excluída com sucesso:', response.data);
    }catch(erro){
        console.error('erro ao excluir sala',erro)
    }
  }

  const updateSala= async(id,dadosAtualizados) => {
    try{
        const response = await axios.put(`${apiUrl}/sala/${id}`, dadosAtualizados);
    }catch(error){
        console.error('Erro ao atualizar sala:', error);
    }
  }
  
const apiSalas = {
    getSalas,
    getSala,
    addSala,
    excludeSala,
    updateSala
}

export default apiSalas