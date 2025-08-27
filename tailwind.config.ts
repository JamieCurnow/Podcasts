import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { black, white, transparent, green, red, current, neutral, stone, gray } from 'tailwindcss/colors'

export default <Partial<Config>>{
  theme: {
    colors: {
      black,
      white,
      transparent,
      red,
      current,
      neutral,
      stone,
      gray,
      green,
      cool: gray,
      primary: stone
    },
    extend: {
      fontFamily: {
        sans: ['Noto Sans', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        black,
        white,
        transparent,
        red,
        current,
        neutral,
        stone,
        gray,
        green,
        cool: gray,
        primary: stone
      }
    }
  }
}
