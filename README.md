# byethrow safeTry

utility for [@praha/byethrow](https://github.com/praha-inc/byethrow) to mimic the rust `?` operator, similar to [neverthrow safeTry](https://github.com/supermacro/neverthrow#safetry), or [Effect generators](https://effect.website/docs/getting-started/using-generators/).

```ts
import { R } from '@praha/byethrow'
import { safeTry } from 'byethrow-safe-try'

function computeSomething() {
    if (Math.random() > 0.5) {
        return R.succeed(1)
    } 
    return R.fail('error')
}

const result = safeTry(function*(_) {
    const a = yield* _(computeSomething())
    const b = yield* _(computeSomething())
    return R.succeed(a + b)
})

if (R.isSuccess(result)) {
    console.log(R.unwrap(result)) // 2
} else {
    console.log(R.unwrapError(result)) // 'error'
}
```
