import { supabase } from '../lib/supabase'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const dataHubService = {
  async getDataHubSummary() {
    try {
      const { data: organizations, error: orgError } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          logo_url,
          estado,
          areas (
            id,
            name,
            personal (
              id
            )
          ),
          servicios:documents (
            id,
            nombre,
            tipo_servicio
          )
        `)
        .order('name')

      if (orgError) throw orgError

      const processedData = {
        summary: {
          totalEmpresas: organizations?.length || 0,
          totalPersonal: organizations?.reduce((total, org) => 
            total + org.areas?.reduce((areaTotal, area) => 
              areaTotal + (area.personal?.length || 0), 0) || 0, 0),
          promedioActividad: organizations?.reduce((total, org) => 
            total + (org.servicios?.length || 0), 0) || 0,
          totalIngresos: "$573.3K"
        },
        organizations: organizations?.map(org => ({
          id: org.id,
          nombre: org.name,
          logo: org.logo_url,
          estado: org.estado,
          personal: {
            total: org.areas?.reduce((total, area) => 
              total + (area.personal?.length || 0), 0) || 0,
            label: 'empleados'
          },
          areas: {
            total: org.areas?.length || 0,
            label: 'áreas'
          },
          actividad: {
            total: org.servicios?.length || 0,
            label: org.servicios?.length === 1 ? 'servicio' : 'servicios'
          }
        })) || []
      }

      return processedData
    } catch (error) {
      console.error('Error obteniendo resumen:', error)
      throw error
    }
  },

  // Exportar datos
  async exportEnterpriseData(format = 'json') {
    try {
      const data = await this.getDataHubSummary()
      
      const exportData = {
        resumen: {
          totalEmpresas: data.summary.totalEmpresas,
          totalPersonal: data.summary.totalPersonal,
          promedioActividad: data.summary.promedioActividad,
          totalIngresos: data.summary.totalIngresos
        },
        empresas: data.organizations.map(org => ({
          id: org.id,
          nombre: org.nombre,
          estado: org.estado,
          personal: org.personal.total,
          areas: org.areas.total,
          actividad: org.actividad.total
        }))
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        saveAs(blob, 'marpesca_data.json')
      } else if (format === 'excel') {
        const wb = XLSX.utils.book_new()
        
        // Hoja de resumen
        const resumenWS = XLSX.utils.json_to_sheet([exportData.resumen])
        XLSX.utils.book_append_sheet(wb, resumenWS, 'Resumen')
        
        // Hoja de empresas
        const empresasWS = XLSX.utils.json_to_sheet(exportData.empresas)
        XLSX.utils.book_append_sheet(wb, empresasWS, 'Empresas')
        
        XLSX.writeFile(wb, 'marpesca_data.xlsx')
      } else if (format === 'csv') {
        // Para CSV, usamos XLSX para convertir a CSV
        const ws = XLSX.utils.json_to_sheet(exportData.empresas)
        const csv = XLSX.utils.sheet_to_csv(ws)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        saveAs(blob, 'marpesca_empresas.csv')
      }

      return exportData
    } catch (error) {
      console.error('Error en exportación:', error)
      throw new Error('Error al exportar los datos: ' + error.message)
    }
  },

  // Importar datos externos (mantenemos la funcionalidad por si se necesita después)
  async importExternalData() {
    try {
      const externalSources = [
        {
          name: 'Usuarios de Prueba',
          url: 'https://jsonplaceholder.typicode.com/users',
          type: 'REST'
        },
        {
          name: 'Datos de Usuario Aleatorio',
          url: 'https://randomuser.me/api/?results=5',
          type: 'REST'
        }
      ]

      const importedData = await Promise.all(
        externalSources.map(async (source) => {
          try {
            console.log(`Obteniendo datos de ${source.name}...`)
            const response = await axios.get(source.url)
            const data = response.data

            const { error } = await supabase
              .from('external_data_sources')
              .upsert({
                source_name: source.name,
                data: data,
                last_updated: new Date()
              })

            if (error) throw error

            return {
              source: source.name,
              status: 'éxito',
              data: data
            }
          } catch (error) {
            console.error(`Error con ${source.name}:`, error)
            return {
              source: source.name,
              status: 'error',
              error: error.message
            }
          }
        })
      )

      return importedData
    } catch (error) {
      console.error('Error en importación:', error)
      throw error
    }
  }
} 