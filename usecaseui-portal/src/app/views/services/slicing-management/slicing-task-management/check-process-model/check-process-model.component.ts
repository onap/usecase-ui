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
	data: any[];
	currentProgress: number = 1;
	timer: any = null;

	ngOnInit() { }

	ngOnChanges() {
		if (this.showProcess) {
			this.getInfo();
			this.getProgress();
		}else {
			clearTimeout(this.timer);
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

	getProgress(): void {
		this.http.getSlicingCreateProgress(this.taskId).subscribe(res => {
			const { result_body, result_header: {result_code } } = res;
			if (+result_code === 200) {
				this.data = [];
				Object.keys(result_body).forEach( item => {
					let currentProgress = 1
					let status = 'process';
					if(+result_body[item] === 100){
						currentProgress = 2;
						status = 'finish'
					}
					const title = item === 'an_progress'? '无线域': (item === 'tn_progress'? '传输域' : '核心域')
					let obj = { [item]: result_body[item], currentProgress, title, status };
					this.data.push(obj)
				})
				this.data = [this.data];
				let flag: boolean = false;
				Object.values(result_body).forEach ( item => {
					if(item !== 100) {
						flag = true;
					}
				})
				if(flag) {
					this.timer = setTimeout( () => {
						this.getProgress()
					}, 5000)
				}
			}
		})
	}

	handleCancel() {
		this.showProcess = false;
		this.cancel.emit(this.showProcess)
	}
	handleOk() { 
		this.handleCancel();
	}

}
 