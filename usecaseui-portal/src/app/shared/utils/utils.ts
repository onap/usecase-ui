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
}