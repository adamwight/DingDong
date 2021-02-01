// ==UserScript==
// @name        DingDong
// @namespace   wmde.tictac
// @include     https://tictac.wikimedia.de/*
// @include     http://tictac.wikimedia.de/*
// @version     1
// @grant       none
// ==/UserScript==
/* global openerp */

(function () {
  function showDOW () {
    /* Show the date of the week and highlight weekends */
    var isoDateElement = document.querySelector('.oe_datepicker_root.oe_form_invisible')
    if ( !isoDateElement ) {
      return
    }
    var timestring = isoDateElement.textContent;
    var element = document.querySelector('.oe_datepicker_root:not(.oe_form_invisible)')
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
    var reformattedDate = date.toLocaleDateString([],
      {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
    element.textContent = reformattedDate
  }

  function setItemDates () {
    if (!openerp || !openerp.web || !openerp.web.DateTimeWidget) {
      return
    }
    var origStart = openerp.web.DateTimeWidget.prototype.start
    openerp.web.DateTimeWidget.prototype.start = function () {
      origStart.apply(this, arguments)

      var isoDateElement = document.querySelector('.oe_datepicker_root.oe_form_invisible')
      if (!isoDateElement) {
        return
      }
      var timestring = isoDateElement.textContent
      var date = new Date(Date.parse(timestring))
      if (isNaN(date) || date.getFullYear() < 2020) {
        return
      }
      // See base implementation in odoo/addons/web/static/src/js/view_form.js
      // XXX doesn't work yet
      this.picker('setDate', date)
      this.set_value(timestring)
    }
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
    setItemDates()
    quickEdit()
    var blocker = document.querySelector('.oe_loading')
    observer.observe(blocker, { attributes: true })
  }

  var observer = new MutationObserver(function () { // eslint-disable-line no-undef
    install()
  })

  window.onhashchange = install
  showDOW()
  setItemDates()
  quickEdit()
})()
