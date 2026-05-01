import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Users, TrendingUp, Target, Award } from 'lucide-react'

export const ComparativaEquipos = ({ equipos }) => {
  const [metrica, setMetrica] = useState('ventas') // 'ventas', 'ingresos', 'showRate'

  if (!equipos || equipos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparativa por Equipos
        </h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    )
  }

  // Ordenar equipos según métrica seleccionada
  const equiposOrdenados = [...equipos].sort((a, b) => {
    if (metrica === 'ventas') return b.ventasUltimas4Semanas - a.ventasUltimas4Semanas
    if (metrica === 'ingresos') return b.ingresosUltimas4Semanas - a.ingresosUltimas4Semanas
    if (metrica === 'showRate') return b.showRate - a.showRate
    return 0
  })

  // Datos para la gráfica
  const datosGrafica = equiposOrdenados.map(equipo => ({
    equipo: equipo.equipo,
    valor: metrica === 'ventas' 
      ? equipo.ventasUltimas4Semanas 
      : metrica === 'ingresos'
      ? Math.round(equipo.ingresosUltimas4Semanas / 1000) // En miles
      : equipo.showRate
  }))

  // Colores para las barras (mejor a peor)
  const colores = ['#eab308', '#facc15', '#fde047', '#fef08a', '#d4d4d4', '#a3a3a3', '#737373', '#525252']

  // Calcular mejor equipo
  const mejorEquipo = equiposOrdenados[0]
  const promedioGeneral = equipos.reduce((sum, e) => sum + e.ventasUltimas4Semanas, 0) / equipos.length

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-600" />
            Comparativa por Equipos (Últimas 4 Semanas)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Desempeño consolidado por equipo
          </p>
        </div>

        {/* Selector de métrica */}
        <div className="flex gap-2">
          <button
            onClick={() => setMetrica('ventas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              metrica === 'ventas'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ventas
          </button>
          <button
            onClick={() => setMetrica('ingresos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              metrica === 'ingresos'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setMetrica('showRate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              metrica === 'showRate'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Show Rate
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-700" />
            <p className="text-sm text-yellow-700 font-medium">Mejor Equipo</p>
          </div>
          <p className="text-xl font-bold text-yellow-900">{mejorEquipo.equipo}</p>
          <p className="text-sm text-yellow-700 mt-1">
            {mejorEquipo.ventasUltimas4Semanas} ventas
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-700" />
            <p className="text-sm text-blue-700 font-medium">Promedio General</p>
          </div>
          <p className="text-xl font-bold text-blue-900">
            {promedioGeneral.toFixed(1)} ventas
          </p>
          <p className="text-sm text-blue-700 mt-1">Por equipo</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-700" />
            <p className="text-sm text-green-700 font-medium">Total Empresa</p>
          </div>
          <p className="text-xl font-bold text-green-900">
            {equipos.reduce((sum, e) => sum + e.ventasUltimas4Semanas, 0)} ventas
          </p>
          <p className="text-sm text-green-700 mt-1">
            ${(equipos.reduce((sum, e) => sum + e.ingresosUltimas4Semanas, 0) / 1000).toFixed(0)}k
          </p>
        </div>
      </div>

      {/* Gráfica de Barras */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={datosGrafica}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="equipo" 
            stroke="#666"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '12px' }}
            label={{ 
              value: metrica === 'ventas' ? 'Ventas' : metrica === 'ingresos' ? 'Ingresos (miles)' : 'Show Rate %',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value) => {
              if (metrica === 'ingresos') return `$${value}k`
              if (metrica === 'showRate') return `${value.toFixed(1)}%`
              return value
            }}
          />
          <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
            {datosGrafica.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colores[index] || '#d4d4d4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Tabla detallada */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ranking</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Equipo</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ventas</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Show Rate</th>
            </tr>
          </thead>
          <tbody>
            {equiposOrdenados.map((equipo, index) => (
              <tr key={equipo.equipo} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{equipo.equipo}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                  {equipo.ventasUltimas4Semanas}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  ${(equipo.ingresosUltimas4Semanas / 1000).toFixed(1)}k
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    equipo.showRate >= 70 ? 'bg-green-100 text-green-800' :
                    equipo.showRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {equipo.showRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}