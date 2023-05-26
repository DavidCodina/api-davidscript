import { sum } from './index'
// None of the functions below need to be imported if you
// set up the vite.config.ts + tsconfig.json for globals.
import { describe, expect, test, it } from 'vitest'

describe('The sum() function...', () => {
  test('should return 0 with no numbers', () => {
    const value = sum()
    expect(value).toBe(0)
  })

  it('should return same number when only one arg', () => {
    const value = sum(5)
    expect(value).toBe(5)
  })

  test('should return correct sum with multiple args', () => {
    const value = sum(1, 2, 3)
    expect(value).toBe(6)
  })
})
