import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo_git.svg';

import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FunctionComponent = () =>{
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    )
    if(storagedRepositories){
      return JSON.parse(storagedRepositories);
    }else{
      return [];
    }
  });
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories)
      );
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
    // Adição de um novo repository
    // Consumir API do github
    // Salvar novo repositório no estado

    event.preventDefault(); // não deixa o form ter o comportamento padrão de recarregar a página quando da submit

    if(!newRepo){
      //input vazio
      setInputError('Digite um repositório válido | autor/nome');
      return;
    }

    try {

      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo(''); //limpa o input
      setInputError('');

    } catch (error) {

      setInputError('Ops! Algo de errado aconteceu durante a busca!');

    }
  }


  return (
    <>

    <Title>Explore Repositórios no GitHub</Title>

    <Form hasError={!!inputError} onSubmit={handleAddRepository}>
      <input
      placeholder='Digite aqui'
      value={newRepo}
      onChange={event => setNewRepo(event.target.value)}
      />
      <button type='submit'>Pesquisar</button>
    </Form>

    {inputError && <Error>{inputError}</Error>}

    <Repositories>
      {repositories.map(repository => (
        <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
        <div>
          <strong>{repository.full_name}</strong>
          <p>{repository.description}</p>
        </div>
        <FiChevronRight size={30} />
      </Link>
      ))}
    </Repositories>
    </>
  );
}

export default Dashboard;
