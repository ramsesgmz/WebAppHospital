'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Assignment {
  id: number;
  description: string;
  area: string;
  date: string;
  dueDate: string;
  status: 'Pendiente' | 'En Proceso' | 'Finalizada';
  photos: string[];
}

export default function UserPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Cargar asignaciones del localStorage
    const storedAssignments = localStorage.getItem('userAssignments');
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    } else {
      // Datos de ejemplo
      const exampleAssignments = [
        {
          id: 1,
          description: "Limpieza de área de emergencias",
          area: "Emergencias",
          date: "2024-03-20",
          dueDate: "2024-03-21",
          status: "Pendiente",
          photos: []
        },
        {
          id: 2,
          description: "Mantenimiento de equipos",
          area: "UCI",
          date: "2024-03-20",
          dueDate: "2024-03-22",
          status: "Pendiente",
          photos: []
        }
      ];
      setAssignments(exampleAssignments);
      localStorage.setItem('userAssignments', JSON.stringify(exampleAssignments));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar archivos
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      if (!isValid) {
        toast.error(`${file.name} no es válido. Use imágenes de hasta 5MB`);
      }
      return isValid;
    });

    setSelectedFiles(validFiles);
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleStartAssignment = (id: number) => {
    const updatedAssignments = assignments.map(assignment =>
      assignment.id === id ? { ...assignment, status: 'En Proceso' } : assignment
    );
    setAssignments(updatedAssignments);
    localStorage.setItem('userAssignments', JSON.stringify(updatedAssignments));
    toast.success('Tarea iniciada');
  };

  const handleFinishAssignment = (id: number) => {
    if (selectedFiles.length === 0) {
      toast.error('Debes subir al menos una foto para finalizar');
      return;
    }

    const updatedAssignments = assignments.map(assignment =>
      assignment.id === id 
        ? { ...assignment, status: 'Finalizada', photos: [...previewUrls] }
        : assignment
    );
    
    setAssignments(updatedAssignments);
    localStorage.setItem('userAssignments', JSON.stringify(updatedAssignments));
    setSelectedFiles([]);
    setPreviewUrls([]);
    toast.success('Tarea finalizada exitosamente');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mis Asignaciones
      </h1>

      <div className="grid gap-6">
        {assignments.map(assignment => (
          <div 
            key={assignment.id}
            className={`
              bg-white rounded-xl shadow-md p-6
              ${assignment.status === 'Pendiente' ? 'border-l-4 border-gray-400' :
                assignment.status === 'En Proceso' ? 'border-l-4 border-blue-500' :
                'border-l-4 border-green-500'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{assignment.description}</h3>
                <p className="text-sm text-gray-600">Área: {assignment.area}</p>
                <p className="text-sm text-gray-600">
                  Fecha límite: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${assignment.status === 'Pendiente' ? 'bg-gray-100 text-gray-700' :
                  assignment.status === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'}
              `}>
                {assignment.status}
              </span>
            </div>

            {assignment.status === 'En Proceso' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id={`photos-${assignment.id}`}
                  />
                  <label
                    htmlFor={`photos-${assignment.id}`}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-100"
                  >
                    Subir Fotos
                  </label>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.length} archivos seleccionados
                  </span>
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-4">
              {assignment.status === 'Pendiente' && (
                <button
                  onClick={() => handleStartAssignment(assignment.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Iniciar
                </button>
              )}
              {assignment.status === 'En Proceso' && (
                <button
                  onClick={() => handleFinishAssignment(assignment.id)}
                  disabled={selectedFiles.length === 0}
                  className={`px-4 py-2 rounded-lg
                    ${selectedFiles.length > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
