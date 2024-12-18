import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Layout from './Layout';
import Chat from './Chat';
import Agents from './Agents';
import Agent from './Agent';
import Character from './Character';
import DatingApp from './pages/DatingApp';
import CharacterCreator from './pages/CharacterCreator';
import SkinCreator from './pages/SkinCreator';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/agents',
        element: <Agents />,
      },
      {
        path: '/agent/:id',
        element: <Agent />,
      },
      {
        path: '/character',
        element: <Character />,
      },
      {
        path: '/dating',
        element: <DatingApp />,
      },
      {
        path: '/character-creator',
        element: <CharacterCreator />,
      },
      {
        path: '/skin-creator',
        element: <SkinCreator />,
      },
    ],
  },
]);
