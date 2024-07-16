import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL

const getCoordenadores = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}usuario/get-usuarios`);
      return response.data
    } catch (error) {
      console.error('Erro ao obter coordenadores:', error);
    }
  };
  
const getCoordenador = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}usuario/get-usuario/${id}`);
      return response.data
    } catch (error) {
      console.log('Erro ao obter o registro de coordenador ',error)
    }
  };
  

  const addCoordenador = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}usuario/create-usuario`, data);
        console.log('Coordenador adicionado com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao adicionar coordenador:', error);
    }
};

  const updateCoordenador = async(id,dadosAtualizados) => {
    try{
        const response = await axios.put(`${apiUrl}usuario/update-usuario/${id}`, dadosAtualizados);
    }catch(error){
        console.error('Erro ao atualizar coordenador:', error);
    }
  }
  
  const updateCoordenadorStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${apiUrl}usuario/update-usuario-status/${id}`, { status: status }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Erro ao atualizar status do coordenador:', error);
        throw error;
    }
};
  const apiCoordenador = {
    getCoordenadores,
    getCoordenador,
    updateCoordenador,
    updateCoordenadorStatus,
    addCoordenador
  }
  export default apiCoordenador;