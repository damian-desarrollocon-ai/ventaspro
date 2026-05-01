import React from 'react'
import { UserPlus, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const VendedoresNuevos = ({ vendedores }) => {
  if (!vendedores || vendedores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendedores Nuevos (Últimos 3 Meses)
        </h3>
        <p className="text-gray-500 text-center py-8">
          No hay vendedores nuevos en los últimos 3 meses
        </p>
      </div>
    )
  }

  const totalVentas = vendedores.reduce((sum, v) => sum + v.totalVentas, 0)
  const totalIngresos = vendedores.reduce((sum, v) => sum + v.totalIngresos, 0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header con KPIs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-yellow-600" />
          Vendedores Nuevos (Últimos 3 Meses)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <p className="text-sm text-yellow-700 font-medium">Total Nuevos</p>
            <p className="text-2xl font-bold text-yellow-900">{vendedores.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">Ventas Generadas</p>
            <p className="text-2xl font-bold text-green-900">{totalVentas}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Ingresos</p>
            <p className="text-2xl font-bold text-blue-900">
              ${(totalIngresos / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>

      {/* Lista de vendedores */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {vendedores.map((vendedor, index) => (
          <div 
            key={vendedor.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                {vendedor.usuarios?.nombre_completo?.charAt(0) || '?'}
              </div>
              
              {/* Info */}
              <div>
                <p className="font-semibold text-gray-900">
                  {vendedor.usuarios?.nombre_completo || 'Sin nombre'}
                </p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded">
                    {vendedor.codigo_vendedor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {vendedor.diasActivo} días
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="text-lg font-bold text-yellow-600">
                {vendedor.totalVentas} ventas
              </p>
              <p className="text-sm text-gray-600">
                ${(vendedor.totalIngresos / 1000).toFixed(1)}k generados
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}