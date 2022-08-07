(function (app) {
    app.stringifiedReferenceHandler = {
        endings: {"'":"'","[":"]","{":"}","(":")"},
        parse: function (value) {
            if (value.match(/^(true|false)$/)) {
                return value === 'true';
            }
            if (!isNaN(value)) {
                return Number(value);
            }
            var self = app.stringifiedReferenceHandler;
            var regExp = /([(?<!\\)'\.|\,|\(|\)|\[|\]|\{|\}])|([^(?<!\\)'\.|\,|\(|\)|\[|\]|\{|\}]+)/g;
            var matches = value.match(regExp);
            var obj = window;
            var index = 0;
            while (obj && matches[index]) {
                var chunk = matches[index++];
                if ((/^'|\.|\(|\[|\{$/).test(chunk)) {
                    if (index === 1) {
                        obj = null;
                    }
                    if (chunk !== '.') {
                        var branch = self.getBranch(matches, index - 1);
                        index = branch.index;
                    }
                }
                switch (chunk) {
                    case "'":
                        obj = branch.str.replace('\\','');
                        break;
                    case '{':
                        if (branch.str) {
                            try {
                                obj = JSON.parse('{' + branch.str.replace(/(?<!\\)'/g,'"') + '}');
                            }
                            catch {
                                return undefined
                            }
                        } else {
                            obj = {};
                        }
                        break;
                    case '(':
                        if (obj !== null) {
                            obj = self.execute(obj, branch.str);
                        }
                        break;
                    case '[':
                        if (branch.str) {
                            if (obj !== null) {
                                var decodedString = self.parse(branch.str);
                                obj = obj[decodedString];
                            } else {
                                obj = self.chunkStringIntoArguments(branch.str);
                            }
                        } else {
                            obj = obj === null ? [] : undefined;
                        }
                        break;
                    case '.':
                    case ' ':
                        break;
                    default:
                        if (obj) {
                            obj = obj[chunk];
                        }
                }
            }
            return obj;
        },
        execute: function (method, paramString) {
            if (typeof method != "function") {
                return undefined;
            }
            if (paramString) {
                var arguments = app.stringifiedReferenceHandler.chunkStringIntoArguments(paramString);
                if (!arguments) {
                    return undefined;
                } else {
                    return method.apply(null, arguments);
                }

            }
            return method();
        },
        chunkStringIntoArguments: function (value) {
            var self = app.stringifiedReferenceHandler;
            var regExp = /(['|\\|\.|\,|\(|\)|\[|\]|\{|\}])|([^'|\\|\.|\,|\(|\)|\[|\]|\{|\}]+)/g;
            var matches = value.match(regExp);
            var str = '';
            var index = 0;
            var arguments = [];
            var branch = {};
            while (matches[index]) {
                var chunk = matches[index++];
                if ((/^\\+$/).test(chunk) && matches[index+1].length == 1) {
                    chunk += matches[index++];
                }
                if ((/[\'|\(|\[|\{]/).test(chunk)) {
                    branch = self.getBranch(matches, index - 1);
                    index = branch.index;
                }
                switch (chunk) {
                    case '{':
                    case '(':
                    case '[':
                    case "'":
                        var end = app.stringifiedReferenceHandler.endings[chunk];
                        str += chunk + branch.str + end;
                        break;
                    case ',':
                        var arg = (index === 1) ? null : self.parse(str);
                        arguments.push(arg);
                        str = '';
                        break;
                    default:
                        str += chunk;
                }
            }
            if (str) {
                var arg = self.parse(str.trim());
                arguments.push(arg);
            }
            return arguments;
        },
        getBranch: function (matches, index) {
            var depth = 1;
            var str = '';
            var start = matches[index];
            var end = app.stringifiedReferenceHandler.endings[start];
            var quoted = false;
            if (start === "'") {
                quoted = true;
                depth = 0;
                start = undefined;
            }
            while ((depth || quoted) && matches[++index]) {
                var chunk = matches[index];
                if (!(start) && (/^\(|\[|\{$/).test(chunk)) {
                    start = chunk;
                    end = endings[start];
                }
                if ((/^\\+$/).test(chunk) && matches[index+1].length == 1) {
                    chunk += matches[++index];
                }
                if (chunk === start) {
                    depth += 1;
                }
                if (chunk === end) {
                    if (quoted && (end === "'")) {
                        quoted = false;
                    } else {
                        depth -= 1;
                        if (quoted && !depth) {
                            start = undefined;
                            end = "'";
                        }
                    }
                }
                if (depth || quoted) {
                    str += chunk;
                }
            }
            if (depth) {
                return {
                    str: undefined,
                    index: index
                };
            }
            return {
                str: str,
                index: index + 1
            };
        }
    }
})((window.app = window.app || {}));
