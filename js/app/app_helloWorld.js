var app = app || {};
app.themeMng = {
    getRandomGreeting: function () {
        var key = Object.keys(store.natives)[app.themeMng.getRandomNum(5)];
        var msg = Object.keys(store.messages.greetings)[app.themeMng.getRandomNum(3)];
        var greeting = store.messages.greetings[msg][key] || msg;
        store.messages.current = {
            language: store.languages[key],
            greeting: msg,
        }
        return greeting || app.themeMng.error;
    },
    getGreeting: function (lang, greet) {
        var greeting = store.messages.greetings[greet][lang] || greet;
        return greeting || app.themeMng.error;
    },
    getRandomNum: function (int) {
        return Math.floor(Math.random()*int);
    },
    error: 'Oops, something went wrong.',
};
app.utils = {
    init: function (msg) {
        document.getElementsByTagName('body')[0].innerHTML += '<div>'+msg+'</div>';
    },
    alert: function (msg) {
        alert(msg);
    },
    load: function (src) {
        var newScript = document.createElement('script');
        newScript.src = src;
        document.getElementsByTagName('head')[0].append(newScript);
    },
};
var store = {
    'languages': {
        'EN': 'English',
        'ES': 'Spain',
        'DE': 'German',
        'FR': 'French',
        'IT': 'Italien',
    },
    'natives': {
        'EN': 'english',
        'ES': 'español',
        'DE': 'deutsch',
        'FR': 'français',
        'IT': 'italiano',
    },
    'messages': {
        'greetings': {
            'Hello world': {
                'ES': 'Hola, mundo',
                'DE': 'Hallo Welt',
                'FR': 'Bonjour le monde',
                'IT': 'Ciao mondo',
            },
            'Good night, sunshine': {
                'ES': 'Buenas noches, sol',
                'DE': 'Gute Nacht, liebe Sonne',
                'FR': 'Bonne nuit, le soleil',
                'IT': 'Buona notte, sole',
            },
            'Say hello to the moon': {
                'ES': 'Saluda a la luna',
                'DE': 'Begrüßt den Mond',
                'FR': 'Dis bonjour à la lune',
                'IT': 'Salutate la luna',
            },
        },
    },
};
