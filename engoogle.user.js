// ==UserScript==
// @name          En Google modified by Gulfweed
// @description   Add a quick language switching feature, etc. on Google
// @include       /^https?:\/\/(www|encrypted)\.google\.(com|co\.jp)\/(webhp|ig|search|).*$/
// ==/UserScript==

// Based on En Google by http://gimite.net/
// This script is Public Domain Software.

// Includes keyboard short cut feature written by shinichiro_h
// http://d.hatena.ne.jp/shinichiro_h/20090609

(function() {  // Out most scope

var debug = false;

function logDebug(s) {
  if (!debug) {
    return;
  }

  console.log(s);
}

logDebug("Setting up engoogle.");

//
// Utility functions.
//

function getElementUniqueByName(name, ancestor) {
  var _elems = document.getElementsByName(name);
  if (!_elems) return null;
  for (var i = 0; i < _elems.length; i++) {
    if (!ancestor || (ancestor.compareDocumentPosition(_elems.item(i)) & 0x10)) {
      return _elems.item(i);
    }
  }
  return null;
}

function nParent(node, i) {
  if (node == null || i == 0) return node;
  var parent = node.parentNode;
  if (parent) return nParent(parent, i - 1);
  else return null;
}

//
// Get current language parameters.
//

var current_hl = '';
var hl_element = getElementUniqueByName('hl');
if (hl_element) {
  current_hl = hl_element.value;
} else {
  logDebug("hl not found.");
}

var current_lr = '';
var tbs_element = getElementUniqueByName('tbs');
if (tbs_element) {
  if (tbs_element.value == 'lr:lang_1ja') {
    current_lr = 'lr:lang_1ja';
    logDebug("lr is ja.");
  } else if (tbs_element.value == 'lr:lang_1en') {
    current_lr = 'lr:lang_1en';
    logDebug("lr is en.");
  } else {
    current_lr = '';
    logDebug("lr is not set.");
  }
} else {
  logDebug("tbs not found.");
}


//
// Setup internationalized strings.
//
var search_all_cap = 'Search the Web';
var search_ja_cap  = 'Search Japanese pages';
var search_en_cap  = 'Search English pages';
var ja_if_cap      = 'Use Japanese interface';
var en_if_cap      = 'Use English interface';
var code_cap       = 'Code';
var scholar_cap    = 'Scholar';
if (current_hl == 'ja') {
  search_all_cap = '\u30a6\u30a7\u30d6\u5168\u4f53\u304b\u3089\u691c\u7d22';
  search_ja_cap  = '\u65e5\u672c\u8a9e\u306e\u30da\u30fc\u30b8\u3092\u691c\u7d22';
  search_en_cap  = '\u82f1\u8a9e\u306e\u30da\u30fc\u30b8\u3092\u691c\u7d22';
  ja_if_cap      = '\u65e5\u672c\u8a9e\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30fc\u30b9';
  en_if_cap      = '\u82f1\u8a9e\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30fc\u30b9';
  code_cap       = '\u30b3\u30fc\u30c9';
  scholar_cap    = '\u8ad6\u6587';
}

//
// Customize the top menu.
//

var spans = document.getElementsByTagName('span');
for (var i = 0; i < spans.length; i++) {
  var span = spans.item(i);
  if (span.className == 'gbts' &&
      /\u52d5\u753b|Video/.exec(span.innerHTML)) {
    var group_button = span.parentNode.parentNode;
    if (group_button) {
      var code_button = document.createElement('li');
      code_button.className = 'gbt';
      code_button.innerHTML = '<a class="gbzt" id="gb_10000" href="http://www.google.com/codesearch' + document.location.search + '"><span class="gbtb2"></span><span class="gbts">' + code_cap + '</span></a>';
      group_button.parentNode.insertBefore(code_button, group_button.nextSibling);

      var scholar_button = document.createElement('li');
      scholar_button.className = 'gbt';
      scholar_button.innerHTML = '<a class="gbzt" id="gb_10000" href="http://scholar.google.com/scholar' + document.location.search + '"><span class="gbtb2"></span><span class="gbts">' + scholar_cap + '</span></a>';
      group_button.parentNode.insertBefore(scholar_button, group_button.nextSibling);
    }
  }
}

var add_radios = function() {
  var elgoogne = document.getElementById('elgoogne');
  if (elgoogne) {
    logDebug("elgoogne found. Removing.");
    elgoogne.parentNode.removeChild(elgoogne);
  } else {
    logDebug("elgoogne not found.");
  }

  var labels = document.getElementsByTagName('label');
  for (var i = 0; i < labels.length; i++) {
    var label = labels.item(i);
    var html_for = label.htmlFor;
    if (html_for && html_for == 'il') {
      label.parentNode.removeChild(label);
    }
  }

  if (!document.getElementById('po-tg')) {
    var button_html =
      '<input id="all" name="engoogle_lr" value="" type="radio"' + (current_lr == '' ? ' checked' : '') + '>' +
      '<label for="all"> ' + search_all_cap + ' </label>' +
      '<input id="il_ja" name="engoogle_lr" value="lr:lang_1ja" type="radio"' + (current_lr == 'lr:lang_1ja' ? ' checked' : '') + '>' +
      '<label for="il_ja"> ' + search_ja_cap + ' </label>' +
      '<input id="il_en" name="engoogle_lr" value="lr:lang_1en" type="radio"' + (current_lr == 'lr:lang_1en' ? ' checked' : '') + '>' +
      '<label for="il_en"> ' + search_en_cap + ' </label>' +
      '<br>' +
      '<input id="hl_ja" name="engoogle_hl" value="ja" type="radio"' + (current_hl == 'ja' ? ' checked' : '') + '>' +
      '<label for="hl_ja"> ' + ja_if_cap + ' </label>' +
      '<input id="hl_en" name="engoogle_hl" value="en" type="radio"' + (current_hl == 'en' ? ' checked' : '') + '>' +
      '<label for="hl_en"> ' + en_if_cap + ' </label>';

    var b = document.getElementById('center_col');
    if (b) {
      var span = document.createElement('span');
      span.setAttribute('id', 'elgoogne');
      span.innerHTML = '<font size=-1>' + button_html + '</font></span>';
      b.insertBefore(span, b.firstChild);
    } else {
      logDebug("center_col not found. Looking for q.");

      var q = getElementUniqueByName('q');
      b = q ? nParent(q, 5) : null;
      if (b) {
        var tab = document.createElement('table');
        tab.setAttribute('cellpadding', 0);
        tab.setAttribute('cellspacing', 0);
        tab.setAttribute('border', 0);
        tab.setAttribute('id', 'elgoogne');
        tab.innerHTML = '<tr><td><font size=-1>' + button_html + ' </font></td></tr>' +
          '<tr><td height=7><img width=1 height=1 alt=""></td></tr>';
        b.parentNode.insertBefore(tab, b.nextSibling);
      } else {
        logDebug("q not found.");
      }
    }
  } else {
    logDebug("po-tg found.");
  }


  var gs_elem = getElementUniqueByName('gs');
  if (!gs_elem) {
    logDebug("gs not found. Looking for gbqf.");

    gs_elem = document.getElementById('gbqf');
  }

  if (gs_elem) {
    var tophf = document.getElementById('tophf');
    if (!tophf) {
      tophf = gs_elem;
    } else {
      logDebug("tophf not found.");
    }

    var gs_hidden_hl = getElementUniqueByName('hl', gs_elem);
    if (!gs_hidden_hl) {
      if (tophf) {
        tophf.innerHTML += '<input type="hidden" name="hl">';
      }
    }
    var gs_hidden_lr = getElementUniqueByName('lr', gs_elem);
    if (!gs_hidden_lr) {
      if (tophf) {
        tophf.innerHTML += '<input type="hidden" name="lr">';
      }
    }
    var gs_hidden_tbs = getElementUniqueByName('tbs', gs_elem);
    if (!gs_hidden_tbs) {
      if (tophf) {
        tophf.innerHTML += '<input type="hidden" name="tbs">';
      }
    }

    var hl_radios = ['hl_ja', 'hl_en'];
    for (var i in hl_radios) {
      var radio = document.getElementById(hl_radios[i]);
      if (!radio) return;

      var gs_hidden_hl = getElementUniqueByName('hl', gs_elem);
      if (radio.checked && gs_hidden_hl) {
        gs_hidden_hl.value = radio.value;
      }

      var handler = function(event) {
        var gs_hidden_hl = getElementUniqueByName('hl', gs_elem);
        if (gs_hidden_hl) {
          gs_hidden_hl.value = event.target.value;
        }

        var q = getElementUniqueByName('q');
        if (q.value) {
          gs_elem.submit();
        }
      };

      radio.addEventListener('click', handler, false);
    }

    var tbs_radios = ['all', 'il_en', 'il_ja'];
    for (var i in tbs_radios) {
      var radio = document.getElementById(tbs_radios[i]);
      if (!radio) return;

      if (radio.checked) {
        var new_tbs = radio.value;
        var new_lr = '';
        if (new_tbs == 'lr:lang_1ja') {
          new_lr = 'lang_ja';
        } else if (new_tbs == 'lr:lang_1en') {
          new_lr = 'lang_en';
        }

        var gs_hidden_lr = getElementUniqueByName('lr', gs_elem);
        var gs_hidden_tbs = getElementUniqueByName('tbs', gs_elem);
        if (gs_hidden_lr) {
          gs_hidden_lr.value = new_lr;
        }
        if (gs_hidden_tbs) {
          gs_hidden_tbs.value = new_tbs;
        }
      }

      var handler = function(event) {
        var new_tbs = event.target.value;
        var new_lr = '';
        if (new_tbs == 'lr:lang_1ja') {
          new_lr = 'lang_ja';
        } else if (new_tbs == 'lr:lang_1en') {
          new_lr = 'lang_en';
        }

        var gs_hidden_lr = getElementUniqueByName('lr', gs_elem);
        var gs_hidden_tbs = getElementUniqueByName('tbs', gs_elem);
        if (gs_hidden_lr) {
          gs_hidden_lr.value = new_lr;
        }
        if (gs_hidden_tbs) {
          gs_hidden_tbs.value = new_tbs;
        }

        var q = getElementUniqueByName('q');
        if (q.value) {
          gs_elem.submit();
        }
      };

      radio.addEventListener('click', handler, false);
    }

    if (!("chrome" in window && "extension" in chrome)) return;

    var keys = [];
    var port = chrome.extension.connect();
    port.onMessage.addListener(function(k) {
      keys = k;
    });

    var key_events = [
      ["all"], ["il_ja"],  ["il_en"], ["hl_ja"], ["hl_en"],
      ["all", "hl_ja"], ["all", "hl_en"],
      ["il_ja", "hl_ja"], ["il_ja", "hl_en"],
      ["il_en", "hl_ja"], ["il_en", "hl_en"]
    ];

    var handler = function(event) {
      // We don't want to interfere with regular user typing
      if (event.target && event.target.nodeName) {
        var target_node_name = event.target.nodeName.toLowerCase();
        if (target_node_name == "textarea" ||
            (target_node_name == "input" && event.target.type &&
             event.target.type.toLowerCase() == "text")) {
          return false;
        }
      }

      var c = event.keyCode;
      if (event.shiftKey) c |= 128;
      if (event.ctrlKey) c |= 256;

      var changed = false;
      var last_radio = null;
      for (var i = 0; i < keys.length; i++) {
        var a = keys[i].split(" ");
        if (a[1] == c) {
          var ids = key_events[i];
          for (var j = 0; j < ids.length; j++) {
            var radio = document.getElementById(ids[j]);
            radio.checked = true;
            changed = true;
            last_radio = radio
          }
        }
      }
      if (changed) {
        last_radio.click();
        return true;
      }
      return false;
    };
    window.addEventListener('keypress', handler, true);
  } else {
    logDebug("gbqf not found.");
  }
};

window.addEventListener('hashchange', function() {
  add_radios();
}, false);

add_radios();

})();  // Out most scope
