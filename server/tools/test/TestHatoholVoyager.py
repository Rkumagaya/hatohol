#!/usr/bin/env python
"""
  Copyright (C) 2013 Project Hatohol

  This file is part of Hatohol.

  Hatohol is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License, version 3
  as published by the Free Software Foundation.

  Hatohol is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with Hatohol. If not, see
  <http://www.gnu.org/licenses/>.
"""
import unittest
import urllib
import urllib2

from hatohol import hatohol_def
from hatohol import voyager

class TestHatoholVoyager(unittest.TestCase):

  def _assert_url(self, arg_list, expect, expect_method=None,
                  expect_query=None):
    ctx = voyager.main(arg_list, exec_postproc=False)
    if isinstance(ctx["url"], urllib2.Request):
      url = ctx["url"].get_full_url()
      method = ctx["url"].get_method()
    else:
      url = ctx["url"]
    self.assertEquals(url, expect)
    if expect_method is not None:
      self.assertEquals(method, expect_method)
    if expect_query is not None:
      self.assertEquals(ctx["encoded_query"], urllib.urlencode(expect_query))

  def _assert_add_action_one_opt(self, option, opt_value,
                                 query_key, query_value):
    ex_cmd = "ex-cmd -x --for ABC"
    arg_list = ["add-action", "--type", "command", "--command", ex_cmd,
                option, opt_value]
    expect_query = {"type":hatohol_def.ACTION_COMMAND, "command":ex_cmd,
                    query_key:query_value}
    self._assert_url(arg_list, "http://localhost:33194/action", None,
                     expect_query)

  def _assert_severity(self, comparator, comparator_value):
    severities = (("info", hatohol_def.TRIGGER_SEVERITY_INFO),
                  ("warn", hatohol_def.TRIGGER_SEVERITY_WARNING),
                  ("error", hatohol_def.TRIGGER_SEVERITY_ERROR),
                  ("critical", hatohol_def.TRIGGER_SEVERITY_CRITICAL),
                  ("emergency", hatohol_def.TRIGGER_SEVERITY_EMERGENCY))
    for (severity_label, severity_value) in severities:
      ex_cmd = "ex-cmd -x --for ABC"
      arg_list = ["add-action", "--type", "command", "--command", ex_cmd,
                  "--severity", comparator, severity_label]
      print arg_list
      expect_query = {"type":hatohol_def.ACTION_COMMAND, "command":ex_cmd,
                      "triggerSeverityCompType":str(comparator_value),
                      "triggerSeverity":str(severity_value)}
      self._assert_url(arg_list, "http://localhost:33194/action", None,
                       expect_query)

  #
  # Test cases
  #
  def test_test(self):
    arg_list = ["test"]
    self._assert_url(arg_list, "http://localhost:33194/test")

  def test_login(self):
    arg_list = ["--server", "www.example.com", "login", "name", "foo"]
    expect_query = urllib.urlencode({"user":"name", "password":"foo"})
    self._assert_url(arg_list,
                     "http://www.example.com:33194/login?" + expect_query)

  def test_logout(self):
    arg_list = ["--server", "www.example.com", "logout"]
    self._assert_url(arg_list, "http://www.example.com:33194/logout")

  def test_target_server(self):
    arg_list = ["--server", "www.example.com", "show-server"]
    self._assert_url(arg_list, "http://www.example.com:33194/server")

  def test_target_server_port(self):
    arg_list = ["--server", "www.example.com:23231", "show-server"]
    self._assert_url(arg_list, "http://www.example.com:23231/server")

  def test_show_server(self):
    arg_list = ["show-server"]
    self._assert_url(arg_list, "http://localhost:33194/server")

  def test_show_server_with_id(self):
    arg_list = ["show-server", "1"]
    self._assert_url(arg_list, "http://localhost:33194/server?serverId=1")

  def test_show_trigger(self):
    arg_list = ["show-trigger"]
    self._assert_url(arg_list, "http://localhost:33194/trigger")

  def test_show_trigger_with_server_id(self):
    arg_list = ["show-trigger", "3"]
    self._assert_url(arg_list, "http://localhost:33194/trigger?serverId=3")

  def test_show_trigger_with_server_and_host_id(self):
    arg_list = ["show-trigger", "3", "2000"]
    self._assert_url(arg_list, "http://localhost:33194/trigger?serverId=3&hostId=2000")

  def test_show_trigger_with_server_host_and_trigger_id(self):
    arg_list = ["show-trigger", "3", "2000", "123456789"]
    self._assert_url(arg_list, "http://localhost:33194/trigger?serverId=3&hostId=2000&triggerId=123456789")

  #
  # Event
  #
  def test_show_event(self):
    arg_list = ["show-event"]
    self._assert_url(arg_list, "http://localhost:33194/event")

  def test_show_event_sort_asc(self):
    arg_list = ["show-event", "--sort", "asc"]
    self._assert_url(arg_list,
                     "http://localhost:33194/event?sortOrder=%d" %
                       hatohol_def.DATA_QUERY_OPTION_SORT_ASCENDING)

  def test_show_event_sort_desc(self):
    arg_list = ["show-event", "--sort", "desc"]
    self._assert_url(arg_list,
                     "http://localhost:33194/event?sortOrder=%d" %
                       hatohol_def.DATA_QUERY_OPTION_SORT_DESCENDING)

  def test_show_event_max_number(self):
    arg_list = ["show-event", "--max-number", "5"]
    self._assert_url(arg_list, "http://localhost:33194/event?maximumNumber=5")

  def test_show_event_max_number_short(self):
    arg_list = ["show-event", "-n", "5"]
    self._assert_url(arg_list, "http://localhost:33194/event?maximumNumber=5")

  def test_show_event_start_id(self):
    arg_list = ["show-event", "--start-id", "3"]
    self._assert_url(arg_list, "http://localhost:33194/event?startId=3")

  # Item
  def test_show_item(self):
    arg_list = ["show-item"]
    self._assert_url(arg_list, "http://localhost:33194/item")

  def test_show_host(self):
    arg_list = ["show-host"]
    self._assert_url(arg_list, "http://localhost:33194/host")

  def test_show_host_with_server_id(self):
    arg_list = ["show-host", "3"]
    self._assert_url(arg_list, "http://localhost:33194/host?serverId=3")

  def test_show_host_with_server_and_host_id(self):
    arg_list = ["show-host", "3", "25600"]
    self._assert_url(arg_list, "http://localhost:33194/host?serverId=3&hostId=25600")

  def test_show_action(self):
    arg_list = ["show-action"]
    self._assert_url(arg_list, "http://localhost:33194/action")

  def test_add_action(self):
    ex_cmd = "ex-cmd -x --for ABC"
    arg_list = ["add-action", "--type", "command", "--command", ex_cmd]
    expect_query = {"type":hatohol_def.ACTION_COMMAND, "command":ex_cmd}
    self._assert_url(arg_list, "http://localhost:33194/action", None,
                    expect_query)

  def test_add_action_resident(self):
    ex_cmd = "foo.so -x --for ABC"
    arg_list = ["add-action", "--type", "resident", "--command", ex_cmd]
    expect_query = {"type":hatohol_def.ACTION_RESIDENT, "command":ex_cmd}
    self._assert_url(arg_list, "http://localhost:33194/action", None,
                    expect_query)

  def test_add_action_working_dir(self):
    workdir = "/tmp/foo/@@$$"
    self._assert_add_action_one_opt("--working-dir", workdir,
                                    "workingDirectory", workdir)

  def test_add_action_timeout(self):
    timeout = 305
    self._assert_add_action_one_opt("--timeout", str(timeout),
                                    "timeout", str(timeout))

  def test_add_action_server_id(self):
    server_id = 23
    self._assert_add_action_one_opt("--server-id", str(server_id),
                                    "serverId", str(server_id))

  def test_add_action_host_id(self):
    host_id = 0x890abcdef1234567
    self._assert_add_action_one_opt("--host-id", str(host_id),
                                    "hostId", str(host_id))

  def test_add_action_host_group_id(self):
    host_group_id = 0xa0b1c2d3e4f50617
    self._assert_add_action_one_opt("--host-group-id", str(host_group_id),
                                    "hostGroupId", str(host_group_id))

  def test_add_action_trigger_id(self):
    trigger_id = 0xfedcba9876543210
    self._assert_add_action_one_opt("--trigger-id", str(trigger_id),
                                    "triggerId", str(trigger_id))

  def test_add_action_status_ok(self):
    self._assert_add_action_one_opt("--status", "ok", "triggerStatus",
                                    str(hatohol_def.TRIGGER_STATUS_OK))

  def test_add_action_status_problem(self):
    self._assert_add_action_one_opt("--status", "problem", "triggerStatus",
                                    str(hatohol_def.TRIGGER_STATUS_PROBLEM))

  def test_add_action_status_serverity(self):
    severity_cmp = (("eq", hatohol_def.CMP_EQ), ("ge", hatohol_def.CMP_EQ_GT))
    for (comparator, value) in severity_cmp:
      self._assert_severity(comparator, value)

  def test_del_action(self):
    arg_list = ["del-action", "25"]
    self._assert_url(arg_list, "http://localhost:33194/action/25", "DELETE")

  def test_show_user(self):
    arg_list = ["show-user"]
    self._assert_url(arg_list, "http://localhost:33194/user")

  def test_add_user(self):
    user = "hatohol"
    password = "H@T0h.!"
    flags = 0
    arg_list = ["add-user", user, password, flags]
    expect_query = {"name":user, "password":password, "flags":flags}
    self._assert_url(arg_list, "http://localhost:33194/user", None,
                     expect_query)

  def test_del_user(self):
    arg_list = ["del-user", "25"]
    self._assert_url(arg_list, "http://localhost:33194/user/25", "DELETE")

  def test_server_conn_stat(self):
    arg_list = ["server-conn-stat"]
    self._assert_url(arg_list, "http://localhost:33194/server-conn-stat")

if __name__ == '__main__':
    unittest.main()
