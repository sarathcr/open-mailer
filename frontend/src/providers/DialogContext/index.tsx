'use client';
import { createContext } from 'react';
import { DialogContextValue } from '../types/dialog';

export const DialogContext = createContext<DialogContextValue | null>(null);
