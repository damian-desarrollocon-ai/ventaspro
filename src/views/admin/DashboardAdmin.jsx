import React from 'react'
import { useAnalisisAvanzado } from '../../hooks/useAnalisisAvanzado'
import { useAnalisisMensual } from '../../hooks/useAnalisisMensual'
import { GraficaTendencias } from '../../components/GraficaTendencias'
import { VendedoresNuevos } from '../../components/VendedoresNuevos'
import { ComparativaEquipos } from '../../components/ComparativaEquipos'
import { CrecimientoIndividual } from '../../components/CrecimientoIndividual'
import { AnalisisMensual } from '../../components/AnalisisMensual'
import { Loader, BarChart3 } from 'lucide-react'

export const DashboardAdmin = () => {
  const { datos, loading: loadingAvanzado } = useAnalisisAvanzado()
  const { datosMensuales, loading: loadingMensual } = useAnalisisMensual()

  if (loadingAvanzado || loadingMensual) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando análisis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
          <p className="text-sm text-gray-500">
            Análisis completo del desempeño de ventas
          </p>
        </div>
      </div>

      {/* NUEVO: Análisis Mensual */}
      <AnalisisMensual datosMensuales={datosMensuales} />

      {/* Gráfica de Tendencias Semanales */}
      <GraficaTendencias datos={datos.tendencias} />

      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendedoresNuevos vendedores={datos.vendedoresNuevos} />
        <ComparativaEquipos equipos={datos.comparativaEquipos} />
      </div>

      {/* Crecimiento Individual */}
      <CrecimientoIndividual vendedores={datos.crecimientoIndividual} />
    </div>
  )
}