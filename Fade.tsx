import React from 'react'
import { StyleSheet, View, ImageBackground, ImageSourcePropType } from 'react-native'
import defaultGradient from './gradient.png'

type Dimensions = { width: number; height: number }

type Props = {
  side: Side
  show: boolean
  width: number
  view: Dimensions
  gradient?: string | ImageSourcePropType
}

type Side = 'top' | 'right' | 'bottom' | 'left'

const rotateGradient = (side: Side) => {
  if (side === 'right') {
    return '180deg'
  }

  if (side === 'top') {
    return '90deg'
  }

  if (side === 'bottom') {
    return '270deg'
  }

  return '0deg'
}

const leftPosition = (side: Side, view: Dimensions, width: number) => {
  if (side === 'left') {
    return 0
  }

  if (side === 'top' || side === 'bottom') {
    return view.width / 2 - width / 2
  }

  return 'auto'
}

const topPosition = (side: Side, view: Dimensions, width: number) => {
  if (side === 'top') {
    // Weird value, due to rotation.
    return -view.width / 2 + width / 2
  }

  if (side === 'bottom') {
    return -view.width / 2 - width / 2 + view.height
  }

  return 'auto'
}

const createStyles = (side: Side, view: Dimensions, width: number) =>
  StyleSheet.create({
    fade: {
      position: 'absolute',
    },
    view: {
      left: leftPosition(side, view, width),
      right: side === 'right' ? 0 : 'auto',
      top: topPosition(side, view, width),
      height: side === 'left' || side === 'right' ? '100%' : view.width,
      width: side === 'bottom' || side === 'top' ? width : width,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    backgroundImage: {
      resizeMode: 'stretch',
      transform: [{ rotate: rotateGradient(side) }],
    },
  })

const toImageSource = (input: string | ImageSourcePropType) => {
  if (typeof input === 'string') {
    return { uri: input }
  }

  return input
}

export const Fade = ({ side, show, width, view, gradient }: Props) => {
  if (!show) {
    return null
  }

  const styles = createStyles(side, view, width)

  return (
    <View pointerEvents="none" style={[styles.fade, styles.view]}>
      <ImageBackground
        source={toImageSource(gradient || defaultGradient)}
        style={styles.image}
        imageStyle={styles.backgroundImage}
      />
    </View>
  )
}
