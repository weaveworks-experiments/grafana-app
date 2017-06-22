import Datasource from "./datasource";

class AnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html'
}

class ConfigCtrl {
  static templateUrl = 'partials/config.html';
  private enabled: boolean;
  private $q: any;
  private appEditCtrl: any;
  private appModel any;

  constructor($scope: any, $injector: any, $q: any) {
    this.$q = $q;
    this.enabled = false;
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
  }

  postUpdate() {
    if (!this.appModel.enabled) {
      return this.$q.resolve();
    }
    return this.appEditCtrl.importDashboards().then(() => {
      this.enabled = true;
      return {
        url: "plugins/raintank-kubernetes-app/page/clusters",
        message: "Kubernetes App enabled!"
      };
    });
  }
}

export {AnnotationsQueryCtrl, ConfigCtrl, Datasource};
