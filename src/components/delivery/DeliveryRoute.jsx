import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDelivery } from '../../context/DeliveryContext';

export default function DeliveryRoute({ children }) {
  const { rider } = useDelivery();
  if (!rider) return <Navigate to="/delivery-login" replace />;
  return children;
}
