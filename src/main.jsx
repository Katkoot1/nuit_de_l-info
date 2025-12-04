import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Error Boundary pour capturer les erreurs
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur React:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
          <h1>Erreur dans l'application</h1>
          <pre style={{ color: 'red', marginTop: '20px' }}>
            {this.state.error?.toString()}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById('root');

if (!root) {
  console.error('Element root non trouvé !');
} else {
  console.log('Element root trouvé, rendu de l\'application...');
  
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('Application rendue avec succès');
  } catch (error) {
    console.error('Erreur lors du rendu:', error);
    root.innerHTML = `
      <div style="padding: 20px; color: red; background: #1e293b; min-height: 100vh;">
        <h1>Erreur lors du rendu</h1>
        <pre>${error.toString()}</pre>
        <pre>${error.stack}</pre>
      </div>
    `;
  }
}

