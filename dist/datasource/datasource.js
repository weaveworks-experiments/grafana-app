System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function formatTime(time) {
        return time.utc().format(RFC3339Nano) + "Z";
    }
    var moment_1, RFC3339Nano, Datasource;
    return {
        setters: [
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }
        ],
        execute: function () {
            RFC3339Nano = 'YYYY-MM-DDTHH:mm:ss.SSSSSSSSS';
            Datasource = (function () {
                function Datasource(instanceSettings, $q, backendSrv, templateSrv) {
                    this.type = instanceSettings.type;
                    this.url = instanceSettings.url.replace(/\/+$/g, '');
                    this.name = instanceSettings.name;
                    this.q = $q;
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.activeQueries = {};
                }
                Datasource.prototype.annotationQuery = function (options) {
                    var _this = this;
                    var _a = options.range, from = _a.from, to = _a.to;
                    var url = this.url + "/api/flux/v6/history?service=%3Call%3E&simple=true&after=" + formatTime(from) + "&before=" + formatTime(to);
                    var promise = this.activeQueries[url];
                    if (promise === undefined) {
                        promise = this.backendSrv.datasourceRequest({ url: url }).then(function (resp) { return _this.transformResponse(options.annotation, resp); });
                        this.activeQueries[url] = promise;
                        promise.then(function () { return delete _this.activeQueries[url]; });
                    }
                    return promise;
                };
                Datasource.prototype.transformResponse = function (annotation, response) {
                    var anno = {
                        name: annotation.name,
                        datasource: annotation.datasource,
                        enabled: true,
                    };
                    var events = response.data;
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
                    return out;
                };
                return Datasource;
            }());
            exports_1("default", Datasource);
        }
    };
});
//# sourceMappingURL=datasource.js.map