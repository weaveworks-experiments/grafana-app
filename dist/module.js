System.register([], function (exports_1, context_1) {
    "use strict";
    var __assign = (this && this.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __moduleName = context_1 && context_1.id;
    var AnnotationsQueryCtrl, ConfigCtrl;
    return {
        setters: [],
        execute: function () {
            AnnotationsQueryCtrl = (function () {
                function AnnotationsQueryCtrl() {
                }
                return AnnotationsQueryCtrl;
            }());
            AnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            ConfigCtrl = (function () {
                function ConfigCtrl($scope, $injector, $q, backendSrv, alertSrv, contextSrv, datasourceSrv) {
                    console.log("here", this, arguments);
                    this.$q = $q;
                    this.backendSrv = backendSrv;
                    this.alertSrv = alertSrv;
                    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
                    if (this.appModel.jsonData === null) {
                        this.appModel.jsonData = { serviceToken: "" };
                    }
                    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
                }
                ConfigCtrl.prototype.postUpdate = function () {
                    var model = this.appModel;
                    if (!model.enabled) {
                        model.jsonData = {};
                        return this.$q.resolve();
                    }
                    return this.configureDatasource();
                };
                ConfigCtrl.prototype.getDatasources = function () {
                    return this.backendSrv.get('/api/datasources')
                        .then(function (results) {
                        var datasources = {
                            cortex: null,
                            flux: null,
                        };
                        results.map(function (ds) {
                            if (ds.name === "cortex") {
                                datasources.cortex = ds;
                            }
                            if (ds.name === "flux") {
                                datasources.flux = ds;
                            }
                        });
                        return datasources;
                    });
                };
                ConfigCtrl.prototype.configureDatasource = function () {
                    var _this = this;
                    return this.getDatasources().then(function (datasources) {
                        var cortex = datasources.cortex, flux = datasources.flux;
                        var promise = _this.$q.when();
                        var newCortex = {
                            name: 'cortex',
                            type: 'prometheus',
                            url: 'https://cloud.weave.works/api/prom',
                            access: 'proxy',
                            withCredentials: true,
                            basicAuth: true,
                            basicAuthPassword: _this.appModel.jsonData.serviceToken,
                            basicAuthUser: "user",
                            jsonData: {}
                        };
                        var newFlux = {
                            name: 'flux',
                            type: 'weavecloud-flux',
                            url: 'https://cloud.weave.works/api/flux/v3',
                            access: 'proxy',
                            withCredentials: true,
                            basicAuth: true,
                            basicAuthPassword: _this.appModel.jsonData.serviceToken,
                            basicAuthUser: "user",
                            jsonData: {}
                        };
                        promise.then(function () {
                            if (cortex) {
                                return _this.backendSrv.put('/api/datasources/' + cortex.id, __assign({}, cortex, newCortex));
                            }
                            else {
                                return _this.backendSrv.post('/api/datasources', newCortex);
                            }
                        });
                        promise.then(function () {
                            if (flux) {
                                return _this.backendSrv.put('/api/datasources/' + flux.id, __assign({}, flux, newFlux));
                            }
                            else {
                                return _this.backendSrv.post('/api/datasources', newFlux);
                            }
                        });
                        return promise;
                    });
                };
                return ConfigCtrl;
            }());
            ConfigCtrl.templateUrl = 'partials/config.html';
            exports_1("ConfigCtrl", ConfigCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map