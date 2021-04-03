import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, View } from 'react-native';


const ImageLoader = (props) => {
  const { isShowActivity = true, style, source, resizeMode, borderRadius, backgroundColor, children,
    loadingStyle, placeholderSource, placeholderStyle,
    customImagePlaceholderDefaultStyle } = props
  const [isLoaded, setLoaded] = useState(false)
  const [isError, setError] = useState(false)

  const onLoadEnd = () => setLoaded(true)
  const onError = () => setError(true)

  const styles = useMemo(() => StyleSheet.create({
    backgroundImage: {
      position: 'relative',
      overflow: 'hidden',
      ...style
    },
    activityIndicator: {
      position: 'absolute',
      margin: 'auto',
      zIndex: 9,
    },
    viewImageStyles: {
      flex: 1,
      backgroundColor: '#e9eef1',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius ?? undefined,
      backgroundColor: backgroundColor ?? undefined
    },
    imagePlaceholderStyles: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      justifyContent: 'center',
      alignItems: 'center',
      ...customImagePlaceholderDefaultStyle
      // overFlow: 'hidden'
    },
    viewChildrenStyles: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      backgroundColor: 'transparent'
    }
  }), [style, borderRadius, backgroundColor])

  return (
    <ImageBackground
      onLoadEnd={onLoadEnd}
      onError={onError}
      style={styles.backgroundImage}
      source={source}
      resizeMode={resizeMode}
      borderRadius={borderRadius}
    >
      {
        (isLoaded && !isError) ? children :
          <View style={styles.viewImageStyles} >
            {
              (isShowActivity && !isError) &&
              <ActivityIndicator
                style={styles.activityIndicator}
                size={loadingStyle ? loadingStyle.size : 'small'}
                color={loadingStyle ? loadingStyle.color : 'gray'}
              />
            }
            <Image
              style={placeholderStyle ?? styles.imagePlaceholderStyles}
              source={placeholderSource ?? null}
            >
            </Image>
          </View>
      }
      {
        children &&
        <View style={styles.viewChildrenStyles}>
          {children}
        </View>
      }
    </ImageBackground>
  );
}

export default ImageLoader
