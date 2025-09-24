declare module 'react-us-map' {
  import { ComponentType } from 'react';
  
  interface USMapProps {
    onClick?: (state: any) => void;
    width?: number;
    height?: number;
    customize?: any;
    [key: string]: any;
  }
  
  export const USMap: ComponentType<USMapProps>;
}
