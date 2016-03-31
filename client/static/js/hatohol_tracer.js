/*
 * Copyright (C) 2016 Project Hatohol
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

var HatoholTracePoint = {
  PRE_HREF_CHANGE: 0
};

var HatoholTracer = function() {
  var self = this;

  self.callbacks = {};
  for (var key in HatoholTracePoint) {
    var tracerId = HatoholTracePoint[key];
    self.callbacks[tracerId] = []
  }

  this.addCallback = function(tracerId, func) {
    self.callbacks[tracerId].push(func);
  };

  this.invoke = function(tracerId, params) {
    var callbacks = self.callbacks[tracerId];
    for (var i = 0; i < callbacks.lengh; i++)
        callbacks(params);
  };
};

var hatoholTracer = new HatoholTracer();
