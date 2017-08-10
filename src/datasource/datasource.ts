import moment from "moment";

interface IFluxEvent {
  Stamp: string;
  Data: string;
}
const RFC3339Nano = 'YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ';

export default class Datasource {
  private type: any;
  private url: any;
  private name: any;
  private q: any;
  private backendSrv: any;
  private templateSrv: any;
  private activeQueries: {[url: string]: Promise<any>};

  public constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any) {
      this.type = instanceSettings.type;
      this.url = instanceSettings.url.replace(/\/+$/g, '');
      this.name = instanceSettings.name;
      this.q = $q;
      this.backendSrv = backendSrv;
      this.templateSrv = templateSrv;

      this.activeQueries = {};
  }

  public annotationQuery(options: any) {
    const {range: {from, to}} = options;

    const url = `${this.url}/api/flux/v3/history?service=%3Call%3E&simple=true&from=${from.utc().format(RFC3339Nano)}&to=${to.utc().format(RFC3339Nano)}`;
    let promise = this.activeQueries[url];
    if (promise === undefined){
      promise = this.backendSrv.datasourceRequest({url}).then(
        (resp: any) => this.transformResponse(options.annotation, resp));

      this.activeQueries[url] = promise
      promise.then(() => delete this.activeQueries[url]);
    }
    return promise;
  }
  private transformResponse(annotation: any, response: {data: IFluxEvent[]}) {
    const anno = {
      name: annotation.name,
      datasource: annotation.datasource,
      enabled: true,
    };
    // TODO add regex filtering
    const events = response.data;
    const out = events.map((event) => {
      const stamp = moment(event.Stamp, "YYYY-MM-DDT-HH:mm:ss.SSSZ");

      return {
        annotation: anno,
        title: event.Data,
        text: event.Data + " " + event.Stamp,
        tags: "",
        time: stamp.valueOf()
      }
    });
    return out;
  }
}
