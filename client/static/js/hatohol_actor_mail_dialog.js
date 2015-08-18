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

var HatoholActorMailDialog = function(applyCallback, currCommand) {
  var self = this;
  self.applyCallback = applyCallback;
  self.currCommand = currCommand;

  var dialogButtons = [{
    text: gettext("APPLY"),
    click: function() { self.okButtonClicked() },
  }, {
    text: gettext("CANCEL"),
    click: function() { self.closeDialog(); },
  }];

  // call the constructor of the super class
  var id = "hatohol_actor_mail_dialog";
  var title = gettext("Execution parameter maker");
  var dialogAttrs = { width: "auto" };
  HatoholDialog.apply(this, [id, title, dialogButtons, dialogAttrs]);

  if ($("#inputTo").val())
    self.setApplyButtonState(true);
  else
    self.setApplyButtonState(false);
};

HatoholActorMailDialog.prototype = Object.create(HatoholDialog.prototype);
HatoholActorMailDialog.prototype.constructor = HatoholActorMailDialog;

HatoholActorMailDialog.prototype.createMainElement = function() {
  var initParams = parseCurrentCommand(this.currCommand);
  var div = $(makeMainDivHTML(initParams));
  return div;

  function parseCurrentCommand(currCommand) {
    var params = {};
    params.toAddr = "";
    params.smtpServer = "";
    var words = currCommand.split(" ");
    if (words.length < 3)
      return params;
    if (words[0] != "hatohol-actor-mail")
      return params;

    // to addr
    var idx = words.indexOf("--to-address");
    if (idx != -1 && words.length > idx + 1)
      params.toAddr = words[2];

    // smtp server
    var idx = words.indexOf("--smtp-server");
    if (idx != -1 && words.length > idx + 1)
      params.smtpServer = words[idx + 1];
    return params;
  }

  function makeMainDivHTML(initParams) {
    var s = "";
    s += '<form class="form-inline">';
    s += '  <label for="inputTo">' + gettext("TO: ") + '</label><br>';
    s += '  <input id="inputTo" type="text" value="' + initParams.toAddr +
         '" class="input-xxlarge" style="width:100%;" >';
    s += '</form>';
    s += '<form class="form-inline">';
    s += '  <label for="inputSmtpServer">' + gettext("SMTP server ") + '</label>';
    s += '  <label for="inputSmtpServer">' + gettext("(If empty, localhost is used)") + '</label>';
    s += '  <br>';
    s += '  <input id="inputSmtpServer" type="text" value="' +
         initParams.smtpServer +
         '" class="input-xxlarge" style="width:100%;" >';
    s += '</form>';
    return s;
  }
};

HatoholActorMailDialog.prototype.onAppendMainElement = function () {
  var self = this;

  $("#inputTo").keyup(function() {
    if ($("#inputTo").val())
      self.setApplyButtonState(true);
    else
      self.setApplyButtonState(false);
  });
};

HatoholActorMailDialog.prototype.okButtonClicked = function() {
  var toAddr = "--to-address " + $("#inputTo").val();
  var commandDesc = "hatohol-actor-mail " + toAddr;
  var smtpServer = $("#inputSmtpServer").val();
  if (smtpServer)
    commandDesc += " --smtp-server " + smtpServer;

  this.applyCallback(hatohol.ACTION_COMMAND, commandDesc);
  this.closeDialog();
};

HatoholActorMailDialog.prototype.setApplyButtonState = function(state) {
  var btn = $(".ui-dialog-buttonpane").find("button:contains(" +
              gettext("APPLY") + ")");
  if (state) {
     btn.removeAttr("disabled");
     btn.removeClass("ui-state-disabled");
  } else {
     btn.attr("disabled", "disable");
     btn.addClass("ui-state-disabled");
  }
};
