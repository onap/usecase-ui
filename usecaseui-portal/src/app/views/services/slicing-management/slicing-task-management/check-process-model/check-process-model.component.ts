import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
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
	@Input() moduleOperation: string;

	@Output() cancel = new EventEmitter<boolean>();

	constructor(private http: SlicingTaskServices, private message: NzMessageService) { }

	checkDetail: any[];
	businessRequirement: any[];
	NSTinfo: any[];
	data: any[];
	currentProgress: number = 1;
	timer: any = null;
	isSpinning: boolean = false;
	isGetData: boolean = false;

	ngOnInit() { }

	ngOnChanges() {
		if (this.showProcess) {
			this.isSpinning = true;
			this.getInfo();
			this.getProgress();
		} else {
			clearTimeout(this.timer);
			this.isGetData = false;
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
					business_demand_info: { service_snssai, coverage_area_ta_list }
				} = result_body;
				// 处理配置审核详情数据
				this.checkDetail = [{ task_id, task_name, create_time, processing_status, service_snssai }];
				// 业务需求信息数据
				business_demand_info.area = coverage_area_ta_list.map(item => {
					item = item.split(';').join(' - ')
					return item
				})
				// 前端模拟数据
				let area = ["Beijing;Beijing;Haidian District", "Beijing;Beijing;Xicheng District", "Beijing;Beijing;Changping District"].map(item => {
					item = item.split(';').join(' - ')
					return item
				})
				this.businessRequirement = [{ ...business_demand_info, area }];
				// 匹配NST信息
				this.NSTinfo = [nst_info];
			} else {
				const errorMessage = this.moduleOperation === 'Creating' ? 'Failed to get data' : 'Viewing results failed';
				this.message.error(errorMessage);
			}
			this.isLoadingShow();
		}, ({ status, statusText }) => {
			this.message.error(status + ' (' + statusText + ')');
			this.isLoadingShow();
		})
	}

	isLoadingShow() {
		if (this.isGetData) {
			this.isSpinning = false;
		} else {
			this.isGetData = true;
		}
	}

	getProgress(): void {
		this.http.getSlicingCreateProgress(this.taskId).subscribe(res => {
			const { result_body, result_header: { result_code } } = res;
			if (+result_code === 200) {
				this.data = [];
				Object.keys(result_body).forEach(item => {
					let currentProgress = 1
					let status = 'process';
					if (+result_body[item] === 100) {
						currentProgress = 3;
						status = 'finish'
					}
					const title = item === 'an_progress' ? 'An' : (item === 'tn_progress' ? 'Tn' : 'Cn')
					let obj = { [item]: result_body[item], currentProgress, title, status };
					if (result_body[item]) {
						this.data.push(obj)
					}
				})
				this.data = [this.data];
				let flag: boolean = false;
				Object.values(result_body).forEach(item => {
					if (+item !== 100 && typeof item !== 'object') {
						flag = true;
					}
				})
				if (flag) {
					this.timer = setTimeout(() => {
						this.getProgress()
					}, 5000)
				}
			} else {
				this.message.error('Failed to get progress')
			}
			this.isLoadingShow();
		}, ({ status, statusText }) => {
			this.message.error(status + ' (' + statusText + ')');
			this.isLoadingShow();
		})
	}

	handleCancel() {
		this.showProcess = false;
		this.cancel.emit(this.showProcess)
	}
}
