import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL

const getProfessores = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}professor/get-professores`);
      return response.data
    } catch (error) {
      console.error('Erro ao obter professores:', error);
    }
  };
  
const getProfessor = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}professor/get-professor/${id}`);
      return response.data
    } catch (error) {
      console.log('Erro ao obter o registro de professor ',error)
    }
  };
  

  const addProfessores = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}professor/create-professor`, data);
      console.log('Professor adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar professor:', error);
    }
  };

  const updateProfessores = async(id,dadosAtualizados) => {
    try{
        const response = await axios.put(`${apiUrl}professor/${id}`, dadosAtualizados);
    }catch(error){
        console.error('Erro ao atualizar professor:', error);
    }
  }
  
  const updateProfessorStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${apiUrl}professor/atualizarstatus/${id}`, { status: status }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Erro ao atualizar status do professor:', error);
        throw error;
    }
};


  const apiProfessores = {
    getProfessores,
    getProfessor,
    addProfessores,
    updateProfessores,
    updateProfessorStatus,
  }
  export default apiProfessores;