'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { STEPS } from '@/utils/constants';

const initialState = {
  currentStep: STEPS.TEMPLATE,
  canProgress: false,
  data: {
    template: null,
    sender: {
      company: '',
      website: '',
      oneLiner: '',
      benefits: ['', '', ''],
      socialProof: '',
      tone: 'friendly'
    },
    recipient: {
      name: '',
      role: '',
      company: '',
      industry: '',
      signalUrl: '',
      signalDescription: ''
    },
    partnership: {
      type: '',
      valueHypothesis: '',
      cta: ''
    },
    emails: [],
    schedule: []
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_CAN_PROGRESS':
      return { ...state, canProgress: action.payload };
    case 'SET_TEMPLATE':
      return { 
        ...state, 
        data: { ...state.data, template: action.payload },
        canProgress: true
      };
    case 'SET_INPUTS':
      return { 
        ...state, 
        data: { 
          ...state.data, 
          sender: action.payload.sender,
          recipient: action.payload.recipient,
          partnership: action.payload.partnership
        }
      };
    case 'SET_EMAILS':
      return { 
        ...state, 
        data: { ...state.data, emails: action.payload }
      };
    case 'SET_SCHEDULE':
      return { 
        ...state, 
        data: { ...state.data, schedule: action.payload }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}