describe('HatoholTracer', function() {
  // NOTE: In the actual use, a global object hatoholTracer
  //       is supposed to be used.
  it('add callback', function(done) {
    var tracer = new HatoholTracer();
    tracer.addCallback(HatoholTracePoint.PRE_HREF_CHANGE, function(){});
    done();
  });

  it('invoke registered callbacks', function(done) {
    function cb(params) {
      expect(params.foo).to.be(1);
      expect(params.goo).to.be(-2);
      done();
    };
    var tracer = new HatoholTracer();
    var tracePointId = HatoholTracePoint.PRE_HREF_CHANGE;
    tracer.addCallback(tracePointId, cb);
    tracer.invoke(tracePointId, {foo:1, goo:-2});
  });
});

