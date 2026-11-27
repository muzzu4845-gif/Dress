import React from 'react';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import '../styles/Modals.css';

const Toast = () => {
  const { toast } = useShop();

  if (!toast.visible) return null;

  return (
    <div className={`toast-notification ${toast.type}`}>
      <div className="toast-icon">
        {toast.type === 'info' ? <FiInfo size={20} /> : <FiCheckCircle size={20} />}
      </div>
      <div className="toast-message">
        {toast.message}
      </div>
    </div>
  );
};

export default Toast;
