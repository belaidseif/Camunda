import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DeploymentService} from "./Deployment.service";
import {Deployment} from "./Model/Deployment";
import {ResourceService} from "./Resource.service";
import {Resource} from "./Model/Resource";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'bpmn-js-angular';
  diagramUrl = "https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn";
  importError?: Error;

  deployments: Deployment[] = [];
  idDeployment:string = "";
  resources: Resource[] = [];
  idResource: string = "";
  saving = false;

  save = false;
  constructor(
    private http:HttpClient,
    private deploymentService: DeploymentService,
    private resourceService: ResourceService
  ) {}
  ngOnInit() {
    this.deploymentService.deploymentSubject.subscribe(deployments => {
      this.deployments = deployments;

    });
    this.resourceService.resourceSubject.subscribe(resources =>{
      this.resources = resources;
      console.log(resources);
      this.diagramUrl = '/engine-rest/deployment/' + this.idDeployment + '/resources/' + resources[0].id + '/data';
      this.idResource = resources[0].id;
    });
    this.deploymentService.setDeployments();
  }

  handleImported(event) {

    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length)
      console.log(warnings);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }
  //fetch for deployment's resource
  onDeployment(id: string){
    this.idDeployment = id;
    this.resourceService.setResource(id);
  }
  //when selecting a resource
  onResource(id:string){
    this.diagramUrl = '/engine-rest/deployment/' + this.idDeployment + '/resources/' + id + '/data';
    this.idResource = id;
  }

  onNewDiagram(){
    this.diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  }
  onSaveDiagram(){
    this.save = true;
  }
}
