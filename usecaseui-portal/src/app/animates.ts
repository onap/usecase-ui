import { trigger, state, style, animate, transition } from '@angular/animations';

// 路由动画
export const slideToRight = trigger('routerAnimate', [
    // 定义void表示空状态下
    state('void', style({ position:'fixed', zIndex:'-1' })), //不明白为啥要加定位出场动画才生效
    // * 表示任何状态
    state('*', style({ })),
    // 进场动画
    transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('.5s ease-in-out')
    ]),
    // 出场动画
    transition(':leave', [
        animate('.5s ease-in-out',  style({transform: 'translateX(100%)'}) )
    ])
]);
// 详情页显示隐藏动画
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
// 详情页显示隐藏动画
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