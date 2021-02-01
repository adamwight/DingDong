// ==UserScript==
// @name        DingDong
// @namespace   wmde.tictac
// @include     https://tictac.wikimedia.de/*
// @version     1
// @grant       none
// ==/UserScript==

(function () {
  function showDOW () {
    /* Show the date of the week and highlight weekends */
    var timestring = document.querySelectorAll('.oe_datepicker_root')[1].textContent
    var element = document.querySelector('.oe_datepicker_root')
    var date = new Date(Date.parse(timestring))
    if (isNaN(date) || date.getFullYear() < 2020) {
      return
    }
    if (date.getDay() === 0) {
      element.style.color = '#E00'
      element.style.fontWeight = 'bold'
    } else if (date.getDay() === 6) {
      element.style.color = ''
      element.style.fontWeight = 'bold'
    } else {
      element.style.color = ''
      element.style.fontWeight = ''
    }
    element.textContent = date.toLocaleDateString([], { dateStyle: 'full' })
  }

  function quickEdit () {
    /* Go into edit mode if user clicks on table */
    var table = document.querySelector('#notebook_page_14')
    // Disabling the current action seems to be not necessary
    // $(table).off('click')
    if (table !== null) {
      table.onclick = function () { document.querySelector('.oe_button.oe_form_button_edit').click() }
    }
  }

  function install () {
    showDOW()
    quickEdit()
    var blocker = document.querySelector('.oe_loading')
    observer.observe(blocker, { attributes: true })
  }

  var observer = new MutationObserver(function () { // eslint-disable-line no-undef
    install()
  })

  window.onhashchange = install
  showDOW()
  quickEdit()
})()
