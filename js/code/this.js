var aGlobal = 'a-global';

function fun1() {
  'use strict';

  debugger;
  this.aGlobal; // TypeError
}

function fun2() {
  fun1();
  this.aGlobal; // Global.aGlobal
}

// fun2();

const objWithFun = {
  prop1: 'prop 1',
  fun: function fun() {
    debugger;
    this.prop1; // objWithFun.prop1
  }
}
// objWithFun.fun();

const objWithFunInDeeper = {
  outerProp: 'outer prop',
  innerObj: {
    innerProp: 'inner prop',
    fun: function fun() {
      debugger;
      this.innerProp; // 'inner prop'
      this.outerProp; // undefined
    }
  }
}
// objWithFunInDeeper.innerObj.fun();


