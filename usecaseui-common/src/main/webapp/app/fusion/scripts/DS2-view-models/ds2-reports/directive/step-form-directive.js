appDS2
.directive('stepForm', function($compile,$http, stepFormFactory) {
    return {
        restrict: 'AE',

        // scope: {
        //     jsonSource: '='
        // },
        link: function(scope, elem, attrs) {
            var jsonSrcName = "app/fusionapp/scripts/view-models/wz_steps/json/step1.json";
            stepFormFactory.renderForm(jsonSrcName, elem, scope);
        }
    }
});
