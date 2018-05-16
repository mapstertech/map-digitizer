import $ from 'jquery';

$.redirect = function (url, values, method, target, traditional, redirectTop) {
    redirectTop = redirectTop || false;
    var generatedForm = $.redirect.getForm(url, values, method, target, traditional);
    $('body', redirectTop ? window.top.document : undefined).append(generatedForm.form);
    generatedForm.submit();
};


$.redirect.getForm = function (url, values, method, target, traditional) {
    method = (method && ["GET", "POST", "PUT", "DELETE"].indexOf(method.toUpperCase()) !== -1) ? method.toUpperCase() : 'POST';

    url = url.split("#");
    var hash = url[1] ? ("#" + url[1]) : "";
    url = url[0];

    if (!values) {
        var obj = $.parseUrl(url);
        url = obj.url;
        values = obj.params;
    }

    values = removeNulls(values);

    var form = $('<form>')
        .attr("method", method)
        .attr("action", url + hash);


    if (target) {
        form.attr("target", target);
    }

    var submit = form[0].submit;
    iterateValues(values, [], form, null, traditional);

    return { form: form, submit: function () { submit.call(form[0]); } };
}
//Utility Functions
/**
 * Url and QueryString Parser.
 * @param {string} url - a Url to parse.
 * @returns {object} an object with the parsed url with the following structure {url: URL, params:{ KEY: VALUE }}
 */
$.parseUrl = function (url) {

    if (url.indexOf('?') === -1) {
        return {
            url: url,
            params: {}
        };
    }
    var parts = url.split('?'),
        query_string = parts[1],
        elems = query_string.split('&');
    url = parts[0];

    var i, pair, obj = {};
    for (i = 0; i < elems.length; i += 1) {
        pair = elems[i].split('=');
        obj[pair[0]] = pair[1];
    }

    return {
        url: url,
        params: obj
    };
};

//Private Functions
var getInput = function (name, value, parent, array, traditional) {
    var parentString;
    if (parent.length > 0) {
        parentString = parent[0];
        var i;
        for (i = 1; i < parent.length; i += 1) {
            parentString += "[" + parent[i] + "]";
        }

        if (array) {
            if (traditional)
                name = parentString;
            else
                name = parentString + "[" + name + "]";
        } else {
            name = parentString + "[" + name + "]";
        }
    }

    return $("<input>").attr("type", "hidden")
        .attr("name", name)
        .attr("value", value);
};

var iterateValues = function (values, parent, form, isArray, traditional) {
    var i, iterateParent = [];
    Object.keys(values).forEach(function (i) {
        if (typeof values[i] === "object") {
            iterateParent = parent.slice();
            iterateParent.push(i);
            iterateValues(values[i], iterateParent, form, Array.isArray(values[i]), traditional);
        } else {
            form.append(getInput(i, values[i], parent, isArray, traditional));
        }
    });
};

var removeNulls = function (values) {
    var propNames = Object.getOwnPropertyNames(values);
    for (var i = 0; i < propNames.length; i++) {
        var propName = propNames[i];
        if (values[propName] === null || values[propName] === undefined) {
            delete values[propName];
        } else if (typeof values[propName] === 'object') {
            values[propName] = removeNulls(values[propName]);
        } else if (values[propName].length < 1) {
            delete values[propName];
        }
    }
    return values;
};
