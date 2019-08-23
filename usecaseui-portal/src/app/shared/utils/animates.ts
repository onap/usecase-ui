/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { trigger, state, style, animate, transition } from '@angular/animations';

// Routing animation
export const slideToRight = trigger('routerAnimate', [
    // Define void to indicate empty state
    state('void', style({ position:'fixed', zIndex:'-1' })), //I don't understand why I want to add a positioning animation to take effect.
    // * Indicates any state
    state('*', style({ })),
    // Admission animation
    transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('.5s ease-in-out')
    ]),
    // Opening animation
    transition(':leave', [
        animate('.5s ease-in-out',  style({transform: 'translateX(100%)'}) )
    ])
]);
// Detail page shows hidden animation
export const showHideAnimate = trigger('showHideAnimate', [
    state('show', style({
      transform: 'scale(1)',
      display:'block',
    })),
    state('hide', style({
      transform: 'scale(0)',
      display:'none'
    })),
    transition('show => hide', animate('300ms ease-in')),
    transition('hide => show', animate('300ms ease-out'))
]);
// Detail page shows hidden animation
export const slideUpDown = trigger('slideUpDown', [
    state('down', style({
        height: "*"
    })),
    state('up', style({
        height: "0"
    })),
    transition('down => up', animate('300ms ease-in')),
    transition('up => down', animate('300ms ease-out'))
]);