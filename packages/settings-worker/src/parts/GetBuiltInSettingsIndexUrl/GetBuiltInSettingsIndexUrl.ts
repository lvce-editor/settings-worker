export const getBuiltInSettingsIndexUrl = (): string => {
  return new URL('../../../builtin-settings/index.json', import.meta.url).href
}
