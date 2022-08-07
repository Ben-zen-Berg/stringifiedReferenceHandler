(function (app) {
    app.explanation = {
        explane: function(language, greeting) {
            var test = app.stringifiedReferenceHandler.parse('store.messages.current');
            if (test) {
                alert('That was ' + test.language + ' and means "' + test.greeting + '"');
            }
            return test
        },
    };
    if (app.stringifiedReferenceHandler && !app.explanation.explane()) {
        window.setTimeout(app.explanation.explane, 500);
    }
})((window.app = window.app || {}));
