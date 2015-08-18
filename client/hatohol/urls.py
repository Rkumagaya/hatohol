# Copyright (C) 2013 Project Hatohol
#
# This file is part of Hatohol.
#
# Hatohol is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License, version 3
# as published by the Free Software Foundation.
#
# Hatohol is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with Hatohol. If not, see
# <http://www.gnu.org/licenses/>.

import os
from django.conf.urls import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from hatohol.forwardview import jsonforward
from django.views.generic import TemplateView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()


def guess_content_type_from_ext(ext):
    if ext is "js":
        return 'text/javascript'
    elif ext is "css":
        return 'text/css'
    return 'text/html'


def static_file(request, prefix, path, ext):
    content_type = guess_content_type_from_ext(ext)
    view = TemplateView.as_view(template_name=prefix + path,
                                content_type=content_type)
    return view(request)


def tasting_file(request, path, ext):
    return static_file(request, "tasting/", path, ext)


def test_file(request, path, ext):
    return static_file(request, "test/browser/", path, ext)


urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'hatohol.views.home', name='home'),
    # url(r'^hatohol/', include('hatohol.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^viewer/', include('viewer.urls')),
    url(r'^tunnel/(?P<path>.+)', jsonforward),
    url(r'^log-search-systems/(?P<id>\d+)?$',
        'hatohol.views.log_search_systems'),
    url(r'^graphs/(?P<id>\d+)?$',
        'hatohol.views.graphs'),
    url(r'^userconfig$', 'viewer.userconfig.index'),
    url(r'^jsi18n/$', 'django.views.i18n.javascript_catalog'),
    url(r'', include('viewer.urls')),
)

urlpatterns += i18n_patterns(
    '',
    url(r'^viewer/', include('viewer.urls')),
    url(r'^jsi18n/$', 'django.views.i18n.javascript_catalog'),
    url(r'', include('viewer.urls')),
)

if 'HATOHOL_DEBUG' in os.environ and os.environ['HATOHOL_DEBUG'] == '1':
    import test.python.utils

    urlpatterns += patterns(
        '',
        url(r'^tasting/(.+\.(js|css|html))$', tasting_file),
        url(r'^test/hello', test.python.utils.hello),
        url(r'^test/delete_user_config', test.python.utils.delete_user_config),
        url(r'^test/(.+\.(js|css|html))$', test_file),
    )
