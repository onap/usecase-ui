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

export class Util {
    // Time formatting milliseconds to normal
    dateformater(vmstime) {
        if (!vmstime) {
            return ''
        }
        let mstime = Number((vmstime + '').slice(0, 13));
        let time = new Date(mstime);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let formattime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return formattime;
    }
    
    getRulesText(words: string, title: string, index: number, rulesText: any[]){
        return rulesText[index] = words + title
    };
    validator(title: string, key: string, val: any, index: number, rulesText: any[], validateRulesShow: any[]) {
        let maxNumberReg = /^([1-9]\d{0,4}|100000)$/, // Check integer between 1 ~ 100000
            expDataRateReg  = /^([1-9]\d{2}|[1-3]\d{3}|3000)$/, // Check integer between 100 ~ 3000
            latencyReg = /^1[0-9]$|^[2-9]\d$|^1\d{2}$|^200$/; // Check integers between 10 and 200
        if (val === null || val.replace(/\s*/g, '').length <= 0) {
            validateRulesShow[index] = true;
            this.getRulesText('Please enter ', title, index,rulesText);
            return false
        } else {
            validateRulesShow[index] = false;
        }
        if (isNaN(val) && (key === 'maxNumberofUEs' || key === 'expDataRateDL' || key === 'expDataRateUL' || key === 'latency')) {
            validateRulesShow[index] = true;
            this.getRulesText('Only numbers can be entered', '', index,rulesText);
            return false
        }
        if (!isNaN(val) && key === 'maxNumberofUEs' && !maxNumberReg.test(val)) {
            validateRulesShow[index] = true;
            this.getRulesText('Scope: 1-100000', '', index,rulesText);
            return false
        } else {
            validateRulesShow[index] = false;
        }
        if ( !isNaN(val) && (key === 'expDataRateDL' || key === 'expDataRateUL') && !expDataRateReg.test(val)) {
            validateRulesShow[index] = true;
            this.getRulesText('Scope: 100-3000', '', index,rulesText);
            return false
        } else {
            validateRulesShow[index] = false;
        }
        if (!isNaN(val) && key === 'latency' && !latencyReg.test(val)) {
            validateRulesShow[index] = true;
            this.getRulesText('Scope: 10-200', '', index,rulesText);
            return false
        } else {
            validateRulesShow[index] = false;
        }
    }
    isInteger (value: any) : boolean{
        // for common string and undefined, eg '123a3'
		if (isNaN(value)) {
			return false;
		} else if (isNaN(parseInt(value))) {
			return false;
		} else if (Number(value) < 0 || (Number(value)%1 !== 0)){
			return false;
		} else {
			return true;
		}
    }
    judgeType (a: any) : string {
		return Object.prototype.toString.call(a)
    }
    isEmpty (a: any): boolean {
        const type = this.judgeType(a);
        if (type === 'object Null' || type === '[object undefined]' || a === '') {
            return true;
        } else {
            return false;
        }
    }
    deepCheck (target: any) : boolean{
        //used to verify that each item is not '' or undefined in a object or an array
        let type = this.judgeType(target);
		if (type === '[object Array]') {
			for (let i = 0; i < target.length; i++) {
				if (!this.deepCheck(target[i])) {
					return false;
				}
			  }
		} else if (type === '[object Object]') {
			for (const prop in target) {
				if (target.hasOwnProperty(prop)) {
				  if (!this.deepCheck(target[prop])) {
					  return false;
				  }
				}
			}
		} else {
			if (this.isEmpty(target)) { // '', undefined, null, false
				return false;
			} else {
				return true;
			}
		}
		return true;
    }
    pick(obj: object, arr: Array<string>): Object {
        return arr.reduce((iter, val) => {
          if(val in obj) {
            iter[val] = obj[val];
          }
          return iter;
        }, {});
      }
}