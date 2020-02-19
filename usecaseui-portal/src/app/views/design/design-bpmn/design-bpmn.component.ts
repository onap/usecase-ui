import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InjectionNames, EntryFactory, BpmnModeler, PropertiesPanelModule, CamundaModdleDescriptor, ElementTemplates, CamundaPropertiesProvider, OriginalPaletteProvider} from "./bpmn-js/bpmn-js"

@Component({
  selector: 'app-design-bpmn',
  templateUrl: './design-bpmn.component.html',
  styleUrls: ['./design-bpmn.component.less']
})
export class DesignBpmnComponent implements OnInit {
  modeler;
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.modeler = new BpmnModeler({
      container: '#canvas',
      width: '100vw',
      height: '100vh',
      additionalModules: [
        {[InjectionNames.elementTemplates]: ['type', ElementTemplates.elementTemplates[1]]},
        {[InjectionNames.propertiesProvider]: ['type', CamundaPropertiesProvider.propertiesProvider[1]]},

        {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},

        PropertiesPanelModule
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtensions: {
        camunda: CamundaModdleDescriptor
      }
    });
    this.load();
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  load(): void {
    const url = 'assets/bpmn/initial.bpmn';
    this.http.get(url, {
      headers: {observe: 'response'}, responseType: 'text'
    }).subscribe(
      (x: any) => {
        console.log('Fetched XML, now importing: ', x);
        this.modeler.importXML(x, this.handleError);
      },
      this.handleError
    );
  }

  save(): void {
    this.modeler.saveXML((err: any, xml: any) => console.log('Result of saving XML: ', err, xml));
  }
}
