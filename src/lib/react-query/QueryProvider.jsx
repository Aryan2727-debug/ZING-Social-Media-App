import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropTypes from 'prop-types';

export const QueryProvider = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

QueryProvider.propTypes = {
  children: PropTypes.node.isRequired
};
