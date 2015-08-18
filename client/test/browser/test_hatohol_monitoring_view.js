describe('HatoholMonitoringView', function() {

  var testDivId = 'testDiv';
  afterEach(function(done) {
    $('#' + testDivId).remove();
    done();
  });

  function makeSelectorsTestDiv() {
    var s = '';
    s += '<div id="' + testDivId + '">"';
    s += '  <select id="select-server">';
    s += '    <option>---------</option>';
    s += '    <option>server1</option>';
    s += '    <option>server2</option>';
    s += '  </select>';
    s += '  <select id="select-host-group">';
    s += '    <option>---------</option>';
    s += '    <option>hostgroup1</option>';
    s += '    <option>hostgroup2</option>';
    s += '  </select>';
    s += '  <select id="select-host">';
    s += '    <option>---------</option>';
    s += '    <option>host1</option>';
    s += '    <option>host2</option>';
    s += '  </select>';
    s += '  <select id="select-application">';
    s += '    <option>---------</option>';
    s += '    <option>app1</option>';
    s += '    <option>app2</option>';
    s += '</div>';
    $('body').append(s);
  }

  function prepareForSetupHostQuerySelector(param) {
    makeSelectorsTestDiv();
    HatoholMonitoringView.prototype.setupHostQuerySelectorCallback(
      function () {
        expect($('#select-server').val()).to.be(param.server);
        expect($('#select-host-group').val()).to.be(param.hostgroup);
        expect($('#select-host').val()).to.be(param.host);
        expect($('#select-application').val()).to.be(param.application);
        param.done();
      },
      '#select-server', '#select-host-group', '#select-host', '#select-application'
    );
    $('#select-server').val('server1');
    $('#select-host-group').val('hostgroup2');
    $('#select-host').val('host1');
    $('#select-application').val('---------');
    expect($('#select-server').val()).to.be('server1');
    expect($('#select-host-group').val()).to.be('hostgroup2');
    expect($('#select-host').val()).to.be('host1');
    expect($('#select-application').val()).to.be('---------');
  }

  function makeCheckBoxTestDiv() {
    var s = '';
    s += '<div id="' + testDivId + '">"';
    s += '  <div class="delete-selector" id="checkbox-div" style="display:none;">';
    s += '    <input type="checkbox" class="selectcheckbox" id="checkbox1">';
    s += '    <input type="checkbox" class="selectcheckbox" id="checkbox2">';
    s += '  </td>';
    s += '  <button id="delete-test-button" type="button" disabled>test delete</button>';
    s += '</div>';
    $('body').append(s);
  }

  function makeTestObject(flags) {
    var user = {flags: flags};
    var testObj = {userProfile: new HatoholUserProfile(user)};
    return testObj;
  }

  // ------------------------------------------------------------------------------------
  // Test cases
  // ------------------------------------------------------------------------------------
  it('set filter candidates', function() {
    var candidates = [
      { label: 'apple',  value: 1 },
      { label: 'orange', value: 2 },
      { label: 'lemon',  value: 3 }
    ];
    var target = $('<select>');
    var setCandidates = HatoholMonitoringView.prototype.setFilterCandidates;
    var expected = '<option>---------</option>';
    var i;
    for (i = 0; i < candidates.length; i++) {
      expected += '<option value="' + candidates[i].value + '">' +
                  candidates[i].label + '</option>';
    }
    setCandidates(target, candidates);
    expect(target.html()).to.be(expected);
  });

  it('set filter candidates with a string array', function() {
    var candidates = [ 'apple', 'orange', 'lemon' ];
    var target = $('<select>');
    var setCandidates = HatoholMonitoringView.prototype.setFilterCandidates;
    var expected = '<option>---------</option>';
    var i;
    for (i = 0; i < candidates.length; i++)
      expected += '<option>' + candidates[i] + '</option>';
    setCandidates(target, candidates);
    expect(target.html()).to.be(expected);
  });

  it('set empty filter', function() {
    var target = $('<select>');
    var setCandidates = HatoholMonitoringView.prototype.setFilterCandidates;
    setCandidates(target);
    var expected = '<option>---------</option>';
    expect(target.html()).to.be(expected);
  });

  it('setupHostQuerySelector: select server', function(done) {
    prepareForSetupHostQuerySelector({
      done: done,
      server:    'server2',
      hostgroup: '---------',
      host:      '---------',
      application: '---------'
    });
    $('#select-server').val('server2').trigger('change');
  });

  it('setupHostQuerySelector: select host group', function(done) {
    prepareForSetupHostQuerySelector({
      done: done,
      server:    'server1',
      hostgroup: 'hostgroup1',
      host:      '---------',
      application: '---------'
    });
    $('#select-host-group').val('hostgroup1').trigger('change');
  });

  it('setupHostQuerySelector: select host', function(done) {
    prepareForSetupHostQuerySelector({
      done: done,
      server:    'server1',
      hostgroup: 'hostgroup2',
      host:      'host2',
      application: '---------'
    });
    $('#select-host').val('host2').trigger('change');
  });

  it('setupHostQuerySelector: select application', function(done) {
    prepareForSetupHostQuerySelector({
      done: done,
      server:    'server1',
      hostgroup: 'hostgroup2',
      host:      'host1',
      application: 'app1'
    });
    $('#select-application').val('app1').trigger('change');
  });

  it ('soon after calling setupCheckboxForDelete', function() {

    makeCheckBoxTestDiv();
    $('#delete-test-button').attr('disabled', '');
    $('#checkbox1').val(true);

    HatoholMonitoringView.prototype.setupCheckboxForDelete.apply(
     makeTestObject(1<<hatohol.OPPRVLG_DELETE_SERVER), [$('#delete-test-button')]);
    expect($('#delete-test-button').attr('disabled')).to.be('disabled');
    expect($('#checkbox1').prop('checked')).to.be(false);
    expect($('#checkbox2').prop('checked')).to.be(false);
    // The visiblity of them will be controlled by caller.
    // github issue #686
    //expect($('#checkbox-div').css('display')).to.be('block');
  });

  it ('not show check boxes if the user does not have the privilege', function() {

    makeCheckBoxTestDiv();
    $('#delete-test-button').attr('disabled', '');
    HatoholMonitoringView.prototype.setupCheckboxForDelete.apply(
     makeTestObject(0), [$('#delete-test-button')]);
    expect($('#checkbox-div').css('display')).to.be('none');
  });

  it ('activity of the delete button by check box status.', function(done) {
    var stage = 0;
    makeCheckBoxTestDiv();
    HatoholMonitoringView.prototype.setupCheckboxForDelete.apply(
     makeTestObject(1<<hatohol.OPPRVLG_DELETE_SERVER), [$('#delete-test-button')]);
    expect($('#delete-test-button').attr('disabled')).to.be('disabled');

    // setup the checker for the buttton status
    // FIXME: The polling way is uncool.
    var timerId = setInterval(function changeMonitor() {
      var buttonDisabled = $('#delete-test-button').attr('disabled');
      if (stage == 0) {
        if (buttonDisabled == 'disabled')
          return;
        expect(buttonDisabled).to.be(undefined);
        $('#checkbox1').prop('checked', false).trigger('change');
        stage = 1;
      } else {
        if (buttonDisabled == '')
          return;
        expect(buttonDisabled).to.be('disabled');
        clearInterval(timerId);
        done();
     }
    }, 1);

    $('#checkbox1').prop('checked', true).trigger('change');
  });

});
