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

describe('HatoholUserConfig', function() {

  function defaultConnectErrorCallback(XMLHttpRequest, textStatus, errorThrown) {
    expect().fail(function(){
      return "status " + XMLHttpRequest.status +
             ": " + textStatus + ": " + errorThrown });
    // done() may not be unnecessary because the above fail()
    // throw an exception
  }

  function storeItems(done, items, successCallback) {

    if (!successCallback)
        successCallback = function(reply) { done(); }
  
    var params = {
      items: items,
      successCallback: successCallback,
      connectErrorCallback: defaultConnectErrorCallback,
    }
    var userconfig = new HatoholUserConfig();
    userconfig.store(params);
  }

  function storeAndGetItems(done, items, nonexistent) {
    storeItems(done, items, function(reply) {
      var itemNames = new Array();
      var expectItems = items;
      for (var name in items)
        itemNames.push(name);
      if (nonexistent) {
        for (var i in nonexistent.length) {
            itemNames.push(nonexistent[i]);
            expectItems.name = null;
        }
      }
      var params = {
        itemNames: itemNames,
        successCallback: function(obtained) {
          expect(obtained).to.eql(expectItems);
          done();
        },
        connectErrorCallback: defaultConnectErrorCallback,
      }
      var userconfig = new HatoholUserConfig();
      userconfig.get(params);
    });
  }

  //
  // Test cases
  //

  before(function(done) {
    // TODO: make sure to create a session ID for the test.
    //       currently the former tests create it. So no problem happens w/o it.
    done();
  });

  beforeEach(function(done) {
    var params = {
      url: '/test/delete_user_config',
      pathPrefix: '',
      replyCallback: function(reply, parser) { done(); },
      connectErrorCallback: defaultConnectErrorCallback,
      replyParser: getInactionParser(),
    };
    new HatoholConnector(params);
  });

  it('try to get nonexisting item', function(done) {
    var params = {
      itemNames: ['foo'],
      successCallback: function(values) {
        expect(values).not.to.be(undefined);
        expect(values).to.be.an('object');
        expect(values).to.have.key('foo');
        expect(values['foo']).to.be(null);
        done();
      },
      connectErrorCallback: defaultConnectErrorCallback,
    }
    userconfig = new HatoholUserConfig();
    userconfig.get(params);
  });

  it('store a string', function(done) {
    storeItems(done, {'color':'red and blue'});
  });

  it('store an integer', function(done) {
    storeItems(done, {'level': 99});
  });

  it('store an float', function(done) {
    storeItems(done, {'height': 18.2});
  });

  it('store a boolean', function(done) {
    storeItems(done, {'beautiful': true});
  });

  it('store null', function(done) {
    storeItems(done, {'nurunuru': null});
  });

  it('store and get a string', function(done) {
    storeAndGetItems(done, {'color':'red and blue'});
  });

  it('store and get an integer', function(done) {
    storeAndGetItems(done, {'cow': 15});
  });

  it('store and get a float', function(done) {
    storeAndGetItems(done, {'height': 18.9});
  });

  it('store and get a boolean', function(done) {
    storeAndGetItems(done, {'Artist': false});
  });

  it('store and get null', function(done) {
    storeAndGetItems(done, {'numenume': null});
  });

  it('store multiple value and get them', function(done) {
    var items = {'age':14, 'favorite face character': '!@v.v@!\'',
                 'brave': false, 'bibiri': true, 'nickname':null};
    storeAndGetItems(done, items);
  });

  it('store multiple value and get them with the non-existent', function(done) {
    var items = {'age':14, 'favorite face character': '!@v.v@!\'',
                 'brave': false, 'bibiri': true, 'nickname':null};
    var nonexistent = ['mother', 'sukiyaki'];
    storeAndGetItems(done, items, nonexistent);
  });

});
