import moment from "moment";

interface IFluxEvent {
  Stamp: string;
  Data: string;
}

export default class Datasource {
  private type: any;
  private url: any;
  private name: any;
  private q: any;
  private backendSrv: any;
  private templateSrv: any;
  private queryCache: {[key: string]: Promise<any>};

  public constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any) {
      this.type = instanceSettings.type;
      this.url = instanceSettings.url;
      this.name = instanceSettings.name;
      this.q = $q;
      this.backendSrv = backendSrv;
      this.templateSrv = templateSrv;

      this.queryCache = {};
  }

  public annotationQuery(options: any) {
    const k = "fake"
    const p = this.backendSrv.datasourceRequest({
      url: this.url + '/history?service=%3Call%3E&simple=true&limit=1000',
    }).then((resp: any) => this.transformResponse(options.annotation, resp));

    this.queryCache[k] = p
    p.then(() => delete this.queryCache[k]);
    return p;
  }
  private transformResponse(annotation: any, response: any) {
    const anno = {
      name: annotation.name,
      datasource: annotation.datasource,
      enabled: true,
    };
    const events = response.data.slice(0, 100) as IFluxEvent[]
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
    console.log("resF", out[0])
    console.log("resL", out[out.length -1])
    return out;
  }
}
