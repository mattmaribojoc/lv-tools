interface Replace {
  find: RegExp
  replace: string
}
const replaceKeys = [
  {
    find: /fill="#000000"|fill="#ffffff"/g,
    replace: 'fill-black dark:fill-white'
  },
  {
    find: /stroke="#ffffff"|stroke="#000000"/g,
    replace: 'stroke-black dark:stroke-white'
  }
] as Replace[]

export function convertToTw(svgCode: string) {
  replaceKeys.forEach(({ find, replace }) => {
    svgCode = svgCode.replace(find, `class="${replace}"`)
  })
  return svgCode
}

export function removeBg(svgCode: string) {
  return svgCode.replace(/<rect x="0" y="0" [\s\S]*><\/rect>/g, '')
}

export function removeDefs(svgCode: string) {
  return svgCode.replace(/<defs>[\s\S]*<\/defs>/g, '')
}
