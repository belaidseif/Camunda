export class Deployment {
  constructor(
    public id:string,
    public links: string[],
    public name: string,
    public source: string,
    public deploymentTime: Date,
    public tenantId: string
  ) {}
}
