"use client";

import { createSuperAdmin } from './createSuperAdmin';
import { toast } from 'react-hot-toast';

export default function InitSuperAdmin() {
  const handleInit = async () => {
    try {
      await createSuperAdmin();
      toast.success("SuperAdmin creado exitosamente");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.info("SuperAdmin ya existe");
      } else {
        console.error("Error creando SuperAdmin:", error);
        toast.error("Error al crear SuperAdmin");
      }
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleInit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Inicializar SuperAdmin
      </button>
    </div>
  );
} 