/*
Config Object
{ selector : DomSelector,
  tabs : Array {
    id : String,
    label : String
  }
}
*/
export default function Tabs(config) {
  var selector = config.selector;

  var tabs = config.tabs.map(function(tab, index) {
    tab.id = tab.id || "tab" + index;
    return tab; 
  });
  var root = document.querySelector(selector);
  if (!root) {
    throw new Error('Could not find Tab root using selector "' + selector + '"')
  }
  root.classList.add('solarchart-tabs');

  var header = document.createElement('div');
  header.classList.add('solarchart-header');
  appendChildren(header, makeTabs(tabs));
  var content = makeTabs(tabs).concat();
  appendChildren(root, [header, makeContent(tabs)]);

  var firstContent = root.querySelectorAll('[data-index="0"]')[0]
  var innerContent = firstContent.querySelectorAll('.solarchart-tab-content-inner')
  tabs[0].callback(innerContent[0]);


  // Element -> Array Element -> Eff(HTML)
  function appendChildren(root, children) {
    children.forEach(function(child) {
      root.appendChild(child);
    })
  }

  function makeContent(tabs) {
    var root = document.createElement('div');
    root.classList.add('solarchart-tab-content-wrapper');
    var t = tabs.reduce(function(acc, tab, index) {
      var div = document.createElement('div');
      div.setAttribute('data-index', index);
      var content = document.createElement('div');
      content.setAttribute('class', 'solarchart-tab-content-inner');
      div.appendChild(content);
      div.classList.add('solarchart-tab-content')
      div.setAttribute('data-id-content', tab.id);
      if (index == 0) {
        div.setAttribute('style', 'display:block;')
      } else {
        div.setAttribute('style', 'display:none;')
      }
      // content.innerText = index;
      acc.push(div);
      return acc;
    }, []);
    appendChildren(root, t);
    return root;
  }


  function clickHandler(element, event) {
      element.classList.add('active');

      var link = element.querySelector('a');

      var id = element.dataset.id;
      var index = parseInt(element.dataset.tabIndex);
      var target = root.querySelector('[data-id-content="' + id + '"]');
      var content = root.querySelectorAll('[data-id-content]');
      var otherTabs = root.querySelectorAll('div:not([data-id="' + id + '"])');
      
      var otherTabs = root.querySelectorAll('div:not([data-id="' + id + '"])');

      Array.prototype.forEach.call(otherTabs, function(t) {
        t.classList.remove('active');
      })

      Array.prototype.forEach.call(content, function(t) {
        t.style.display = 'none';
      })
      target.style.display = 'block';
      var inner = target.querySelectorAll('.solarchart-tab-content-inner')[0]
      tabs[index].callback(inner);
  }

  // Array Tabs -> Array AElements
  function makeTabs(tabs) {
    let t = tabs.reduce(function(acc, tab, index) {
      var outer = document.createElement('div');
      outer.classList.add('solarchart-tab');
      outer.setAttribute('data-tab-index', index);
      outer.setAttribute('data-id', tab.id);

      var link = document.createElement('a');
      link.setAttribute('href', 'javascript:void(0);');      
      link.innerText = tab.label;
      outer.addEventListener('click', function(event) {
        clickHandler(event.currentTarget, event);
      });

      outer.appendChild(link);
      acc.push(outer);
      return acc;
    }, []);

    t[0].classList.add('active');
    return t;
  }

}
