# Stringified Reference Handler

The stringifiedReferenceHandler provides an oportunity to reference pointers, getters and calls with (perhaps temporary) values at runtime to objects or methods that may not exist at its definition - and do so as traceably as possible. Of course, it is important that they can be successfully resolved when the referenced object becomes visible. But it is just as important that no exception is thrown if the attempt fails.

If a pointer or call is converted into a string by simply enclosing it in quotes, its mission is perfectly understandable. But the runtime environment cannot interpret it as a pointer/getter/call, which in this case is the perfect protection against null pointer exceptions. If strings contained therein are enclosed in single quotes, the entire literal is JSON-compliant and can also be exchanged via this format.

The main function of the stringifiedReferenceHandler is a parser, that chunks a passed string into an array by using the JavaScript-typical delimiters. Starting with the top level object (window) as parent reference, one after another chunk in this array get checked whether it points to a child of the parent reference and which type it corresponds to. If the pointer can't be resolved, the process is aborted and an undefined is returned, otherwise the process is continued with the detected child as parent reference. If the method could be processed through to the deepest reference, the last determined value is returned.

This parser works with deep nested pointers witch also can contain deep nested pointers. It can handels objects, arrays, functions, strings, numbers and booleans. 

Apostrophes contained in strings must be protected by a double escape char (backslash). Double quotes are forbidden as they triggers JSON exception. No JavaScript operators are supported, because it may only resolved by the evil eval method. So, no conditions, no bit shiftings, no math oparations and so on are supported in the parse process.

Delayed functions such as setTimeout or setInterval are also not supported, as all referenced calls must be executed by the parser for evaluation at runtime. That may could be caught with a hook, but - keep it simple - delayed functions are not real references.

To see how the Stringified Reference Handler works, simply embed the app_stringifiedReferenceHandler.js script in an HTML file. The script contains a selfinvoking function that implements the stringifiedReferenceHandler as a child of window.app. If the app object does not exist, this is also created beforehand. For testing, the console can be used directly:

![console](https://github.com/Ben-zen-Berg/stringifiedReferenceHandler/blob/main/img/console.jpg)

This proves that the stringifiedReferenceHandler works correctly, but seems unspectacular, as all objects and functions involved are available at runtime. However, the script is designed to store accesses to potentially unavailable objects or functions to allow for later execution - just when they become availibility.

How this works can be demonstrated with a simple 'hello world' example, loaded with the index.html.
