/*
 * Copyright (C) 2013-2014 Project Hatohol
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

var HatoholUserEditDialog = function(params) {
  var self = this;

  self.operatorProfile = params.operatorProfile;
  self.user = params.targetUser;
  self.succeededCallback = params.succeededCallback;
  self.userRolesData = null;
  self.usersData = null;
  self.windowTitle = self.user ? gettext("EDIT USER") : gettext("ADD USER");
  self.applyButtonTitle = self.user ? gettext("APPLY") : gettext("ADD");

  var dialogButtons = [{
    text: self.applyButtonTitle,
    click: applyButtonClickedCb
  }, {
    text: gettext("CANCEL"),
    click: cancelButtonClickedCb
  }];

  // call the constructor of the super class
  var dialogAttrs = { width: "auto" };
  HatoholDialog.apply(
    this, ["user-edit-dialog", self.windowTitle, dialogButtons, dialogAttrs]);

  // set initial state
  if (self.user)
    self.setUser(self.user);
  self.setApplyButtonState(false);
  self.loadUserRoles();

  //
  // Dialog button handlers
  //
  function applyButtonClickedCb() {
    if (validateParameters()) {
      makeQueryData();
      if (self.user)
        hatoholInfoMsgBox(gettext("Now updating the user ..."));
      else
        hatoholInfoMsgBox(gettext("Now creating a user ..."));
      postAddUser();
    }
  }

  function cancelButtonClickedCb() {
    self.closeDialog();
  }

  $("#editUserRoles").click(function() {
    new HatoholUserRolesEditor({
      operatorProfile: self.operatorProfile,
      changedCallback: function() {
        self.loadUserRoles();
      }
    });
  });

  function makeQueryData() {
    var queryData = {};
    var password = $("#editPassword").val();
    queryData.name = $("#editUserName").val();
    if (password)
      queryData.password = password;
    queryData.flags = getFlags();
    return queryData;
  }

  function postAddUser() {
    var url = "/user";
    if (self.user)
      url += "/" + self.user.userId;
    new HatoholConnector({
      url: url,
      request: self.user ? "PUT" : "POST",
      data: makeQueryData(),
      replyCallback: replyCallback,
      parseErrorCallback: hatoholErrorMsgBoxForParser
    });
  }

  function replyCallback(reply, parser) {
    self.closeDialog();
    if (self.user)
      hatoholInfoMsgBox(gettext("Successfully updated."));
    else
      hatoholInfoMsgBox(gettext("Successfully created."));

    if (self.succeededCallback)
      self.succeededCallback();
  }

  function validateParameters() {
    var flags = $("#selectUserRole").val();

    if ($("#editUserName").val() == "") {
      hatoholErrorMsgBox(gettext("User name is empty!"));
      return false;
    }
    if (!self.user && $("#editPassword").val() == "") {
      hatoholErrorMsgBox(gettext("Password is empty!"));
      return false;
    }
    if (isNaN(flags) || flags < 0 || flags > hatohol.ALL_PRIVILEGES) {
      hatoholErrorMsgBox(gettext("Invalid user role!"));
      return false;
    }
    return true;
  }

  function getFlags() {
    var flags = $("#selectUserRole").val();
    return parseInt(flags);
  }
};

HatoholUserEditDialog.prototype = Object.create(HatoholDialog.prototype);
HatoholUserEditDialog.prototype.constructor = HatoholUserEditDialog;

HatoholUserEditDialog.prototype.hasPrivilege = function (privilege) {
  if (!this.operatorProfile)
    return false;
  return this.operatorProfile.hasFlag(privilege);
};

HatoholUserEditDialog.prototype.createMainElement = function() {
  var self = this;
  var div = $(makeMainDivHTML());
  return div;

  function canEditUserRoles() {
    return self.hasPrivilege(hatohol.OPPRVLG_CREATE_USER_ROLE) ||
      self.hasPrivilege(hatohol.OPPRVLG_UPDATE_ALL_USER_ROLE) ||
      self.hasPrivilege(hatohol.OPPRVLG_DELETE_ALL_USER_ROLE);
  };

  function makeMainDivHTML() {
    var hint = self.user ? "********" : "";
    var html = "" +
    '<div>' +
    '<label for="editUserName">' + gettext("User name") + '</label><br>' +
    '<input id="editUserName" type="text" value="" class="input-xlarge"><br>' +
    '<label for="editPassword">' + gettext("Password") + '</label><br>' +
    '<input id="editPassword" type="password" ' +
    '       placeholder="' + escapeHTML(hint) + '" ' +
    '       class="input-xlarge"><br>' +
    '<label>' + gettext("User role") + '</label><br>' +
    '<select id="selectUserRole" style="width: 12em;">' +
    '  <option value="' + hatohol.NONE_PRIVILEGE + '">' +
      gettext('Guest') + '</option>' +
    '  <option value="' + hatohol.ALL_PRIVILEGES + '" >' +
      gettext('Admin') + '  </option>' +
    '</select>';
    if (canEditUserRoles()) {
      html +=
      '<input id="editUserRoles" type="button" style="margin-left: 2px;" ' +
      '  value="' + gettext('EDIT') + '" />';
    }
    html += '</div">';
    return html;
  }
};

HatoholUserEditDialog.prototype.onAppendMainElement = function () {
  var self = this;

  $("#editUserName").keyup(function() {
    self.fixupApplyButtonState();
  });

  $("#editPassword").keyup(function() {
    self.fixupApplyButtonState();
  });

  $("#selectUserRole").change(function() {
    self.fixupApplyButtonState();
  });
};

HatoholUserEditDialog.prototype.setApplyButtonState = function(state) {
  var btn = $(".ui-dialog-buttonpane").find("button:contains(" +
              this.applyButtonTitle + ")");
  if (state) {
     btn.removeAttr("disabled");
     btn.removeClass("ui-state-disabled");
  } else {
     btn.attr("disabled", "disabled");
     btn.addClass("ui-state-disabled");
  }
};

HatoholUserEditDialog.prototype.fixupApplyButtonState = function() {
  var validUserName = !!$("#editUserName").val();
  var validPassword = !!$("#editPassword").val() || !!this.user;
  var state = (validUserName && validPassword);
  this.setApplyButtonState(state);
};

HatoholUserEditDialog.prototype.updateUserRolesSelector = function() {
  var i, userRoles = this.userRolesData.userRoles;
  var html = "" +
  '<option value="' + hatohol.NONE_PRIVILEGE + '">' +
    gettext("Guest") + '</option>' +
  '<option value="' + hatohol.ALL_PRIVILEGES + '">' +
    gettext("Admin") + '</option>';

  for (i = 0; i < userRoles.length; i++) {
    html +=
    '<option value="' + escapeHTML(userRoles[i].flags) + '">' +
    escapeHTML(userRoles[i].name) +
    '</option>';
  }

  $("#selectUserRole").html(html);
};

HatoholUserEditDialog.prototype.updateUserFlagsSelector = function() {
  var i, targetId, self = this;
  if (!self.user)
    return;

  targetId = self.user.userId;
  for (i = 0; i < self.usersData.users.length; ++i) {
    if (targetId == self.usersData.users[i].userId) {
      self.user = self.usersData.users[i];
      $("#selectUserRole").val(self.user.flags);
      return;
    }
  }
};

HatoholUserEditDialog.prototype.loadUserRoles = function() {
  var self = this;
  new HatoholConnector({
    url: "/user-role",
    request: "GET",
    data: {},
    replyCallback: function(userRolesData, parser) {
      self.userRolesData = userRolesData;
      self.updateUserRolesSelector(userRolesData);
      if (self.user)
        self.loadUsers();
    },
    parseErrorCallback: hatoholErrorMsgBoxForParser,
    connectErrorCallback: function(XMLHttpRequest, textStatus, errorThrown) {
      var errorMsg = "Error: " + XMLHttpRequest.status + ": " +
                     XMLHttpRequest.statusText;
      hatoholErrorMsgBox(errorMsg);
    }
  });
};

HatoholUserEditDialog.prototype.loadUsers = function() {
  var self = this;
  new HatoholConnector({
    url: "/user",
    request: "GET",
    data: {},
    replyCallback: function(usersData, parser) {
      self.usersData = usersData;
      self.updateUserFlagsSelector(usersData);
    },
    parseErrorCallback: hatoholErrorMsgBoxForParser,
    connectErrorCallback: function(XMLHttpRequest, textStatus, errorThrown) {
      var errorMsg = "Error: " + XMLHttpRequest.status + ": " +
                     XMLHttpRequest.statusText;
      hatoholErrorMsgBox(errorMsg);
    }
  });
};

HatoholUserEditDialog.prototype.setUser = function(user) {
  this.user = user;
  $("#editUserName").val(this.user.name);
  $("#editPassword").val("");
  $("#selectUserRole").val(this.user.flags);
  this.fixupApplyButtonState();
};
