
export const generatePrefix = (prefix: string) => (classname: string) => `${prefix}-${classname}`

export const prefix = (classname: string) => generatePrefix('kkdy')