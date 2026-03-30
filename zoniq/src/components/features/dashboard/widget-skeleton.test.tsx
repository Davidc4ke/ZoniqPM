import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WidgetSkeleton } from './widget-skeleton'

describe('WidgetSkeleton', () => {
  it('renders the specified number of skeleton rows', () => {
    render(<WidgetSkeleton rows={4} />)
    const rows = screen.getAllByTestId('skeleton-row')
    expect(rows).toHaveLength(4)
  })

  it('defaults to 3 rows', () => {
    render(<WidgetSkeleton />)
    const rows = screen.getAllByTestId('skeleton-row')
    expect(rows).toHaveLength(3)
  })
})
