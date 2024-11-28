'use client';
import React from 'react';
import InventoryTable from './InventoryTable';
import Button from '../Button';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { COMPANY_LOGO } from '../../config/brandConfig';

function InventoryView({ userProfile }) {
  const { user } = useAuth();
  const { permissions } = usePermissions(user);

  // Verificar si el usuario tiene perfil enterprise
  const isEnterprise = userProfile === 'enterprise';

  return (
    <div className="inventory-container">
      <InventoryTable 
        readOnly={isEnterprise}
        showStockLevels={true}
        showHistory={true}
        showCriticalItems={true}
      />
      
      <div className="inventory-actions">
        <Button 
          onClick={handleExport}
          disabled={false}>
          Exportar Reporte
        </Button>
        
        {/* Ocultar botones de edición para enterprise */}
        {!isEnterprise && (
          <>
            <Button onClick={handleEdit}>Editar</Button>
            <Button onClick={handleAdd}>Agregar Item</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default InventoryView; 