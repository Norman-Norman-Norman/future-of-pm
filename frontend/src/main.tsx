import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import './index.css'
import App from './App.tsx'
import { frontendLogger } from './logger'

frontendLogger.info('APP', 'OctoCAT Supply frontend initializing', {
  environment: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        frontendLogger.error('REACT_QUERY', 'Query error', error);
      },
    },
    mutations: {
      onError: (error) => {
        frontendLogger.error('REACT_QUERY', 'Mutation error', error);
      },
    },
  },
})

frontendLogger.info('APP', 'React Query client created');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

frontendLogger.info('APP', 'React app rendered to DOM');
