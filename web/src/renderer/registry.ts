import type { ComponentType } from 'react'
import { Stack } from '../components/layout/Stack'
import { Grid } from '../components/layout/Grid'
import { MetricCard } from '../components/MetricCard'
import { Sidebar } from '../components/Sidebar'
import { StatusBadge } from '../components/StatusBadge'

export type ComponentRegistry = Record<string, ComponentType<any>>

export const registry: ComponentRegistry = {
  Stack,
  Grid,
  MetricCard,
  Sidebar,
  StatusBadge,
}
