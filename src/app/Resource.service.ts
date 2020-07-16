import {Injectable} from "@angular/core";
import {Resource} from "./Model/Resource";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn:'root'})
export class ResourceService {
  private resources: Resource[] = [];
  public resourceSubject = new Subject<Resource[]>();

  constructor(private http: HttpClient) {
  }
  setResource(id: string){
    this.http.get<Resource[]>('/engine-rest/deployment/' + id + '/resources')
      .subscribe(response => {
        const resources: Resource[] = [];
        for(let resource of response){
          resources.push(resource);
        }
        this.resources = resources;
        this.resourceSubject.next(resources);
      });
  }
}
