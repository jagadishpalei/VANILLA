import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOwner } from '../../context/OwnerContext';

const ALLOWED_ROLES = ['owner', 'super_admin', 'franchise_controller'];

export default function OwnerRoute({ children }) {
  const { ownerUser } = useOwner();

  if (!ownerUser || !ALLOWED_ROLES.includes(ownerUser.role)) {
    return <Navigate to="/owner-login" replace />;
  }

  return children;
}
