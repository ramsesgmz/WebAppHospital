'use client';
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { toast } from 'react-toastify';

function InventoryTable({ readOnly, showStockLevels, showHistory, showCriticalItems }) {
  const { user } = useAuth();
  const { permissions } = usePermissions(user);

  useEffect(() => {
    console.log('InventoryTable montado');
    console.log('readOnly:', readOnly);
    console.log('Usuario:', user);
    console.log('Permisos:', permissions);
  }, [readOnly, user, permissions]);

  // Verificar permisos específicos del inventario
  const canEdit = permissions?.inventory?.edit || false;
  const canUse = permissions?.inventory?.use || false;
  const canAdd = permissions?.inventory?.add || false;
  const canDelete = permissions?.inventory?.delete || false;

  // Mock data para pruebas
  const items = [
    { id: 1, name: 'Item 1', stock: 10, status: 'Disponible' },
    { id: 2, name: 'Item 2', stock: 5, status: 'Bajo' },
  ];

  const handleUseItem = (item) => {
    if (!canUse) {
      toast.error('No tienes permisos para usar items del inventario');
      return;
    }
    // Lógica de uso...
  };

  const handleEditItem = (item) => {
    if (!canEdit) {
      toast.error('No tienes permisos para editar el inventario');
      return;
    }
    // Lógica de edición...
  };

  const handleDeleteItem = (item) => {
    if (!canDelete) {
      toast.error('No tienes permisos para eliminar items del inventario');
      return;
    }
    // Lógica de eliminación...
  };

  return (
    <div className="inventory-table">
      <div className="inventory-header">
        <img 
          src="/images/marpes.jpeg" 
          alt="Logo Marpes" 
          className="company-logo"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
              <td>{item.status}</td>
              <td>
                {canUse && (
                  <button 
                    onClick={() => handleUseItem(item)}
                    disabled={!canUse}>
                    Usar
                  </button>
                )}
                {canEdit && (
                  <button 
                    onClick={() => handleEditItem(item)}
                    disabled={!canEdit}>
                    Editar
                  </button>
                )}
                {canDelete && (
                  <button 
                    onClick={() => handleDeleteItem(item)}
                    disabled={!canDelete}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable; 