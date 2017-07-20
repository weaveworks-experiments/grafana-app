System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment_1, Datasource;
    return {
        setters: [
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }
        ],
        execute: function () {
            Datasource = (function () {
                function Datasource(instanceSettings, $q, backendSrv, templateSrv) {
                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url;
                    this.name = instanceSettings.name;
                    this.q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.queryCache = {};
                }
                Datasource.prototype.annotationQuery = function (options) {
                    var _this = this;
                    var k = "fake";
                    var p = this.backendSrv.datasourceRequest({
                        url: this.url + '/api/flux/v3/history?service=%3Call%3E&simple=true&limit=1000',
                    }).then(function (resp) { return _this.transformResponse(options.annotation, resp); });
                    this.queryCache[k] = p;
                    p.then(function () { return delete _this.queryCache[k]; });
                    return p;
                };
                Datasource.prototype.transformResponse = function (annotation, response) {
                    var anno = {
                        name: annotation.name,
                        datasource: annotation.datasource,
                        enabled: true,
                    };
                    var events = response.data.slice(0, 100);
                    var out = events.map(function (event) {
                        var stamp = moment_1.default(event.Stamp, "YYYY-MM-DDT-HH:mm:ss.SSSZ");
                        return {
                            annotation: anno,
                            title: event.Data,
                            text: event.Data + " " + event.Stamp,
                            tags: "",
                            time: stamp.valueOf()
                        };
                    });
                    console.log("resF", out[0]);
                    console.log("resL", out[out.length - 1]);
                    return out;
                };
                return Datasource;
            }());
            exports_1("default", Datasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map