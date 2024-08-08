export function classNames(
  ...classes: Array<string | Record<string, boolean>>
) {
  const mappedClasses = classes.map(cl => {
    if (typeof cl === 'string') {
      return cl
    } else {
      return Object.keys(cl)
        .filter(key => cl[key])
        .join(' ')
    }
  })
  return mappedClasses.join(' ')
}
