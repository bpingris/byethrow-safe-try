import { describe, it, expect, mock } from 'bun:test'
import { R } from '@praha/byethrow'
import { safeTry } from '../src'

describe('safeTry', () => {
  it('should return `succeed` value', () => {
    const value = safeTry(function*(_) {
      return R.succeed(1)
    })
    expect(R.isSuccess(value)).toBeTrue()
    expect(R.unwrap(value)).toEqual(1)
  })

  it('should return `failure` value', () => {
    const value = safeTry(function*(_) {
      return R.fail('error' as const)
    })
    expect(R.isFailure(value)).toBeTrue()
    expect(R.unwrapError(value)).toEqual('error')
  })

  it('should return `succeed` value in async function', async () => {
    const value = await safeTry(async function*(_) {
      return R.succeed(1)
    })
    expect(R.isSuccess(value)).toBeTrue()
    expect(R.unwrap(value)).toEqual(1)
  })

  it('should return `failure` value in async function', async () => {
    const value = await safeTry(async function*(_) {
      return R.fail('error' as const)
    })
    expect(R.isFailure(value)).toBeTrue()
    expect(R.unwrapError(value)).toEqual('error')
  })

  it('should return `failure` value', () => {
    const value = safeTry(function*(_) {
      return R.fail('error' as const)
    })
    expect(R.isFailure(value)).toBeTrue()
    expect(R.unwrapError(value)).toEqual('error')
  })

  it('should return error from safeTry body without calling next functions', () => {
    const fn = mock()
    const result = safeTry(function*(_) {
      yield* _(R.fail('error'))
      fn()
      return R.succeed()
    })

    expect(fn).not.toHaveBeenCalled()
    expect(R.isFailure(result)).toBeTrue()
    expect(result).toEqual(R.fail('error'))
  })

  it('should return error from safeTry async body without calling next functions', async () => {
    const fn = mock()
    const result = await safeTry(async function*(_) {
      yield* _(R.fail('error'))
      fn()
      return R.succeed()
    })

    expect(fn).not.toHaveBeenCalled()
    expect(R.isFailure(result)).toBeTrue()
    expect(result).toEqual(R.fail('error'))
  })

  it('should work with sync and async operations in the same body', async () => {
    const succeedValues: number[] = []

    const result = await safeTry(async function*(_) {
      const a = yield* _(R.succeed(1))
      succeedValues.push(a)
      const b = yield* _(await R.succeed(Promise.resolve(2)))
      succeedValues.push(b)
      const c = yield* _(R.succeed(3))
      succeedValues.push(c)

      return R.succeed()
    })

    expect(R.isSuccess(result)).toBeTrue()
    expect(succeedValues).toEqual([1, 2, 3])
  })
})
