import axios from "axios";


const apiUrl = process.env.REACT_APP_API_URL

const getDiaExcecoes = async () => {
    
    try {
      const response = await axios.get(`${apiUrl}dia-excecao/get-dias-excecao`);
      return response.data
    
    } catch (error) {
      console.error('erro ao obter:', error);
    }
  };
  const getDiaExcecao = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}dia-excecao/get-dia-excecao/${id}`);
      return response.data
    } catch (error) {
      console.log('Erro ao obter o registro de dia de excecao: ',error)
    }
  };
  
  const addDiaExcecao = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}dia-excecao/create-dia-excecao`,data);
      console.log('dia de excecao adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar diaexcecao:', error);
    }
  };

  const updateDiaExcecao = async(id,dadosAtualizados) => {
    try{
        const response = await axios.put(`${apiUrl}dia-excecao/update-dia-excecao/${id}`, dadosAtualizados);
    }catch(error){
        console.error('Erro ao atualizar dia de excecao:', error);
    }
  }

  const excludeDiaExcecao = async(id) => { 
    try{
        const response = await axios.delete(`${apiUrl}dia-excecao/delete-dia-excecao/${id}`);
        console.log('dia de excecao excluído com sucesso:', response.data);
    }catch(erro){
        console.error('erro ao excluir diaexcecao',erro)
    }
  }
  
const apiDiaExcecao = {
    getDiaExcecoes,
    getDiaExcecao,
    addDiaExcecao,
    excludeDiaExcecao,
    updateDiaExcecao
}

export default apiDiaExcecao