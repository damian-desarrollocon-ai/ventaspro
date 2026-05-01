import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const GraficaTendencias = ({ datos, tipo = 'ventas' }) => {
  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No hay datos disponibles</p>
      </div>
    )
  }

  // Calcular crecimiento
  const primerValor = datos[0]?.ventas || 0
  const ultimoValor = datos[datos.length - 1]?.ventas || 0
  const crecimiento = primerValor > 0 ? ((ultimoValor - primerValor) / primerValor * 100).toFixed(1) : 0
  const esPositivo = crecimiento >= 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tendencia de Ventas (Últimas 8 Semanas)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Evolución semanal del desempeño
          </p>
        </div>
        
        {/* Badge de crecimiento */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          esPositivo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {esPositivo ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
          <span className="font-bold text-lg">
            {esPositivo ? '+' : ''}{crecimiento}%
          </span>
        </div>
      </div>

      {/* Gráfica */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="semana" 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ventas" 
            stroke="#eab308" 
            strokeWidth={3}
            dot={{ fill: '#eab308', r: 5 }}
            activeDot={{ r: 7 }}
            name="Ventas"
          />
          <Line 
            type="monotone" 
            dataKey="citas" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Citas Realizadas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}