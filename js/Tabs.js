/*
Config Object
{ id : String,
  tabs : Array {
    id : String,
    label : String
  }
}
*/
function Tabs(config) {
  var id = config.id;
  var tabs = config.tabs;
  var root = document.getElementById(id);
  root.classList.add('solarchart-tabs');
  var content = makeTabs(tabs).concat(makeContent(tabs));
  appendChildren(root, content);

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
      var id = element.dataset.id;
      var index = parseInt(element.dataset.tabIndex);
      var target = root.querySelectorAll('[data-id-content="' + id + '"]');
      var content = root.querySelectorAll('[data-id-content]');
      Array.prototype.forEach.call(content, function(t) {
        t.style.display = 'none';
      })
      target[0].style.display = 'block';
      var inner = target[0].querySelectorAll('.solarchart-tab-content-inner')[0]
      tabs[index].callback(inner);
  }

  // Array Tabs -> Array AElements
  function makeTabs(tabs) {
    return tabs.reduce(function(acc, tab, index) {
      var link = document.createElement('a');
      link.setAttribute('href', 'javascript:void(0);');
      link.setAttribute('data-tab-index', index);
      link.classList.add('solarchart-tab')
      link.innerText = tab.label;
      link.setAttribute('data-id', tab.id);
      link.addEventListener('click', function(event) {
        clickHandler(link, event);
      })
      acc.push(link);
      return acc;
    }, []);
  }

}
