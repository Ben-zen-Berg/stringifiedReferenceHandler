(function (app) {
    app.explanation = {
        explane: function() {
            var test = app.stringifiedReferenceHandler.parse('store.messages.current');
            if (test) {
                alert('That was ' + test.language + ' and means "' + test.greeting + '"');
            }
        },
    };
    if (!app.explanation.explane()) {
        window.setTimeout(app.explanation.explane, 500);
    }
})((window.app = window.app || {}));
