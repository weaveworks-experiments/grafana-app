System.register(["./datasource"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var datasource_1, AnnotationsQueryCtrl, ConfigCtrl;
    return {
        setters: [
            function (datasource_1_1) {
                datasource_1 = datasource_1_1;
            }
        ],
        execute: function () {
            exports_1("Datasource", datasource_1.default);
            AnnotationsQueryCtrl = (function () {
                function AnnotationsQueryCtrl() {
                }
                return AnnotationsQueryCtrl;
            }());
            AnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
            exports_1("AnnotationsQueryCtrl", AnnotationsQueryCtrl);
            ConfigCtrl = (function () {
                function ConfigCtrl() {
                }
                return ConfigCtrl;
            }());
            exports_1("ConfigCtrl", ConfigCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map