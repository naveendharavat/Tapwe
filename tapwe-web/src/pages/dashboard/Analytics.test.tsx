import { screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { api } from '../../services/api'
import { renderApp } from '../../test/render'
import Analytics from './Analytics'

const week = (counts: number[]) => ({
  perDay: counts.map((count, i) => ({ date: `2026-10-${String(17 + i).padStart(2, '0')}`, count })),
  totals: { cards: 3, active: 2, drafts: 1, taps: counts.reduce((a, b) => a + b, 0) },
})

describe('Analytics page', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('draws seven flat bars without NaN heights when there are no taps', async () => {
    mock.onGet('/analytics/summary').reply(200, week([0, 0, 0, 0, 0, 0, 0]))
    renderApp(<Analytics />)
    const bars = await screen.findAllByTestId('bar')
    expect(bars).toHaveLength(7)
    bars.forEach((bar) => expect(bar.style.height).toBe('0%'))
  })

  it('scales bars to the busiest day and labels weekdays', async () => {
    mock.onGet('/analytics/summary').reply(200, week([12, 18, 9, 24, 30, 38, 21]))
    renderApp(<Analytics />)
    const bars = await screen.findAllByTestId('bar')
    expect(bars[5].style.height).toBe('100%')
    // 2026-10-17 is a Saturday.
    expect(screen.getByText('Sat')).toBeInTheDocument()
    expect(screen.getByText('152 opens in the last 7 days')).toBeInTheDocument()
  })
})
