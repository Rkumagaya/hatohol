/*
 * Copyright (C) 2013 Project Hatohol
 *
 * This file is part of Hatohol.
 *
 * Hatohol is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License, version 3
 * as published by the Free Software Foundation.
 *
 * Hatohol is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Hatohol. If not, see
 * <http://www.gnu.org/licenses/>.
 */

/**
 * Show a message box.
 *
 * @param msg
 * A message string.
 * 
 * @param param
 * A parameter object. Available elements are the following.
 *
 * title:
 * A title string. If this is undefined, the title is not shown.
 *
 * buttons:
 * A button definition array passed to jQuery dialog. If this is undefined,
 * a default button labeled 'CLOSE' (or the translated word) is shown.
 *
 * defaultButtonLabel:
 * A label on the default button. If the above 'buttons' is specified,
 * this parameter is not used.
 *
 * id:
 * An ID of the dialog. If the dialog with 'id' exists, it is reused.
 * For example, a displayed message is replaced.
 *
 */
var HatoholMessageBox = function(msg, param) {

  var self = this;

  var id = getId();
  self.msgDivId = "#" + id;
  var msgDiv = $(self.msgDivId)[0];
  if (!msgDiv) {
    var div = "<div id='" + id + "'></div>";
    $("body").append(div);
    msgDiv = $(self.msgDivId)[0];
  }
  $(msgDiv).text(msg);

  if (param && param.optionMessages) {
    var optionMessageHTML = "<ul><li>";
    optionMessageHTML += escapeHTML(param.optionMessages);
    optionMessageHTML += "</li></ul>";
    $(msgDiv).append($(optionMessageHTML));
  }

  self.title = getTitle();
  self.buttons = getButtons();
  $(self.msgDivId).dialog({
    autoOpen: false,
    title: self.title,
    closeOnEscape: false,
    modal: true,
    buttons: self.buttons,
    open: function(event, ui){
      var titleBar = self.getTitleBar();
      titleBar.children(".ui-dialog-titlebar-close").hide();
      if (!param || !param.title)
        titleBar.hide();
    }
  });

  $(self.msgDivId).dialog("open");
  HatoholDialogObserver.notifyCreated(id, this);

  function getId() {
    if (!param || !param.id)
      return self.getDefaultId();
    return param.id;
  }

  function getTitle() {
    if (!param || !param.title)
      return self.getDefaultTitleString();
    return param.title;
  }

  function getButtons() {
    if (!param || !param.buttons)
      return getDefualtButtons();
    return param.buttons;
  }

  function getDefaultButtonLabel() {
    if (!param || !param.defaultButtonLabel)
      return self.getDefaultButtonLabel();
    return param.defaultButtonLabel;
  }

  function getDefualtButtons(label) {
    if (!label)
      label = getDefaultButtonLabel();
    return [{
      text: label,
      click: function() { self.destroy(); }
    }];
  }
};

HatoholMessageBox.prototype.getDefaultId = function () {
  var DEFAULT_ID = "hatohol-message-box";
  return DEFAULT_ID;
};

HatoholMessageBox.prototype.getDefaultButtonLabel = function () {
  var DEFAULT_LABEL = gettext("CLOSE");
  return DEFAULT_LABEL;
};

HatoholMessageBox.prototype.getDefaultTitleString = function () {
    var DEFAULT_TITLE_BAR_STRING = gettext("MessageBox");
    return DEFAULT_TITLE_BAR_STRING;
};

HatoholMessageBox.prototype.getMessage = function () {
  return $(this.msgDivId).text();
};

HatoholMessageBox.prototype.getTitleBar = function () {
  return $(this.msgDivId).siblings(".ui-dialog-titlebar");
};

HatoholMessageBox.prototype.getTitleString = function () {
  return this.title;
};

HatoholMessageBox.prototype.isTitleBarVisible = function () {
  return this.getTitleBar().is(":visible");
};

HatoholMessageBox.prototype.getButtons = function () {
  return this.buttons;
};

HatoholMessageBox.prototype.getBuiltinNoYesButtons = function () {
  var button = [{
    text: gettext("NO"),
    click: function() {
      $(this).dialog("close");
    }
  }, {
    text: gettext("YES"),
    click: function() {
    }
  }];
  // return a copy so that caller can modify the button.
  return jQuery.extend(true, [], button);
};

HatoholMessageBox.prototype.destroy = function() {
  $(this.msgDivId).dialog("destroy");
  $(this.msgDivId).remove();
};

function hatoholInfoMsgBox(msg, userParam) {
  var param = {title: gettext("Information")};
  if (userParam)
    $.extend(param, userParam);
  new HatoholMessageBox(msg, param);
};

function hatoholWarnMsgBox(msg, userParam) {
  var param = {title: gettext("Warning")};
  if (userParam)
    $.extend(param, userParam);
  new HatoholMessageBox(msg, param);
};

function hatoholErrorMsgBox(msg, userParam) {
  var param = {title: gettext("Error")};
  if (userParam)
    $.extend(param, userParam);
  new HatoholMessageBox(msg, param);
};

function hatoholNoYesMsgBox(msg, yesCallback) {
  var buttons = HatoholMessageBox.prototype.getBuiltinNoYesButtons();
  buttons[1].click = yesCallback;
  var param = {title: gettext("Question"), buttons: buttons};
  new HatoholMessageBox(msg, param);
};

function hatoholMsgBoxForParser(reply, parser) {
  var msg = parser.getMessage();
  if (!msg)
    msg = gettext("Failed to parse the received packet.");
  hatoholErrorMsgBox(msg, {optionMessages: parser.optionMessages});
};

function hatoholErrorMsgBoxForParser(reply, parser) {
  hatoholMsgBoxForParser(reply, parser);
};
