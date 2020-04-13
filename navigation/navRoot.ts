import * as React from 'react';

export const navigationRef: any = React.createRef();

export function navigate(name: string, params: any | null) {
  navigationRef.current?.navigate(name, params);
}
