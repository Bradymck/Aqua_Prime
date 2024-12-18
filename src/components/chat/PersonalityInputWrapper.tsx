'use client';
import React from 'react';
import { PersonalityInput, type PersonalityInputProps } from './PersonalityInput';

export function PersonalityInputWrapper(props: PersonalityInputProps) {
  return <PersonalityInput {...props} />;
}