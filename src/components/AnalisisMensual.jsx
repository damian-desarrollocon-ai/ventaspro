import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Award, AlertTriangle, DollarSign } from 'lucide-react'

export const AnalisisMensual = ({ datosMensuales }) => {
  const { resumenMeses, comparativaMesActual, tendenciaAnual, mejorMes, peorMes } = datosMensuales

  if (!resumenMeses || resumenMeses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análisis Mensual
        </h3>
        <p className="text-gray-500 text-center py-8">No hay datos mensuales disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con Tendencia Anual */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-yellow-600" />
              Análisis Mensual
            </h2>
            <p className="text-sm text-gray-500 mt-1">Últimos 12 meses</p>
          </div>

          {/* Badge de tendencia anual */}
          {tendenciaAnual && (
            <div className={`px-6 py-3 rounded-lg ${
              tendenciaAnual.tendencia === 'alcista' ? 'bg-green-50' :
              tendenciaAnual.tendencia === 'bajista' ? 'bg-red-50' :
              'bg-yellow-50'
            }`}>
              <div className="flex items-center gap-2">
                {tendenciaAnual.tendencia === 'alcista' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : tendenciaAnual.tendencia === 'bajista' ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    tendenciaAnual.tendencia === 'alcista' ? 'text-green-700' :
                    tendenciaAnual.tendencia === 'bajista' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    Tendencia Anual
                  </p>
                  <p className={`text-2xl font-bold ${
                    tendenciaAnual.tendencia === 'alcista' ? 'text-green-900' :
                    tendenciaAnual.tendencia === 'bajista' ? 'text-red-900' :
                    'text-yellow-900'
                  }`}>
                    {tendenciaAnual.porcentaje > 0 ? '+' : ''}{tendenciaAnual.porcentaje}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mejor Mes */}
          {mejorMes && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-700" />
                <p className="text-sm text-green-700 font-medium">Mejor Mes</p>
              </div>
              <p className="text-xl font-bold text-green-900">{mejorMes.label}</p>
              <p className="text-sm text-green-700 mt-1">
                {mejorMes.ventas} ventas | ${(mejorMes.ingresos / 1000).toFixed(0)}k
              </p>
            </div>
          )}

          {/* Peor Mes */}
          {peorMes && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                <p className="text-sm text-red-700 font-medium">Mes Más Bajo</p>
              </div>
              <p className="text-xl font-bold text-red-900">{peorMes.label}</p>
              <p className="text-sm text-red-700 mt-1">
                {peorMes.ventas} ventas | ${(peorMes.ingresos / 1000).toFixed(0)}k
              </p>
            </div>
          )}

          {/* Promedio Mensual */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-700" />
              <p className="text-sm text-blue-700 font-medium">Promedio Mensual</p>
            </div>
            <p className="text-xl font-bold text-blue-900">
              {Math.round(resumenMeses.reduce((sum, m) => sum + m.ventas, 0) / resumenMeses.length)} ventas
            </p>
            <p className="text-sm text-blue-700 mt-1">
              ${Math.round(resumenMeses.reduce((sum, m) => sum + m.ingresos, 0) / resumenMeses.length / 1000)}k
            </p>
          </div>
        </div>
      </div>

      {/* Comparativa Mes Actual vs Anterior */}
      {comparativaMesActual && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa: {comparativaMesActual.mesActual} vs {comparativaMesActual.mesAnterior}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ventas */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Ventas</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {comparativaMesActual.ventas.actual}
                </p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  comparativaMesActual.ventas.aumento ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparativaMesActual.ventas.aumento ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {comparativaMesActual.ventas.cambio > 0 ? '+' : ''}{comparativaMesActual.ventas.cambio}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs {comparativaMesActual.ventas.anterior} mes anterior
              </p>
            </div>

            {/* Ingresos */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Ingresos</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  ${(comparativaMesActual.ingresos.actual / 1000).toFixed(0)}k
                </p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  comparativaMesActual.ingresos.aumento ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparativaMesActual.ingresos.aumento ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {comparativaMesActual.ingresos.cambio > 0 ? '+' : ''}{comparativaMesActual.ingresos.cambio}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs ${(comparativaMesActual.ingresos.anterior / 1000).toFixed(0)}k mes anterior
              </p>
            </div>

            {/* Encuestas */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Encuestas</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {comparativaMesActual.encuestas.actual}
                </p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  comparativaMesActual.encuestas.aumento ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparativaMesActual.encuestas.aumento ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {comparativaMesActual.encuestas.cambio > 0 ? '+' : ''}{comparativaMesActual.encuestas.cambio}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs {comparativaMesActual.encuestas.anterior} mes anterior
              </p>
            </div>

            {/* Show Rate */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Show Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {comparativaMesActual.showRate.actual}%
                </p>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  comparativaMesActual.showRate.aumento ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparativaMesActual.showRate.aumento ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {comparativaMesActual.showRate.cambio > 0 ? '+' : ''}{comparativaMesActual.showRate.cambio}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                vs {comparativaMesActual.showRate.anterior}% mes anterior
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfica de Ventas Mensuales */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Evolución de Ventas por Mes
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={resumenMeses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              stroke="#666"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: '12px' }}
              label={{ value: 'Ventas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="ventas" fill="#eab308" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Ingresos Mensuales */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Evolución de Ingresos por Mes
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={resumenMeses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              stroke="#666"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#666"
              style={{ fontSize: '12px' }}
              label={{ value: 'Ingresos ($)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ingresos" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
              name="Ingresos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla Detallada */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detalle Mensual
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mes</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ventas</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ticket Prom.</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Show Rate</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Conversión</th>
              </tr>
            </thead>
            <tbody>
              {resumenMeses.slice().reverse().map((mes, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{mes.label}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    {mes.ventas}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    ${mes.ingresos.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    ${mes.ticketPromedio.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      mes.showRate >= 70 ? 'bg-green-100 text-green-800' :
                      mes.showRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mes.showRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      mes.conversion >= 25 ? 'bg-green-100 text-green-800' :
                      mes.conversion >= 15 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mes.conversion}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}