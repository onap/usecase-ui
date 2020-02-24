import {Component, Input, OnInit,SimpleChanges} from '@angular/core';
import {BUSINESS_STATUS} from '../../../../../../../constants/constants';
import {SlicingTaskServices} from "../../../../../../core/services/slicingTaskServices";
import {NsiModelComponent} from "../nsi-model/nsi-model.component";
import {NzModalService} from 'ng-zorro-antd';

@Component({
    selector: 'app-nsi-table',
    templateUrl: './nsi-table.component.html',
    styleUrls: ['./nsi-table.component.less']
})
export class NsiTableComponent implements OnInit {

    constructor(
        private myhttp: SlicingTaskServices,
        private modalService: NzModalService
    ) {
    }

    @Input() currentTabName;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.currentTabName.currentValue === 'Slicing Instance Management') {
            this.getNsiList()
        }
    }
    ngOnInit() {}

    selectedValue: string = BUSINESS_STATUS[0];
    listOfData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    total: number = 0;
    loading = false;
    isSelect: boolean = false;
    statusOptions: any[] = BUSINESS_STATUS;

    getNsiList(): void {
        this.loading = true;
        this.isSelect = false;
        this.listOfData = [];
        let paramsObj = {
            pageNo: this.pageIndex,
            pageSize: this.pageSize
        };
        if (this.selectedValue !== BUSINESS_STATUS[0]) {
            paramsObj["instanceStatus"] = this.selectedValue.toLocaleLowerCase();
            this.isSelect = true;
        }
        this.myhttp.getSlicingNsiList(paramsObj, this.isSelect).subscribe(res => {
            const {result_header: {result_code}, result_body: {nsi_service_instances, record_number}} = res;
            this.loading = false;
            if (+result_code === 200) {
                this.total = record_number;
                this.loading = false;
                if (nsi_service_instances !== null && nsi_service_instances.length > 0) {
                    this.listOfData = nsi_service_instances;
                }
            }
        }, (res) => {
            this.loading = false;
            console.error(res);
        })
    }

    getListOfProcessingStatus() {
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getNsiList();
    }

    searchData(reset: boolean = false) {
        this.getNsiList();
    }

    showdetail(data) {
        const nsiModal = this.modalService.create({
            nzTitle: "Detail",
            nzContent: NsiModelComponent,
            nzWidth: "70%",
            nzOkText: null,
            nzCancelText: null,
            nzComponentParams: {
                nsiId: data.service_instance_id
            }
        })
    }
}
