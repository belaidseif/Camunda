import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bpmn-js-angular';
  diagramUrl = "/engine-rest/deployment/3b993e95-c39a-11ea-a204-24ec9996c991/resources/3b993e97-c39a-11ea-a204-24ec9996c991/data";
  importError?: Error;
  constructor(private http:HttpClient) {
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
  onAjouter(){
    this.http.get("/engine-rest/deployment/3b993e95-c39a-11ea-a204-24ec9996c991/resources/3b993e97-c39a-11ea-a204-24ec9996c991/data", { responseType: "text" })
      .subscribe(text => console.log(text));
  }
}
