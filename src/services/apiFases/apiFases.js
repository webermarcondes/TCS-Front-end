import axios from "axios";


const apiUrl = process.env.REACT_APP_API_URL

const getFases = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}fase/get-fases`);
      return response
    } catch (error) {
      console.error('erro ao obter:', error);
    }
  };
  
  const getFase = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}fase/get-fase/${id}`);
      return response
    } catch (error) {
      console.log('Erro ao obter o registro de fase: ',error)
    }
  };
  
  const addFase = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}fase/create-fase`,data);
      console.log('fase adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar fase:', error);
    }
  };


  const updatefase = async(id,dadosAtualizados) => {
    try{
        const response = await axios.put(`${apiUrl}fase/update-fase/${id}`, dadosAtualizados);
    }catch(error){
        console.error('Erro ao atualizar fase:', error);
    }
  }

  const excludeFase = async(id) => { 
    try{
        const response = await axios.delete(`${apiUrl}fase/delete-fase/${id}`);
        console.log('fase excluída com sucesso:', response.data);
    }catch(erro){
        console.error('erro ao excluir fase',erro)
    }
  }

  
const apiFases = {
    getFases,
    getFase,
    addFase,
    excludeFase,
    updatefase
}

export default apiFases