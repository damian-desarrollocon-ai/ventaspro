import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { User, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export const CrecimientoIndividual = ({ vendedores }) => {
  const [mostrarTodos, setMostrarTodos] = useState(false)

  if (!vendedores || vendedores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Crecimiento Individual
        </h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    )
  }

  // Calcular tendencia de cada vendedor (comparar semana 1 vs semana 4)
  const vendedoresConTendencia = vendedores.map(v => {
    const primerasSemanas = (v.semanas[0] + v.semanas[1]) / 2 || 1
    const ultimasSemanas = (v.semanas[2] + v.semanas[3]) / 2 || 0
    const crecimiento = ((ultimasSemanas - primerasSemanas) / primerasSemanas * 100)
    
    return {
      ...v,
      crecimiento: isFinite(crecimiento) ? crecimiento : 0,
      tendencia: crecimiento > 5 ? 'up' : crecimiento < -5 ? 'down' : 'stable'
    }
  })

  // Filtrar top 10 o todos
  const vendedoresMostrar = mostrarTodos 
    ? vendedoresConTendencia 
    : vendedoresConTendencia.slice(0, 10)

  // Calcular estadísticas
  const enCrecimiento = vendedoresConTendencia.filter(v => v.tendencia === 'up').length
  const enDecrecimiento = vendedoresConTendencia.filter(v => v.tendencia === 'down').length
  const estables = vendedoresConTendencia.filter(v => v.tendencia === 'stable').length

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-600" />
            Crecimiento Individual (Últimas 4 Semanas)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Evolución del desempeño por vendedor
          </p>
        </div>

        <button
          onClick={() => setMostrarTodos(!mostrarTodos)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          {mostrarTodos ? 'Ver Top 10' : 'Ver Todos'}
        </button>
      </div>

      {/* Estadísticas de tendencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-700" />
            <p className="text-sm text-green-700 font-medium">En Crecimiento</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{enCrecimiento}</p>
          <p className="text-sm text-green-700 mt-1">vendedores</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-4 h-4 text-yellow-700" />
            <p className="text-sm text-yellow-700 font-medium">Estables</p>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{estables}</p>
          <p className="text-sm text-yellow-700 mt-1">vendedores</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-700" />
            <p className="text-sm text-red-700 font-medium">En Decrecimiento</p>
          </div>
          <p className="text-2xl font-bold text-red-900">{enDecrecimiento}</p>
          <p className="text-sm text-red-700 mt-1">vendedores</p>
        </div>
      </div>

      {/* Tabla con mini gráficas */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {vendedoresMostrar.map((vendedor, index) => (
          <div 
            key={vendedor.codigo}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              {/* Info del vendedor */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {vendedor.vendedor.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vendedor.vendedor}</p>
                  <p className="text-sm text-gray-500">{vendedor.codigo}</p>
                </div>
              </div>

              {/* Indicador de tendencia */}
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-900">
                  {vendedor.totalVentas} ventas
                </span>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  vendedor.tendencia === 'up' ? 'bg-green-100 text-green-700' :
                  vendedor.tendencia === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {vendedor.tendencia === 'up' && <TrendingUp className="w-4 h-4" />}
                  {vendedor.tendencia === 'down' && <TrendingDown className="w-4 h-4" />}
                  {vendedor.tendencia === 'stable' && <Minus className="w-4 h-4" />}
                  <span>
                    {vendedor.crecimiento > 0 ? '+' : ''}{vendedor.crecimiento.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Mini gráfica de 4 semanas */}
            <div className="flex gap-2 h-16">
              {vendedor.semanas.map((ventas, semanaIndex) => {
                const maxVentas = Math.max(...vendedor.semanas, 1)
                const altura = (ventas / maxVentas) * 100
                
                return (
                  <div key={semanaIndex} className="flex-1 flex flex-col justify-end">
                    <div 
                      className={`rounded-t transition-all ${
                        semanaIndex === 3 ? 'bg-yellow-500' :
                        semanaIndex === 2 ? 'bg-yellow-400' :
                        semanaIndex === 1 ? 'bg-yellow-300' :
                        'bg-yellow-200'
                      }`}
                      style={{ height: `${altura}%` }}
                      title={`Semana ${semanaIndex + 1}: ${ventas} ventas`}
                    >
                      <div className="h-full flex items-end justify-center pb-1">
                        <span className="text-xs font-bold text-gray-700">{ventas}</span>
                      </div>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-xs text-gray-500">S{semanaIndex + 1}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}