import {Injectable} from "@angular/core";
import {Deployment} from "./Model/Deployment";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn:'root'})
export class DeploymentService {
  private deployments: Deployment[] = [];
  public deploymentSubject = new Subject<Deployment[]>()

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
      console.log(res);
    }, error => {
      console.log(error);
    });
  }
}
