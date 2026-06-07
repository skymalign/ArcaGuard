// Permite usar el web component <elevenlabs-convai> en JSX con tipado.
// (En React 19 el namespace JSX se aumenta dentro del módulo 'react'.)
import type { HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': HTMLAttributes<HTMLElement> & { 'agent-id'?: string };
    }
  }
}
