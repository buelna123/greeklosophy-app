// src/custom.d.ts
declare module '*.png' {
    const value: import('next/image').StaticImageData;
    export default value;
  }
  
  declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }