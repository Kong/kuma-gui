import { Module } from 'vuex';
import { RootInterface } from '../..';

export interface OnboardingInterface {
  isCompleted: boolean;
  step: string;
}

export type OnboardingType = Module<OnboardingInterface, RootInterface>
