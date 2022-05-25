import React, { ReactNode, useState } from 'react'
import {
  ScrollView,
  SafeAreaView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollViewProps,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native'
import omit from 'omit.js'
import { getDirectionFromBoolean } from './direction'
import { Fade } from './Fade'
import type { Direction, FadeType, View, Content } from './types'

type Props = {
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

type InputProps = {
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

type State = {
  direction: Direction
  setDirection: (value: Direction) => void
  fade: FadeType
  setFade: (value: FadeType) => void
  view: View
  setView: (value: View) => void
  content: Content
  setContent: (value: Content) => void
}

const handleLayout = (state: State, event: LayoutChangeEvent) => {
  const newFade = { ...state.fade }
  const newView = { ...state.view }
  const layout = event.nativeEvent.layout

  if (state.view.width < layout.width) {
    newView.width = layout.width
  }
  if (state.content.width) {
    newFade.right = state.content.width > state.view.width
  }

  if (state.view.height < layout.height) {
    newView.height = layout.height
  }
  if (state.content.height) {
    newFade.bottom = state.content.height > state.view.height
  }

  state.setFade(newFade)
  state.setView(newView)
}

const handleScroll = (
  props: Props,
  state: State,
  direction: Direction,
  event: NativeSyntheticEvent<NativeScrollEvent>
) => {
  const newFade = { ...state.fade }
  const offset = event.nativeEvent.contentOffset

  if (direction === 'horizontal' || direction === 'both') {
    newFade.right = offset.x + state.view.width + props.appearanceOffset < state.content.width
    newFade.left = offset.x > props.appearanceOffset
  }

  if (direction === 'vertical' || direction === 'both') {
    newFade.top = offset.y > props.appearanceOffset
    newFade.bottom = offset.y + state.view.height + props.appearanceOffset < state.content.height
  }

  state.setFade(newFade)
}

const handleContentSizeChange = (
  state: State,
  direction: Direction,
  width: number,
  height: number
) => {
  const newContent = { ...state.content }
  const newFade = { ...state.fade }

  if (direction === 'horizontal' || direction === 'both') {
    newContent.width = width
    if (state.view.width) {
      newFade.right = newContent.width > state.view.width
    }
  }

  if (direction === 'vertical' || direction === 'both') {
    newContent.height = height
    if (state.view.height) {
      newFade.bottom = newContent.height > state.view.height
    }
  }

  state.setFade(newFade)
  state.setContent(newContent)
}

// Second ScrollView for other direction as a ScrollView only supports one direction.
const renderInnerScrollView = (
  viewCompatibleProps: any,
  props: Props,
  state: State,
  direction: Direction
) => {
  if (direction !== 'both') {
    return props.children
  }

  return (
    <ScrollView
      style={[props.innerViewStyle]}
      contentContainerStyle={[props.contentContainerStyle]}
      onContentSizeChange={(width, height) =>
        handleContentSizeChange(state, 'vertical', width, height)
      }
      scrollEventThrottle={300}
      onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) =>
        handleScroll(props, state, 'vertical', event)
      }
      vertical={true}
      {...viewCompatibleProps}
    >
      {props.children}
    </ScrollView>
  )
}

const addDefaults = (props: InputProps): Props => {
  const allProps = { ...props }

  if (!props.appearanceOffset) {
    allProps.appearanceOffset = 10
  }

  if (!props.fadeWidth) {
    allProps.fadeWidth = 20
  }

  const result: any = allProps

  return result
}

export default (props: InputProps): any => {
  const allProps: Props = addDefaults(props)
  const { horizontal, vertical, fadeWidth, gradient } = allProps

  // Scroll directions (horizontal, vertical or both).
  const [direction, setDirection] = useState<Direction>(
    getDirectionFromBoolean(horizontal, vertical)
  )
  // Which fade elements are currently active.
  const [fade, setFade] = useState<FadeType>({
    top: false,
    right: getDirectionFromBoolean(horizontal, vertical) !== 'vertical',
    bottom: getDirectionFromBoolean(horizontal, vertical) !== 'horizontal',
    left: false,
  })
  const [view, setView] = useState<View>({ width: 0, height: 0 })
  const [content, setContent] = useState<Content>({ width: 0, height: 0 })

  const state: State = {
    direction,
    setDirection,
    fade,
    setFade,
    view,
    setView,
    content,
    setContent,
  }

  // Make sure not to overwrite default styles of the ScrollView.
  const viewCompatibleProps = omit(allProps, [
    'style',
    'contentContainerStyle',
    'horizontal',
    'vertical',
  ])

  return (
    <SafeAreaView style={[allProps.wrapperStyle]}>
      <ScrollView
        style={[allProps.style]}
        contentContainerStyle={[allProps.contentContainerStyle]}
        onContentSizeChange={(width, height) =>
          handleContentSizeChange(
            state,
            direction === 'both' ? 'horizontal' : direction,
            width,
            height
          )
        }
        scrollEventThrottle={300}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) =>
          handleScroll(allProps, state, direction === 'both' ? 'horizontal' : direction, event)
        }
        onLayout={(event: LayoutChangeEvent) => handleLayout(state, event)}
        horizontal={direction === 'both' || direction === 'horizontal'}
        // All additional Indicate props will be passed to the ScrollView element.
        {...viewCompatibleProps}
      >
        {renderInnerScrollView(viewCompatibleProps, allProps, state, direction)}
      </ScrollView>
      <Fade side="top" show={fade.top} width={fadeWidth} view={view} gradient={gradient} />
      <Fade side="right" show={fade.right} width={fadeWidth} view={view} gradient={gradient} />
      <Fade side="bottom" show={fade.bottom} width={fadeWidth} view={view} gradient={gradient} />
      <Fade side="left" show={fade.left} width={fadeWidth} view={view} gradient={gradient} />
    </SafeAreaView>
  )
}
