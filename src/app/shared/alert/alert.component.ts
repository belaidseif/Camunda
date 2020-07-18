import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DeploymentService} from "../../Deployment.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Input() message: string;
  constructor(private deploymentService: DeploymentService) { }

  ngOnInit(): void {
  }
  onClose() {
    this.close.emit();
  }

  onSubmit(form: NgForm){
    this.deploymentService.deploymentBehavior.next(form.value);
    this.close.emit();
  }
}
