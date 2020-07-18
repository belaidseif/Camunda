import {Injectable} from "@angular/core";
import {Deployment} from "./Model/Deployment";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn:'root'})
export class DeploymentService {
  private deployments: Deployment[] = [];
  public deploymentSubject = new Subject<Deployment[]>()
  public deploymentBehavior = new BehaviorSubject<any>(null);
  public sendMessage = new BehaviorSubject<string>(null);
  constructor(private http:HttpClient) {
  }
  getDeployments(){
    return this.getDeployments().slice();
  }
  setDeployments(){
    this.http.get<Deployment[]>("/engine-rest/deployment").subscribe(response => {
      const deployments: Deployment[] = [];
      for(let el of response){
        deployments.push(el);
      }
      this.deployments = deployments;
      this.deploymentSubject.next(deployments);
    });
  }

  post(formData: FormData) {
    this.http.post('/engine-rest/deployment/create', formData).subscribe(res=>{
      this.sendMessage.next('Le diagramme est ajouté avec succés')
      this.setDeployments();
    }, error => {
      this.sendMessage.next('erreur: ' + error.statusText)
    });
  }
}
