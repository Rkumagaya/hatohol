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
    var tracePointId = HatoholTracePoint[key];
    self.callbacks[tracePointId] = []
  }

  this.addCallback = function(tracePointId, func) {
    if (!(tracePointId in self.callbacks))
      throw "Unknown tracePointId: " + tracePointId;
    self.callbacks[tracePointId].push(func);
  };

  this.invoke = function(tracePointId, params) {
    if (!(tracePointId in self.callbacks))
      throw "Unknown tracePointId: " + tracePointId;
    var callbacks = self.callbacks[tracePointId];
    for (var i = 0; i < callbacks.length; i++)
        callbacks[i](params);
  };
};

var hatoholTracer = new HatoholTracer();
