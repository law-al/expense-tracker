import Color from 'color'

export const colorToHex = (setColor: string) => {
  if (!setColor) return '#000000'
  try {
    const color = Color(setColor || 'black')
    return color.hex().toString()
  } catch (error) {
    console.error('Invalid color format:', error)
    return '#000000'
  }
}
