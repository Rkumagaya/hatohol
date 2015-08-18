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

from hatohol.models import UserConfig
from django.db import connection


class TestUserConfig(unittest.TestCase):

    def setUp(self):
        UserConfig.objects.all().delete()

    def test_create_integer(self):
        user_conf = UserConfig(item_name='age', user_id=5, value=17)
        self.assertEquals(user_conf.item_name, 'age')
        self.assertEquals(user_conf.user_id, 5)
        self.assertEquals(user_conf.value, 17)
        user_conf.save()

    def test_create_string(self):
        user_conf = UserConfig(item_name='name', user_id=5, value='Foo')
        self.assertEquals(user_conf.item_name, 'name')
        self.assertEquals(user_conf.user_id, 5)
        self.assertEquals(user_conf.value, 'Foo')
        user_conf.save()

    def test_create_float(self):
        user_conf = UserConfig(item_name='height', user_id=5, value=172.5)
        self.assertEquals(user_conf.item_name, "height")
        self.assertEquals(user_conf.user_id, 5)
        self.assertEquals(user_conf.value, 172.5)
        user_conf.save()

    def test_create_base64_plus_pickle_string(self):
        user_conf = UserConfig(item_name='base64.pickle.name',
                               user_id=5, value='gAJVA0Zvb3EBLg==')
        self.assertEquals(user_conf.value, 'gAJVA0Zvb3EBLg==')
        user_conf.save()

    def test_get_from_empty(self):
        self.assertEquals(UserConfig.get('age', 5), None)

    def test_get_integer(self):
        self.test_create_integer()
        self.assertEquals(UserConfig.get('age', 5), 17)

    def test_get_string(self):
        self.test_create_string()
        self.assertEquals(UserConfig.get('name', 5), "Foo")

    def test_get_float(self):
        self.test_create_float()
        self.assertEquals(UserConfig.get('height', 5), 172.5)

    def test_get_from_many(self):
        self.test_create_integer()
        self.test_create_string()
        self.test_create_float()
        self.assertEquals(UserConfig.get('height', 5), 172.5)

    def test_get_none_from_many(self):
        self.test_create_integer()
        self.test_create_string()
        self.test_create_float()
        self.assertEquals(UserConfig.get('name', 600), None)

    def test_get_none_with_diffent_name(self):
        self.test_create_integer()
        self.test_create_string()
        self.test_create_float()
        self.assertEquals(UserConfig.get('FOGA', 5), None)

    def test_unicode_expression(self):
        user_conf = UserConfig(item_name='name', user_id=5, value=123)
        user_conf.save()
        self.assertEquals(str(UserConfig.objects.all()[0]), 'name (5)')

    def test_store(self):
        user_conf = UserConfig(item_name='name', user_id=5, value=123)
        user_conf.store()
        all_objs = UserConfig.objects.all()
        self.assertEquals(len(all_objs), 1)
        self.assertEquals(all_objs[0].value, 123)

        user_conf = UserConfig(item_name='name', user_id=5, value=55)
        user_conf.store()
        all_objs = UserConfig.objects.all()
        self.assertEquals(len(all_objs), 1)
        self.assertEquals(all_objs[0].value, 55)

if __name__ == '__main__':
    unittest.main()
