import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SlicingTaskServices } from '../../../../../core/services/slicingTaskServices'

@Component({
	selector: 'app-check-process-model',
	templateUrl: './check-process-model.component.html',
	styleUrls: ['./check-process-model.component.less']
})
export class CheckProcessModelComponent implements OnInit {

	@Input() moduleTitle: string;
	@Input() showProcess: boolean;
	@Input() taskId: string;

	@Output() cancel = new EventEmitter<boolean>();

	constructor(private http: SlicingTaskServices) { }

	checkDetail: any[];
	businessRequirement: any[];
	NSTinfo: any[];

	ngOnInit() { }

	ngOnChanges() {
		if (this.showProcess) {
			this.getInfo();
		}
	}

	getInfo(): void {
		this.http.getSlicingBasicInfo(this.taskId).subscribe(res => {
			const { result_body, result_header: { result_code } } = res;
			if (+result_code === 200) {
				const {
					task_id,
					task_name,
					create_time,
					processing_status,
					business_demand_info,
					nst_info,
					business_demand_info: { service_snssai }
				} = result_body;
				// 处理配置审核详情数据
				this.checkDetail = [{ task_id, task_name, create_time, processing_status, service_snssai }];
				// 业务需求信息数据
				this.businessRequirement = [business_demand_info];
				// 匹配NST信息
				this.NSTinfo = [nst_info];
			}
		})
	}

	handleCancel() {
		this.showProcess = false;
		this.cancel.emit(this.showProcess)
	}
	handleOk() { }

}
