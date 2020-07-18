import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
  SimpleChanges,
  EventEmitter, OnInit
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { importDiagram } from './rx';

import { throwError } from 'rxjs';
import {DeploymentService} from "../Deployment.service";

@Component({
  selector: 'app-diagram',
  template: `
    <div #ref class="diagram-container" (click)="onClick()"></div>
  `,
  styles: [
    `
      .diagram-container {
        height: 100%;
        width: 100%;
      }
    `
  ]
})
export class DiagramComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {
  private bpmnJS: BpmnJS;
  @ViewChild('ref', { static: true }) private el: ElementRef;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  @Input() private url: string;
  //@Input() private saving: boolean;

  constructor(private http: HttpClient, private deploymentService: DeploymentService) {
    this.bpmnJS = new BpmnJS();
    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
  }
  ngOnInit() {
    this.deploymentService.deploymentBehavior.subscribe(formValue => {
      if(formValue){
        this.saveDiagram(formValue);
      }
    })
  }

  private saveDiagram(formValue: {deployment: string, resource: string }) {
    let xml = "";
    this.bpmnJS.saveXML({format: true}, (err, xmlUpdated) => xml = xmlUpdated);
    let blob = new Blob([xml], {type: "text/plain"});
    let file = new File([blob], formValue.resource + '.bpmn');
    //to send multipart form data to the server
    let formData = new FormData();
    formData.append('data', file);
    formData.append('deployment-name', formValue.deployment);
    formData.append('enable-duplicate-filtering', 'true');
    formData.append('deployment-source', 'process application');
    this.deploymentService.post(formData);
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }
  onClick(){

  }
  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {

    return (
      this.http.get(url, { responseType: "text" }).pipe(
        catchError(err => throwError(err)),
        importDiagram(this.bpmnJS)

      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }
}
