import L from 'leaflet'

// Configuración global de Leaflet
if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl

    // Actualizar las rutas de los iconos para usar CDN
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
    })
}