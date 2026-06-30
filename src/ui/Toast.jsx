import { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const ToastContext = createContext();

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: 400px;
  width: calc(100% - 48px);
  
  @media (max-width: 480px) {
    top: 16px;
    right: 16px;
    left: 16px;
    width: calc(100% - 32px);
  }
`;

const ToastMessage = styled.div`
  pointer-events: auto;
  background: var(--panel-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  padding: 14px 20px;
  border-radius: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${slideIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  word-break: break-word;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const Icon = styled.span`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageContent = styled.div`
  flex-grow: 1;
  font-weight: 500;
  line-height: 1.4;
  white-space: pre-line;
`;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg) => showToast(msg, 'info'), [showToast]);

  const value = { success, error, info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} style={{
            borderLeft: toast.type === 'success' ? '5px solid var(--primary-color)' : 
                        toast.type === 'error' ? '5px solid #ff6b8b' : 
                        '5px solid var(--secondary-color)'
          }}>
            <Icon>
              {toast.type === 'success' ? '🌸' : toast.type === 'error' ? '💖' : '✨'}
            </Icon>
            <MessageContent>{toast.message}</MessageContent>
          </ToastMessage>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
