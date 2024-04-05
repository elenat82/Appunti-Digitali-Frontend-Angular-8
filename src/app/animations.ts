import {
  trigger,
  animate,
  transition,
  style,
  query, 
  group, 
  state
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.3s ease-in-out', style({ transform: 'translateX(-100%)' }
        ))], { optional: true }),
    ])
  ])
]);

export const animateText = trigger('animateText', [
  // Defining the hidden state
  state('hidden', style({
    opacity: 0
  })),
  // Defining the visible state
  state('visible', style({
    opacity: 1
  })),
  // Defining the animation for state changes
  transition('hidden <=> visible', [
    animate('1s ease-out')
  ])
])
