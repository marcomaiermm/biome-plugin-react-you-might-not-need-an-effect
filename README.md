# biome-plugin-react-you-might-not-need-an-effect

A Biome GritQL port of
[`eslint-plugin-react-you-might-not-need-an-effect`](https://github.com/nickjvandyke/eslint-plugin-react-you-might-not-need-an-effect).

## Install

```sh
pnpm add -D @biomejs/biome biome-plugin-react-you-might-not-need-an-effect
```

Add the rules you want to `biome.json`:

```json
{
  "plugins": [
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-adjust-state-on-prop-change.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-chain-state-updates.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-derived-state.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-event-handler.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-external-store-subscription.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-initialize-state.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-pass-data-to-parent.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-pass-live-state-to-parent.grit",
    "./node_modules/biome-plugin-react-you-might-not-need-an-effect/rules/no-reset-all-state-on-prop-change.grit"
  ]
}
```

Run `pnpm biome lint` or `pnpm biome check`.

Suppress a rule with its filename:

```tsx
// biome-ignore lint/plugin/no-derived-state: The legacy API needs this effect.
setFullName(`${firstName} ${lastName}`);
```

## Compatibility

The rules match direct `useState`/`useEffect` and
`React.useState`/`React.useEffect` calls in function declarations and arrow
functions. They also handle TypeScript state and prop annotations.

## Tests

`pnpm test` runs all 160 valid and invalid cases from the upstream ESLint
plugin against the Biome CLI. The corpus is pinned to its source commit and can
be refreshed with `node scripts/sync-upstream-tests.mjs <upstream-repository>`.
