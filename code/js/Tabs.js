import Mustache from 'mustache';
/*
Config Object
{ selector : String,
  tabs : Array {
    id: String,
    display: String,
    label: String,
    callback : Function (div.solarchart-tab-content-inner)
  }
}
*/

export default function Tabs(config) {

  // Index the tab's callbacks by their ids
  var callbackMap = config.tabs.reduce(function(acc, tab) {
    acc[tab.id] = tab.callback;
    return acc;
  }, {});

  var btnTemplate = document.getElementById('template--btn').innerHTML,
    chartTemplate = document.getElementById('template--chart').innerHTML,
    btnsRendered = Mustache.render(btnTemplate, { tabs : config.tabs }),
    chartsRendered = Mustache.render(chartTemplate, { tabs : config.tabs }),
    firstTabId = config.tabs[0].id,
    root = document.getElementById('charts');

  document.querySelector('.solarchart-tabs').innerHTML = btnsRendered;
  root.innerHTML = chartsRendered;

  makeTabs();

  // Activate the first tab
  showHideChart(firstTabId);
  callbackMap[firstTabId](getInnerContentForChart(firstTabId));

  // Array Tabs -> Array AElements
  function makeTabs() {
    var chartToggleElems = document.querySelectorAll('.solarchart-tab.button'),
      anchor;

    for (var i = 0, max = chartToggleElems.length; i < max; i += 1) {
      anchor = chartToggleElems[i];

      anchor.addEventListener('click', handleClick);
    }
  }

  // ChartID -> Element
  function getInnerContentForChart(chartId) {
    return root.querySelector('.solarchart-tab-content[data-chart-id="' + chartId + '"] .solarchart-tab-content-inner');
  }

  // Handle a tab click
  // event :: ClickEvent
  function handleClick(event) {
    var chartId = event.target.dataset.chartId;
    showHideChart(chartId);
    callbackMap[chartId](getInnerContentForChart(chartId));
  }

  // Show the tab and content for a particular chartId
  // and hide the others.
  // chartId :: String
  function showHideChart(chartId) {
    var allChartElems = document.querySelectorAll('.solarchart-tab-content'),
      allChartButtons = document.querySelectorAll('.solarchart-tab.button');

    for (var i = 0; i < allChartElems.length; i++) {
      let chartElem = allChartElems[i];
      
      if (chartElem.dataset.chartId !== chartId) {
        chartElem.style.display = 'none';
      } else {        
        chartElem.style.display = 'block';
      }
    }

    for (var i = 0; i < allChartButtons.length; i++) {
      let chartButton = allChartButtons[i];

      if (chartButton.dataset.chartId !== chartId) {
        chartButton.classList.add('active');
      } else {        
        chartButton.classList.remove('active');
      }
    }   

  }
}

// export default function Tabs(config) {

//   var btnTemplate = document.getElementById('template--btn').innerHTML,
//     chartTemplate = document.getElementById('template--chart').innerHTML,
//     btnsRendered = Mustache.render(btnTemplate, config),
//     chartsRendered = Mustache.render(chartTemplate, config);

//   var selector = config.selector;

//   var tabs = config.tabs.map(function(tab, index) {
//     tab.id = tab.id || "tab" + index;
//     return tab; 
//   });
//   var root = document.querySelector(selector);
//   if (!root) {
//     throw new Error('Could not find Tab root using selector "' + selector + '"')
//   }
//   root.classList.add('solarchart-tabs');

//   var header = document.createElement('div');
//   header.classList.add('solarchart-header');
//   appendChildren(header, makeTabs(tabs));
//   var content = makeTabs(tabs).concat();
//   appendChildren(root, [header, makeContent(tabs)]);

//   var firstContent = root.querySelectorAll('[data-index="0"]')[0]
//   var innerContent = firstContent.querySelectorAll('.solarchart-tab-content-inner')
//   tabs[0].callback(innerContent[0]);


//   // Element -> Array Element -> Eff(HTML)
//   function appendChildren(root, children) {
//     children.forEach(function(child) {
//       root.appendChild(child);
//     })
//   }

//   function makeContent(tabs) {

//     var root = document.createElement('div');
//     root.classList.add('solarchart-tab-content-wrapper');
//     var t = tabs.reduce(function(acc, tab, index) {
//       var div = document.createElement('div');
//       div.setAttribute('data-index', index);
//       var content = document.createElement('div');
//       content.setAttribute('class', 'solarchart-tab-content-inner');
//       div.appendChild(content);
//       div.classList.add('solarchart-tab-content')
//       div.setAttribute('data-id-content', tab.id);
//       if (index == 0) {
//         div.setAttribute('style', 'display:block;')
//       } else {
//         div.setAttribute('style', 'display:none;')
//       }
//       // content.innerText = index;
//       acc.push(div);
//       return acc;
//     }, []);
//     appendChildren(root, t);
//     return root;
//   }


//   function clickHandler(element, event) {
//       element.classList.add('active');

//       var link = element.querySelector('a');

//       var id = element.dataset.id;
//       var index = parseInt(element.dataset.tabIndex);
//       var target = root.querySelector('[data-id-content="' + id + '"]');
//       var content = root.querySelectorAll('[data-id-content]');
//       var otherTabs = root.querySelectorAll('div:not([data-id="' + id + '"])');
      
//       var otherTabs = root.querySelectorAll('div:not([data-id="' + id + '"])');

//       Array.prototype.forEach.call(otherTabs, function(t) {
//         t.classList.remove('active');
//       })

//       Array.prototype.forEach.call(content, function(t) {
//         t.style.display = 'none';
//       })
//       target.style.display = 'block';
//       var inner = target.querySelectorAll('.solarchart-tab-content-inner')[0]
//       tabs[index].callback(inner);
//   }

//   // Array Tabs -> Array AElements
//   function makeTabs(tabs) {
//     let t = tabs.reduce(function(acc, tab, index) {
//       var outer = document.createElement('div');
//       outer.classList.add('solarchart-tab');
//       outer.setAttribute('data-tab-index', index);
//       outer.setAttribute('data-id', tab.id);

//       var link = document.createElement('a');
//       link.setAttribute('href', 'javascript:void(0);');      
//       link.innerText = tab.label;
//       outer.addEventListener('click', function(event) {
//         clickHandler(event.currentTarget, event);
//       });

//       outer.appendChild(link);
//       acc.push(outer);
//       return acc;
//     }, []);

//     t[0].classList.add('active');
//     return t;
//   }

// }
