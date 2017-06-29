class AnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html'
}

type WCDatasources = {cortex: null|any, flux: null|any};

class ConfigCtrl {
  static templateUrl = 'partials/config.html';
  private enabled: boolean;
  private $q: any;
  private backendSrv: any;
  private alertSrv: any;
  private appEditCtrl: any;
  private appModel: any;

  constructor(
      $scope: any, $injector: any, $q: any, backendSrv: any, alertSrv: any,
      contextSrv: any, datasourceSrv: any) {
        console.log("here", this, arguments)
    this.$q = $q;
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
    // TODO: support multiple Weave Cloud instances
    if (this.appModel.jsonData === null) {
      // TODO: use secureJsonData
      this.appModel.jsonData = {serviceToken: ""};
    }

    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
  }

  postUpdate() {
    var model = this.appModel;
    if (!model.enabled) {
      model.jsonData = {};
      return this.$q.resolve();
    }
    // TODO validate the token, store the instance name & ID

    return this.configureDatasource();
  }

  getDatasources() {
    return this.backendSrv.get('/api/datasources')
      .then((results: any) => {
        const datasources: WCDatasources = {
          cortex: null,
          flux: null,
        };
        // TODO lookup the datasources by instance name/id
        results.map((ds: any) => {
          if (ds.name === "cortex") {
            datasources.cortex = ds;
          }
          if (ds.name === "flux") {
            datasources.flux = ds;
          }
        });
        return datasources;
      });
  }

  configureDatasource() {
    //check for existing datasource.
    return this.getDatasources().then((datasources: WCDatasources) => {
      const {cortex, flux} = datasources;
      const promise = this.$q.when();
      // TODO name the datasources by instance
      const newCortex = {
        name: 'cortex',
        type: 'prometheus',
        url: 'https://cloud.weave.works/api/prom',
        access: 'proxy',
        withCredentials: true,
        basicAuth: true,
        basicAuthPassword: this.appModel.jsonData.serviceToken,
        basicAuthUser: "user",
        jsonData: {}
      };
      const newFlux = {
        name: 'flux',
        type: 'weavecloud-flux',
        url: 'https://cloud.weave.works/api/flux/v3',
        access: 'proxy',
        withCredentials: true,
        basicAuth: true,
        basicAuthPassword: this.appModel.jsonData.serviceToken,
        basicAuthUser: "user",
        jsonData: {}
      };

      promise.then(() => {
        if (cortex) {
          return this.backendSrv.put(
            '/api/datasources/' + cortex.id, {...cortex, ...newCortex});
        } else {
          return this.backendSrv.post('/api/datasources', newCortex);
        }
      })

      promise.then(() => {
        if (flux) {
          return this.backendSrv.put(
            '/api/datasources/' + flux.id, {...flux, ...newFlux});
        } else {
          return this.backendSrv.post('/api/datasources', newFlux);
        }
      })

      return promise;
    });
  }
}

export {ConfigCtrl};
