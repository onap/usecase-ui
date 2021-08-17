/*
    Copyright (C) 2021 Huawei Canada, Inc. and others. All rights reserved.

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

import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs/Rx";
import {AppEvent} from "@src/app/core/services/appEvent";
import {AppEventType} from "@src/app/core/services/appEventType";
import {filter} from "rxjs/operators";

@Injectable()
export class EventQueueService {

    private eventBroker = new Subject<AppEvent<any>>();

    on(eventType: AppEventType): Observable<AppEvent<any>> {
        return this.eventBroker.pipe(filter(event => event.type === eventType));
    }

    dispatch<T>(event: AppEvent<T>): void {
        this.eventBroker.next(event);
    }

}