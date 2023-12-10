import type { ReactNode } from 'react'
import type { ScrollViewProps, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'

export type FadeType = {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

export type View = {
  width: number
  height: number
}

export type Content = {
  width: number
  height: number
}

export type Direction = 'both' | 'horizontal' | 'vertical'

export type Props = {
  appearanceOffset: number
  fadeWidth: number
  horizontal?: boolean
  vertical?: boolean
  style?: StyleProp<ViewStyle>
  innerViewStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  gradient?: string | ImageSourcePropType
  children: ReactNode
} & ScrollViewProps

export type InputProps = {
  appearanceOffset?: number
  fadeWidth?: number
  horizontal?: boolean
  vertical?: boolean
  style?: StyleProp<ViewStyle>
  innerViewStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  gradient?: string | ImageSourcePropType
  children: ReactNode
} & ScrollViewProps

export type State = {
  direction: Direction
  setDirection: (value: Direction) => void
  fade: FadeType
  setFade: (value: FadeType) => void
  view: View
  setView: (value: View) => void
  content: Content
  setContent: (value: Content) => void
}
