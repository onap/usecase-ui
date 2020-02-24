import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-slicing-resource-management',
    templateUrl: './slicing-resource-management.component.html',
    styleUrls: ['./slicing-resource-management.component.less']
})
export class SlicingResourceManagementComponent implements OnInit {

    constructor() {}

    @Input() currentTabTitle;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.currentTabTitle.currentValue === 'Slicing Resource Management') {
            this.currentTab = 'Slicing Business Management'
        }else {
            this.currentTab = ''
        }
    }

    ngOnInit() {}

    currentTab = '';

    handleTabChange($event): void {
        this.currentTab = $event.tab._title;
    }
}
