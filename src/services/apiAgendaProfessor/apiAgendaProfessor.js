import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL

const getAgendaProfessores = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}agendaprofessor/`);
      return response.data
    } catch (error) {
      console.error('Erro ao obter a agendas dos professores:', error);
    }
  };
  
const getAgendaProfessor = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}agendaprofessor/${id}`);
      return response.data
    } catch (error) {
      console.log('Erro ao obter o registro de agenda de professores ',error)
    }
  };
  

  const addAgendaProfessor = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}agendaprofessor/`, data);
        console.log('agenda do professor adicionada com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao adicionar a agenda do professor:', error);
    }
};


  const excludeAgendaProfessor = async(id) => { 
    try{
        const response = await axios.delete(`${apiUrl}agendaprofessor/${id}`);
        console.log('a agenda do professor foi excluída com sucesso:', response.data);
    }catch(erro){
        console.error('erro ao excluir a agenda do professsor',erro)
    }
  }

  const updateAgendaProfessor = async(id,dadosAtualizados) => {
    try{
        const response = await axios.put(`${apiUrl}agendaprofessor/${id}`, dadosAtualizados);
    }catch(error){
        console.error('Erro ao atualizar a agenda do professor:', error);
    }
  }

  const apiAgendaProfessor = {
    getAgendaProfessores,
    getAgendaProfessor,
    excludeAgendaProfessor,
    updateAgendaProfessor,
    addAgendaProfessor
  }
  export default apiAgendaProfessor;