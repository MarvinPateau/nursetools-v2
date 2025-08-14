declare module 'react-animated-weather' {
  import * as React from 'react';
  export type Icon =
    | 'CLEAR_DAY'
    | 'CLEAR_NIGHT'
    | 'PARTLY_CLOUDY_DAY'
    | 'PARTLY_CLOUDY_NIGHT'
    | 'CLOUDY'
    | 'RAIN'
    | 'SLEET'
    | 'SNOW'
    | 'WIND'
    | 'FOG';
  export interface Props {
    icon: Icon;
    color?: string;
    size?: number;
    animate?: boolean;
    className?: string;
  }
  export default function ReactAnimatedWeather(props: Props): React.ReactElement;
}
