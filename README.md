# byethrow safeTry

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
