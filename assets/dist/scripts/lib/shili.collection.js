'use strict';
var Industries = Industries || (Industries = {});
(function(window) {

  var collection = {};

  /* ------------------------------------------------
  * Extend
  ------------------------------------------------ */
  if (!Array.prototype.isArray) {
    Array.prototype.isArray = function (vArg) {
      return Object.prototype.toString.call(vArg) === "[object Array]";
    };
  }

  /* ------------------------------------------------
  * utility
  ------------------------------------------------ */
  var utility = {
    isArray: function(a) {
      return Array.isArray(a) || a instanceof NodeList || a instanceof HTMLCollection;
    },
    isObject: function(testValue) {
      return typeof testValue === 'object' && testValue !== null;
    },
    hashIdIndex: 1,
    numberHashId: function(targetObject) {
      targetObject.hashId = utility.hashIdIndex++;
    },
    getHashId: function(targetObject) {
      if(targetObject.hashId === void 0) {
        targetObject.hashId = utility.hashIdIndex++;
      }
      return targetObject.hashId;
    },
    setObjectIntoNamespace: function(className, targetObject) {
      targetObject.className = className;
      collection[className] = targetObject;
    },
    inherits: function(sub, sup) {
      var F = function F() {};
      F.prototype = sup.prototype;
      sub.prototype = new F();
      sub.prototype.constructor = sub;
    },
    makeAccessor: function(targetObject, configuration, getter, setter, subConfiguration) {
      // prototype設定
      // writable: true (書き込み可能か)
      // enumerable: true (列挙可能か)
      // configurable: true (再定義可能か)
      for (var key in configuration) {
        var value = configuration[key];
        var prototypes = {
          get: getter,
          set: setter,
          enumerable: true
        };
        // subConfigurationがあればマージする
        if (subConfiguration !== void 0){
          for (var prop in subConfiguration) {
            prototypes[prop] = subConfiguration[prop];
          }
        }

        Object.defineProperty(targetObject.prototype, key, prototypes);

        var descriptor = Object.getOwnPropertyDescriptor(targetObject.prototype, key);
        if (value && descriptor) {
          Object.defineProperty(targetObject.prototype, value, descriptor);
        }
        break;
      }
    },
    makeAccessorOnlyGetter: function(targetObject, configuration, getter, subConfiguration) {
      for (var key in configuration) {
        var value = configuration[key];
        var prototypes = {
          get: getter,
          set: function(a) {},
          enumerable: true
        };
        if (subConfiguration !== void 0){
          for (var prop in subConfiguration) {
            prototypes[prop] = subConfiguration[prop];
          }
        }

        Object.defineProperty(targetObject.prototype, key, prototypes);

        var descriptor = Object.getOwnPropertyDescriptor(targetObject.prototype, key);
        if (value && descriptor) {
          Object.defineProperty(targetObject.prototype, value, descriptor);
        }
        break;
      }
    },
    getTypeName: function(testValue) {
      if (testValue === void 0) {
        return '';
      }
      if (typeof testValue === 'string' ) {
        return testValue;
      }
      else if (typeof testValue === 'function') {
        return utility.getClassName(testValue);
      }
      else if (testValue === null) {
        return '*';
      }
      else {
        return '';
      }
    },
    getClassName: function(classType) {
      if (typeof classType === 'function') {
        if (classType.className) {
          return classType.className;
        }
        if (classType.name) {
          return classType.name;
        }
        var classTypeString = classType.toString();
        var index = classTypeString.indexOf('(');
        var classTypeString = classTypeString.substring(9, index).trim();
        if ('' !== classTypeString) {
          classType.className = classTypeString;
          return classType.className;
        }
      }
      else if (typeof classType === 'object' && classType.constructor) {
        return utility.getClassName(classType.constructor);
      }
      return typeof classType;
    }
  };


  /* ------------------------------------------------
  *
  * EmptyIterator__ [Iterable]
  *
  *
  ------------------------------------------------ */
  function EmptyIterator__() {}

  // Getter
  utility.makeAccessorOnlyGetter(EmptyIterator__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(EmptyIterator__, {
    count: 'count'
  }, function() {
    return 0;
  });

  EmptyIterator__.prototype.reset = function() {};

  EmptyIterator__.prototype.next = EmptyIterator__.prototype.hasNext = function() {
    return false;
  };

  EmptyIterator__.prototype.first = function() {
    return null;
  };

  EmptyIterator__.prototype.any = function() {
    return false;
  };

  EmptyIterator__.prototype.all = function() {
    return true;
  };

  EmptyIterator__.prototype.each = function() {
    return this;
  };

  EmptyIterator__.prototype.map = function() {
    return this;
  };

  EmptyIterator__.prototype.filter = function() {
    return this;
  };

  EmptyIterator__.prototype.done = function() {};


  /* ------------------------------------------------
  *
  * SingletonIterator__ [Iterable]
  *
  *
  ------------------------------------------------ */
  function SingletonIterator__(a) {
    this.key = -1;
    this.value = a;
  }

  SingletonIterator__.prototype.IF = {
    key: true,
    value: true
  }

  // Getter
  utility.makeAccessorOnlyGetter(SingletonIterator__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(SingletonIterator__, {
    count: 'count'
  }, function() {
    return 1;
  });

  SingletonIterator__.prototype.reset = function() {
    this.key = -1;
  };

  SingletonIterator__.prototype.next = SingletonIterator__.prototype.hasNext = function() {
    return this.key === -1 ? (this.key = 0, true) : false
  };

  SingletonIterator__.prototype.done = function() {
    this.value = null;
  };

  SingletonIterator__.prototype.first = function() {
    this.key = 0;
    return this.value;
  };

  SingletonIterator__.prototype.any = function(callback) {
    this.key = -1;
    return callback(this.value);
  };

  SingletonIterator__.prototype.all = function(callback) {
    this.key = -1;
    return callback(this.value);
  };

  SingletonIterator__.prototype.each = function(callback) {
    this.key = -1;
    callback(this.value);
    return this;
  };

  SingletonIterator__.prototype.map = function(callback) {
    return new SingletonIterator__(callback(this.value));
  };

  SingletonIterator__.prototype.filter = function(callback) {
    return callback(this.value) ? new SingletonIterator__(this.value) : new EmptyIterator__();
  };


  /* ------------------------------------------------
  *
  * SetIterator__ [Iterable]
  *
  *
  ------------------------------------------------ */
  function SetIterator__(Set__instance) {
    this.Set__instance_ = Set__instance;
    this.reset();
  }

  SetIterator__.prototype.IF = {
    key: true,
    value: true
  }

  // Getter
  utility.makeAccessorOnlyGetter(SetIterator__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(SetIterator__, {
    count: 'count'
  }, function() {
    return this.Set__instance_.count_;
  });
  
  SetIterator__.prototype.reset = function() {
    var a = this.Set__instance_;
    a.iterator_ = null;
    this.state_ = a.actionCount_;
    this.lastValidatedValueSet_ = null
  };

  SetIterator__.prototype.next = SetIterator__.prototype.hasNext = function() {
    var a = this.Set__instance_;
    if (a.actionCount_ !== this.state_ && this.key === null) {
      return false;
    }
    
    var valueSet;
    if (this.lastValidatedValueSet_ === null) {
      valueSet = a.firstAddedValueSet_
    }
    else {
      valueSet = this.lastValidatedValueSet_.juniorValueSet_;
    }

    if (valueSet !== null) {
      this.lastValidatedValueSet_ = valueSet;
      this.value = valueSet.value;
      this.key = valueSet.key;
      return true;
    }

    this.done();
    return false;
  };

  SetIterator__.prototype.done = function() {
    this.value = this.key = null;
    this.state_ = -1;
    this.Set__instance_.iterator_ = this;
  };

  SetIterator__.prototype.first = function() {
    var a = this.Set__instance_;
    // this.state_ = a.actionCount_;
    a = a.firstAddedValueSet_;
    if (a !== null) {
      this.lastValidatedValueSet_ = a;
      this.key = a.key;
      this.value = a.value;
      return a.value;
    }
    return null;
  };

  SetIterator__.prototype.any = function(callback) {
    var b = this.Set__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (callback(d.value)) {
        return true;
      }
      d = d.juniorValueSet_;
    }
    return false;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  SetIterator__.prototype.all = function(callback) {
    var b = this.Set__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (!callback(d.value)) {
        return false;
      }
      d = d.juniorValueSet_;
    }
    return true;
  };

  // 配列の各要素に対してコールバック関数を呼び出す
  SetIterator__.prototype.each = function(callback) {
    var b = this.Set__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      callback(d.value);
      d = d.juniorValueSet_;
    }
    return this;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスを返す
  // 値の重複はありえるのでList__を使う
  SetIterator__.prototype.map = function(callback) {
    var b = this.Set__instance_;
    b.iterator_ = null;
    for (var c = new List__(b.type_), e = b.firstAddedValueSet_; e !== null;) {
      c.add(callback(e.value));
      e = e.juniorValueSet_;
    }
    return c.iterator;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスを返す
  // 値の重複はありえるのでList__を使う
  SetIterator__.prototype.filter = function(callback) {
    var b = this.Set__instance_;
    b.iterator_ = null;
    for (var c = new List__(b.type_), e = b.firstAddedValueSet_; e !== null;) {
      if (callback(e.value)) {
        c.add(e.value);
      }
      e = e.juniorValueSet_
    }
    return c.iterator;
  };


  /* ------------------------------------------------
  *
  * Set__ [Iterable]
  *
  * 値を順番付けしないで管理するデータ構造
  * 同じキーがセット(add)された場合は上書きする
  *
  ------------------------------------------------ */
  function Set__(a) {
    utility.numberHashId(this);
    this.isFrozenFlag = false;

    if(a === void 0 || a === null){
      this.type_ = null;
    }
    else if(typeof a === 'string') {
      if('object' === a || 'string' === a || 'number' === a || 'boolean' === a || 'function' === a) {
        this.type_ = a;
      }
    }
    else if(typeof a === 'function'){
      if(a === Object){
        this.type_ = 'object';
      }
      else if (a === String) {
        this.type_ = 'string';
      }
      else if (a === Number) {
        this.type_ = 'number';
      }
      else if (a === Boolean) {
        this.type_ = 'boolean';
      }
      else if (a === Function) {
        this.type_ = 'function';
      }
      else {
        this.type_ = a;
      }
    }

    this.mapValueSets_ = {};
    this.count_ = 0;
    this.iterator_ = null;
    this.actionCount_ = 0;
    this.lastAddedValueSet__ = this.firstAddedValueSet_ = null;
  }

  utility.setObjectIntoNamespace('Set', Set__);

  Set__.EnumValues = null;

  // Getter
  utility.makeAccessorOnlyGetter(Set__, {
    count: 'count'
  }, function() {
    return this.count_
  });

  utility.makeAccessorOnlyGetter(Set__, {
    size: 'size'
  }, function() {
    return this.count_
  });

  utility.makeAccessorOnlyGetter(Set__, {
    iterator: 'iterator'
  }, function() {
    if (this.count_ <= 0) {
      return new EmptyIterator__();
    }
    var a = this.iterator_;
    return a !== null ? (a.reset(), a) : new SetIterator__(this);
  });
  
  Set__.prototype.memorize = function() {
    var a = this.actionCount_;
    a++;
    a > 100000000 && (a = 0);
    this.actionCount_ = a
  };

  Set__.prototype.freeze = function() {
    this.isFrozenFlag = true;
    return this;
  };

  Set__.prototype.thaw = function() {
    this.isFrozenFlag = false;
    return this;
  };

  Set__.prototype.add = function(value) {
    if (value === null) {
      return false;
    }

    var hashId_ = value;
    
    if (utility.isObject(value)) {
      // hashIdIndexを返す
      hashId_ = utility.getHashId(value);
    }

    var MapValueSet__instance = this.mapValueSets_[hashId_];

    if (MapValueSet__instance === void 0) {
      MapValueSet__instance = new MapValueSet__(value, value);

      this.mapValueSets_[hashId_] = MapValueSet__instance
      
      if (this.lastAddedValueSet__ === null) {
        this.firstAddedValueSet_ = MapValueSet__instance;
      }
      else {
        MapValueSet__instance.seniorValueSet_ = this.lastAddedValueSet__;
        this.lastAddedValueSet__.juniorValueSet_ = MapValueSet__instance;
      }
      
      this.lastAddedValueSet__ = MapValueSet__instance;
      this.count_++;
      this.memorize();
      return true;
    }

    return false;
  };
  
  Set__.prototype.addAll = function(a) {
    if (a === null) {
      return this;
    }
    if (utility.isArray(a)){
      for (var c = 0, b = a.length; c < b; c++) {
        this.add(a[c]);
      }
    }
    else{
      for (a = a.iterator; a.next();) {
        this.add(a.value);
      }
    }
    return this;
  };

  Set__.prototype.first = function() {
    var a = this.firstAddedValueSet_;
    return a === null ? null : a.value;
  };
  
  // 配列内に引数の値が含まれていればtrueを返す
  Set__.prototype.contains = Set__.prototype.has = function(testValue) {
    if (testValue === null) {
      return false;
    }
    var b;
    if (utility.isObject(testValue) && (b = testValue.hashId, b === void 0)) {
      return false;
    }
    else {
      return this.mapValueSets_[testValue] !== void 0;
    }
  };
  
  // 配列内に引数の配列の値がすべて含まれていればtrueを返す
  Set__.prototype.containsAll = function(a) {
    if (a === null) {
      return true;
    }

    for (var i = a.iterator; i.next();) {
      if (!this.contains(i.value)) {
        return false;
      }
    }
    return true;
  };
  
  // 配列内に引数の配列の値が一つでも含まれていればtrueを返す
  Set__.prototype.containsAny = function(a) {
    if (a === null) {
      return true;
    }

    for (var i = a.iterator; i.next();) {
      if (this.contains(i.value)) {
        return true;
      }
    }
    return false;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  Set__.prototype.any = function(callback) {
    for (var c = this.firstAddedValueSet_; c !== null;) {
      if (callback(c.value)) {
        return true;
      }
      c = c.juniorValueSet_;
    }
    return false;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  Set__.prototype.all = function(callback) {
    for (var c = this.firstAddedValueSet_; c !== null;) {
      if (!callback(c.value)) {
        return false;
      }
      c = c.juniorValueSet_;
    }
    return true;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出す
  Set__.prototype.each = function(callback) {
    for (var c = this.firstAddedValueSet_; c !== null;) {
      callback(c.value);
      c = c.juniorValueSet_;
    }
    return this;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むSet__インスタンスを返す
  // 値の重複はないのでSet__を使う
  Set__.prototype.map = function(callback) {
    for (var b = new Set__(this.type_), d = this.firstAddedValueSet_; d !== null;) {
      b.add(callback(d.value));
      d = d.juniorValueSet_;
    }
    return b;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むSet__インスタンスを返す
  // 値の重複はないのでSet__を使う
  Set__.prototype.filter = function(callback) {
    for (var b = new Set__(this.type_), d = this.firstAddedValueSet_; d !== null;) {
      if (callback(d.value)) {
        b.add(d.value);
      }
      d = d.juniorValueSet_;
    }
    return b;
  };

  Set__.prototype.clear = function() {
    this.mapValueSets_ = {};
    this.count_ = 0;
    this.lastAddedValueSet__ = this.firstAddedValueSet_ = null;
    this.memorize();
  };
  
  Set__.prototype.remove = Set__.prototype['delete'] = function(hashId) {
    if (hashId === null) {
      return false;
    }
    var hashId_ = hashId;
    if (utility.isObject(hashId)) {
      hashId_ = hashId.hashId;
      if (hashId_ === void 0) {
        return false;
      }
    }

    var me = this.mapValueSets_[hashId_];
    if (me === void 0) {
      return false;
    }

    var juniorOfMe = me.juniorValueSet_;
    var seniorOfMe = me.seniorValueSet_;

    if (juniorOfMe !== null) {
      juniorOfMe.seniorValueSet_ = seniorOfMe;
    }
    if (seniorOfMe !== null) {
      seniorOfMe.juniorValueSet_ = juniorOfMe;
    }

    if (me === this.firstAddedValueSet_) {
      this.firstAddedValueSet_ = juniorOfMe;
    }
    if (me === this.lastAddedValueSet__) {
      this.lastAddedValueSet__ = seniorOfMe;
    }

    delete this.mapValueSets_[hashId_];

    this.count_--;
    this.memorize();
    return true;
  };
  
  // 指定された引数の値と合致する値を含む要素を削除して、配列を返す
  Set__.prototype.removeAll = function(a) {
    if (a === null) {
      return this;
    }

    if (utility.isArray(a)) {
      for (var b = a.length, c = 0; c < b; c++) {
        this.remove(a[c]);
      }
    }
    else{
      for (a = a.iterator; a.next();) {
        this.remove(a.value);
      }
    }
    return this;
  };
  
  // 指定された引数の値に合致しない値を含む要素を削除して、配列を返す
  Set__.prototype.retainAll = function(a) {
    if (a === null || this.count === 0) {
      return this;
    }

    var b = new Set__(this.type_);
    b.addAll(a);
    
    var arry = [];
    for (var c = this.iterator; c.next();) {
      b.contains(c.value) || arry.push(c.value);
    }

    this.removeAll(arry);
    return this;
  };
  
  Set__.prototype.copy = function() {
    var a = new Set__(this.type_);
    var b = this.mapValueSets_;
    for (var c in b) {
      a.add(b[c].value);
    }
    return a
  };
  
  Set__.prototype.toArray = Set__.prototype.dc = function() {
    var a = Array(this.count_);
    var b = this.mapValueSets_;
    var c = 0;
    for (var d in b) {
      a[c] = b[d].value;
      c++;
    }
    return a;
  };
  
  Set__.prototype.toList = function() {
    var a = new List__(this.type_);
    var b = this.mapValueSets_;
    for (var c in b) {
      a.add(b[c].value);
    }
    return a;
  };


  /* ------------------------------------------------
  *
  * ListIterator__ [Iterable]
  *
  * List__instance_.valueArray_
  * [***, ***]
  *
  ------------------------------------------------ */
  function ListIterator__(List__instance) {
    this.List__instance_ = List__instance;
    this.predicate_ = null;
    this.reset();
  }

  ListIterator__.prototype.IF = {
    key: true,
    value: true
  }

  // Getter
  utility.makeAccessorOnlyGetter(ListIterator__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(ListIterator__, {
    count: 'count'
  }, function() {
    if (this.predicate_ !== null) {
      for (var i = 0, j = this.List__instance_.valueArray_.length, k = 0; k < j; k++) {
        // 属性を叙述する,断定する
        this.predicate_(this.List__instance_.valueArray_[k]) && i++;
      }
      return i;
    }
    return this.List__instance_.valueArray_.length;
  });

  // Getter/Setter
  utility.makeAccessor(ListIterator__, {
    predicate: 'predicate'
  }, function() {
    return this.predicate_;
  }, function(a) {
    this.predicate_ = a;
  });

  ListIterator__.prototype.reset = function() {
    this.List__instance_.iterator_ = null;
    this.state_ = this.List__instance_.actionCount_;
    this.index_ = -1;
  };

  ListIterator__.prototype.next = ListIterator__.prototype.hasNext = function() {
    if (this.List__instance_.actionCount_ !== this.state_ && this.key < 0) {
      return false;
    }

    var arry = this.List__instance_.valueArray_;
    var arryLength = arry.length;

    var c = ++this.index_;

    if (this.predicate_ !== null){
      for (; c < arryLength;) {
        var e = arry[c];
        if (this.predicate_(e)) {
          this.key = this.index_ = c;
          this.value = e;
          return true;
        }
        c++;
      }
    }
    else if (c < arryLength) {
      this.key = c;
      this.value = arry[c];
      return true;
    }

    this.done();
    return false;
  };

  ListIterator__.prototype.done = function() {
    this.key = -1;
    this.value = null;
    this.state_ = -1;
    this.predicate_ = null;
    this.List__instance_.iterator_ = this;
  };

  ListIterator__.prototype.first = function() {
    // this.state_ = this.List__instance_.actionCount_;
    this.index_ = 0;
    var arry = this.List__instance_.valueArray_;
    var arryLength = arry.length;

    if (this.predicate_ !== null) {
      for (var d = 0; d < arryLength;) {
        var e = arry[d];
        if (this.predicate_(e)) {
          return this.key = this.index_ = d, this.value = e;
        }
        d++;
      }
      return null;
    }

    return 0 < arryLength ? (e = arry[0], this.key = 0, this.value = e) : null;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  ListIterator__.prototype.any = function(callback) {
    this.List__instance_.iterator_ = null;
    this.index_ = -1;

    for (var e = this.List__instance_.valueArray_.length, h = 0; h < e; h++) {
      var k = this.List__instance_.valueArray_[h];
      if (this.predicate_ === null || this.predicate_(k)) {
        if (callback(k)) {
          return true;
        }
      }
    }

    return false;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  ListIterator__.prototype.all = function(callback) {
    this.List__instance_.iterator_ = null;
    this.index_ = -1;

    for (var e = this.List__instance_.valueArray_.length, h = 0; h < e; h++) {
      var k = this.List__instance_.valueArray_[h];
      if (this.predicate_ === null || this.predicate_(k)) {
        if (!callback(k)) {
          return false;
        }
      }
    }

    return true;
  };

  // 配列の各要素に対してコールバック関数を呼び出す
  ListIterator__.prototype.each = function(callback) {
    this.List__instance_.iterator_ = null;
    this.index_ = -1;

    for (var h = 0, e = this.List__instance_.valueArray_.length; h < e; h++) {
      var k = this.List__instance_.valueArray_[h];
      if (this.predicate_ === null || this.predicate_(k)) {
        callback(k);
      }
    }

    return this;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  ListIterator__.prototype.map = function(callback) {
    this.List__instance_.iterator_ = null;
    this.index_ = -1;
    for (var arry = [], f = this.List__instance_.valueArray_.length, k = 0; k < f; k++) {
      var l = this.List__instance_.valueArray_[k];
      if (this.predicate_ === null || this.predicate_(l)) {
        arry.push(callback(l));
      }
    }

    var List__instance = new List__();
    List__instance.valueArray_ = arry;
    List__instance.memorize();
    return List__instance.iterator;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  ListIterator__.prototype.filter = function(callback) {
    this.List__instance_.iterator_ = null;
    this.index_ = -1;
    for (var arry = [], f = this.List__instance_.valueArray_.length, k = 0; k < f; k++) {
      var l = this.List__instance_.valueArray_[k];
      if (this.predicate_ === null || this.predicate_(l)) {
        callback(l) && arry.push(l);
      }
    }

    var List__instance = new List__(this.List__instance_.type_);
    List__instance.valueArray_ = arry;
    List__instance.memorize();
    return List__instance.iterator;
  };


  /* ------------------------------------------------
  *
  * ListIteratorBackwards__ [Iterable]
  *
  * List__instance_.valueArray_
  * [***, ***]
  *
  ------------------------------------------------ */ 
  function ListIteratorBackwards__(List__instance) {
    this.List__instance_ = List__instance;
    this.reset()
  }

  ListIteratorBackwards__.prototype.IF = {
    key: true,
    value: true
  }

  // Getter
  utility.makeAccessorOnlyGetter(ListIteratorBackwards__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(ListIteratorBackwards__, {
    count: 'count'
  }, function() {
    return this.List__instance_.valueArray_.length;
  });

  ListIteratorBackwards__.prototype.reset = function() {
    this.List__instance_.iteratorBackwards_ = null;
    this.state_ = this.List__instance_.actionCount_;
    this.index_ = this.List__instance_.valueArray_.length;
  };

  ListIteratorBackwards__.prototype.next = ListIteratorBackwards__.prototype.hasNext = function() {
    if (this.List__instance_.actionCount_ !== this.state_ && this.key < 0) {
      return false;
    }

    var b = --this.index_;
    if (b >= 0) {
      this.key = b
      this.value = this.List__instance_.valueArray_[b];
      return true;
    }

    this.done();
    return false;
  };

  ListIteratorBackwards__.prototype.done = function() {
    this.key = -1;
    this.value = null;
    this.state_ = -1;
    this.List__instance_.iteratorBackwards_ = this;
  };

  ListIteratorBackwards__.prototype.first = function() {
    // this.state_ = this.List__instance_.actionCount_;
    var a = this.List__instance_.valueArray_.length - 1;
    this.index_ = a;
    var b;
    return 0 <= a ? (b = this.List__instance_.valueArray_[a], this.key = a, this.value = b) : null;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  ListIteratorBackwards__.prototype.any = function(callback) {
    this.List__instance_.iteratorBackwards_ = null;
    var e = this.List__instance_.valueArray_.length;
    this.index_ = e;
    for (e -= 1; 0 <= e; e--) {
      if (callback(this.List__instance_.valueArray_[e])) {
        return true;
      }
    }
    return false;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  ListIteratorBackwards__.prototype.all = function(callback) {
    this.List__instance_.iteratorBackwards_ = null;
    var e = this.List__instance_.valueArray_.length;
    this.index_ = e;
    for (e -= 1; 0 <= e; e--) {
      if (!callback(this.List__instance_.valueArray_[e])) {
        return false;
      }
    }
    return true;
  };

  // 配列の各要素に対してコールバック関数を呼び出す
  ListIteratorBackwards__.prototype.each = function(callback) {
    this.List__instance_.iteratorBackwards_ = null;
    var e = this.List__instance_.valueArray_.length;
    this.index_ = e;
    for (e -= 1; 0 <= e; e--) {
      callback(this.List__instance_.valueArray_[e]);
    }
    return this;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  ListIteratorBackwards__.prototype.map = function(callback) {
    this.List__instance_.iteratorBackwards_ = null;
    var arry = [],
      f = this.List__instance_.valueArray_.length;
    this.index_ = f;
    
    for (f -= 1; 0 <= f; f--) {
      arry.push(callback(this.List__instance_.valueArray_[f]));
    }

    var List__instance = new List__();
    List__instance.valueArray_ = arry;
    List__instance.memorize();
    return List__instance.iterator;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  ListIteratorBackwards__.prototype.filter = function(callback) {
    this.List__instance_.iteratorBackwards_ = null;
    var arry = [],
      f = this.List__instance_.valueArray_.length;
    this.index_ = f;
    
    for (f -= 1; 0 <= f; f--) {
      if (callback(this.List__instance_.valueArray_[f])) {
        arry.push(this.List__instance_.valueArray_[f]);
      }
    }

    var List__instance = new List__(this.List__instance_.type_);
    List__instance.valueArray_ = arry;
    List__instance.memorize();
    return List__instance.iterator;
  };


  /* ------------------------------------------------
  *
  * List__ [Iterable]
  *
  * 番号と値をセットにして管理するデータ構造
  * 番号を指定して値の取得、追加、更新、削除が可能
  * 値の重複は可
  * this.valueArray_
  * [***, ***]
  *
  ------------------------------------------------ */
  function List__(a) {
    utility.numberHashId(this);
    this.isFrozenFlag = false;
    this.valueArray_ = [];
    this.actionCount_ = 0;
    this.iteratorBackwards_ = this.iterator_ = null;

    if(a === void 0 || a === null){
      this.type_ = null;
    }
    else if(typeof a === 'string') {
      if('object' === a || 'string' === a || 'number' === a || 'boolean' === a || 'function' === a) {
        this.type_ = a;
      }
    }
    else if(typeof a === 'function'){
      if(a === Object){
        this.type_ = 'object';
      }
      else if (a === String) {
        this.type_ = 'string';
      }
      else if (a === Number) {
        this.type_ = 'number';
      }
      else if (a === Boolean) {
        this.type_ = 'boolean';
      }
      else if (a === Function) {
        this.type_ = 'function';
      }
      else {
        this.type_ = a;
      }
    }
  }

  utility.setObjectIntoNamespace('List', List__);

  List__.EnumValues = null;

  // Getter
  utility.makeAccessorOnlyGetter(List__, {
    count: 'count'
  }, function() {
    return this.valueArray_.length
  });

  utility.makeAccessorOnlyGetter(List__, {
    size: 'size'
  }, function() {
    return this.valueArray_.length
  });

  utility.makeAccessorOnlyGetter(List__, {
    length: 'length'
  }, function() {
    return this.valueArray_.length
  });

  utility.makeAccessorOnlyGetter(List__, {
    iterator: 'iterator'
  }, function() {
    if (this.valueArray_.length <= 0) {
      return new EmptyIterator__();
    }
    var a = this.iterator_;
    if (a !== null) {
      a.reset();
      return a;
    }
    else {
      return new ListIterator__(this);
    }
  });

  utility.makeAccessorOnlyGetter(List__, {
    iteratorBackwards: 'iteratorBackwards'
  }, function() {
    if (this.valueArray_.length <= 0) {
      return new EmptyIterator__();
    }
    var a = this.iteratorBackwards_;
    if (a !== null) {
      a.reset();
      return a;
    }
    else {
      return new ListIteratorBackwards__(this);
    }
  });
  
  List__.prototype.memorize = function() {
    var a = this.actionCount_;
    a++;
    a > 100000000 && (a = 0);
    this.actionCount_ = a;
  };
  
  List__.prototype.freeze = function() {
    this.isFrozenFlag = true;
    return this
  };
  
  List__.prototype.thaw = function() {
    this.isFrozenFlag = false;
    return this
  };

  List__.prototype.get = function(a) {
    var b = this.valueArray_;
    return b[a];
  };

  List__.prototype.set = function(a, b) {
    var c = this.valueArray_;
    c[a] = b;
    this.memorize();
  };
  
  List__.prototype.add = List__.prototype.push = function(value) {
    if (value !== null) {
      this.valueArray_.push(value);
      this.memorize();
    }
  };

  List__.prototype.addAll = function(a) {
    if (a === null) {
      return this;
    }
    var b = this.valueArray_;

    if (utility.isArray(a)){
      for (var c = a.length, d = 0; d < c; d++) {
        var e = a[d];
        b.push(e)
      }
    }
    else {
      for (a = a.iterator; a.next();) {
        e = a.value;
        b.push(e);
      }
    }

    this.memorize();
    return this;
  };

  List__.prototype.indexOf = function(a) {
    return a === null ? -1 : this.valueArray_.indexOf(a);
  };

  List__.prototype.first = function() {
    var a = this.valueArray_;
    return 0 === a.length ? null : a[0];
  };

  List__.prototype.last = function() {
    var a = this.valueArray_;
    var b = a.length;
    return 0 < b ? a[b - 1] : null
  };

  List__.prototype.pop = function() {
    var a = this.valueArray_;
    if (a.length > 0) {
      this.memorize();
      return a.pop();
    }
    else {
      return null;
    }
  };

  // 配列内に引数の値が含まれていればtrueを返す
  List__.prototype.contains = List__.prototype.has = function(a) {
    return a === null ? false : -1 !== this.valueArray_.indexOf(a);
  };

  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  List__.prototype.any = function(callback) {
    for (var b = this.valueArray_, d = b.length, e = 0; e < d; e++) {
      if (callback(b[e])) {
        return true;
      }
    }
    return false;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  List__.prototype.all = function(callback) {
    for (var b = this.valueArray_, d = b.length, e = 0; e < d; e++) {
      if (!callback(b[e])) {
        return false;
      }
    }
    return true;
  };

  // 配列の各要素に対してコールバック関数を呼び出す
  List__.prototype.each = function(callback) {
    for (var b = this.valueArray_, d = b.length, e = 0; e < d; e++) {
      callback(b[e]);
    }
    return this;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスを返す
  // 値の重複はありえるのでList__を使う
  List__.prototype.map = function(callback) {
    for (var b = new List__(this.type_), c = [], d = this.valueArray_, f = d.length, h = 0; h < f; h++) {
      c.push(callback(d[h]));
    }
    b.valueArray_ = c;
    b.memorize();
    return b;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスを返す
  // 値の重複はありえるのでList__を使う
  List__.prototype.filter = function(callback) {
    for (var b = new List__(this.type_), c = [], d = this.valueArray_, f = d.length, h = 0; h < f; h++) {
      if (callback(d[h])) {
        c.push(d[h]);
      }
    }
    b.valueArray_ = c;
    b.memorize();
    return b;
  };

  List__.prototype.insertAt = function(a, b) {
    var c = this.valueArray_;
    if (a >= c.length) {
      c.push(b);
    }
    else {
      c.splice(a, 0, b);
    }
    this.memorize();
    return true;
  };

  List__.prototype.clear = function() {
    this.valueArray_.length = 0;
    this.memorize();
  };

  List__.prototype.remove = List__.prototype['delete'] = function(a) {
    if (a === null) {
      return false;
    }
    var b = this.valueArray_;
    a = b.indexOf(a);
    if (-1 === a) {
      return false;
    }
    if (a === b.length - 1) {
      b.pop();
    }
    else {
      b.splice(a, 1);
    }
    this.memorize();
    return true;
  };

  List__.prototype.removeAt = function(a) {
    var b = this.valueArray_;
    if (a === b.length - 1) {
      b.pop();
    } 
    else {
      b.splice(a, 1);
    }
    this.memorize();
  };

  List__.prototype.removeRange = function(a, b) {
    var c = this.valueArray_;
    var d = c.slice((b || a) + 1 || c.length);
    c.length = 0 > a ? c.length + a : a;
    // 連結
    c.push.apply(c, d);
    this.memorize();
  };

  List__.prototype.sort = function(a) {
    this.valueArray_.sort(a);
    this.memorize();
    return this;
  };

  List__.prototype.sortRange = function(a, b, c) {
    var d = this.valueArray_;
    var e = d.length;
    
    if (b === void 0) {
      b = 0;
    }

    if (c === void 0) {
      c = e
    }

    var f = c - b;
    
    if (1 >= f) {
      return this;
    }

    if (2 === f) {
      c = d[b];
      e = d[b + 1];
      if (0 < a(c, e)) {
        d[b] = e;
        d[b + 1] = c;
        this.memorize();
      }
      return this;
    }

    if (0 === b) {
      if (c >= e) {
        d.sort(a);
      }
      else {
        for (f = d.slice(0, c), f.sort(a), a = 0; a < c; a++) {
          d[a] = f[a];
        }
      }
    }
    else if (c >= e) {
      for (f = d.slice(b), f.sort(a), a = b; a < e; a++) {
        d[a] = f[a - b];
      }
    }
    else {
      for (f = d.slice(b, c), f.sort(a), a = b; a < c; a++) {
        d[a] = f[a - b];
      }
    }

    this.memorize();
    return this;
  };

  List__.prototype.reverse = function() {
    this.valueArray_.reverse();
    this.memorize();
    return this;
  };

  List__.prototype.copy = function() {
    var a = new List__(this.type_);
    var b = this.valueArray_;
    if (b.length > 0) {
      a.valueArray_ = Array.prototype.slice.call(b);
    }
    return a;
  };

  List__.prototype.toArray = List__.prototype.dc = function() {
    for (var a = this.valueArray_, b = this.count, c = Array(b), d = 0; d < b; d++) {
      c[d] = a[d];
    }
    return c;
  };

  List__.prototype.toSet = function() {
    for (var a = new Set__(this.type_), b = this.valueArray_, c = this.count, d = 0; d < c; d++) {
      a.add(b[d]);
    }
    return a;
  };


  /* ------------------------------------------------
  *
  * MapKeySetIterator__ [Iterable]
  *
  * this.mapValueSets_
  * {
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***},
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***}
  * }
  * MapValueSet__インスタンスのkey値を対象とする
  *
  ------------------------------------------------ */
  function MapKeySetIterator__(Map__instance) {
    this.Map__instance_ = Map__instance;
    this.reset();
  }

  MapKeySetIterator__.prototype.IF = {
    key: true,
    value: true
  }
  
  // Getter
  utility.makeAccessorOnlyGetter(MapKeySetIterator__, {
    iterator: 'iterator'
  }, function() {
    return this
  });

  utility.makeAccessorOnlyGetter(MapKeySetIterator__, {
    count: 'count'
  }, function() {
    return this.Map__instance_.count_
  });
  
  MapKeySetIterator__.prototype.reset = function() {
    this.state_ = this.Map__instance_.actionCount_;
    this.lastValidatedValueSet_ = null
  };
  
  MapKeySetIterator__.prototype.next = MapKeySetIterator__.prototype.hasNext = function() {
    var a = this.Map__instance_;

    // (hasNext)
    if (a.actionCount_ !== this.state_ && this.key === null) {
      return false;
    }

    var b = this.lastValidatedValueSet_;

    if (b === null) {
      b = a.firstAddedValueSet_;
    }
    else {
      b = b.juniorValueSet_;
    }

    if (b !== null) {
      this.lastValidatedValueSet_ = b;
      this.value = this.key = b.key;
      return true;
    }

    this.done();
    return false;
  };

  MapKeySetIterator__.prototype.done = function() {
    this.value = this.key = null;
    this.state_ = -1;
  };
  
  MapKeySetIterator__.prototype.first = function() {
    var a = this.Map__instance_;
    // this.state_ = a.actionCount_;
    a = a.firstAddedValueSet_;
    if (a !== null) {
      this.lastValidatedValueSet_ = a;
      this.value = this.key = a.key;
      return a.key;
    }
    else {
      return null;
    }
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  MapKeySetIterator__.prototype.any = function(callback) {
    var b = this.Map__instance_;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (callback(d.key)) {
        return true;
      }
      d = d.juniorValueSet_;
    }
    return false;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  MapKeySetIterator__.prototype.all = function(callback) {
    var b = this.Map__instance_;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (!callback(d.key)) {
        return false;
      }
      d = d.juniorValueSet_;
    }
    return true;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出す
  MapKeySetIterator__.prototype.each = function(callback) {
    var b = this.Map__instance_;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      callback(d.key);
      d = d.juniorValueSet_;
    }
    return this;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  MapKeySetIterator__.prototype.map = function(callback) {
    var b = this.Map__instance_;
    this.lastValidatedValueSet_ = null;
    for (var d = new List__(b.keyType_), e = b.firstAddedValueSet_; e !== null;) {
      d.add(callback(e.key));
      e = e.juniorValueSet_;
    }
    return d.iterator
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  MapKeySetIterator__.prototype.filter = function(callback) {
    var b = this.Map__instance_;
    this.lastValidatedValueSet_ = null;
    for (var d = new List__(b.keyType_), e = b.firstAddedValueSet_; e !== null;) {
      if (callback(e.key)) {
        d.add(e.key);
      }
      e = e.juniorValueSet_
    }
    return d.iterator;
  };


  /* ------------------------------------------------
  *
  * MapKeySet__ [Iterable]
  *
  * Map__instance_.mapValueSets_
  * {
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***},
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***}
  * }
  * MapValueSet__インスタンスのkey値を対象とする
  *
  ------------------------------------------------ */
  function MapKeySet__(Map__instance) {
    utility.numberHashId(this);
    this.isFrozenFlag = true;
    this.Map__instance_ = Map__instance;
  }

  utility.inherits(MapKeySet__, Set__);

  // Getter
  utility.makeAccessorOnlyGetter(MapKeySet__, {
    count: 'count'
  }, function() {
    return this.Map__instance_.count_;
  });
  
  utility.makeAccessorOnlyGetter(MapKeySet__, {
    size: 'size'
  }, function() {
    return this.Map__instance_.count_;
  });

  utility.makeAccessorOnlyGetter(MapKeySet__, {
    iterator: 'iterator'
  }, function() {
    return this.Map__instance_.count_ <= 0 ? new EmptyIterator__() : new MapKeySetIterator__(this.Map__instance_);
  });

  // オーバーライド
  MapKeySet__.prototype.freeze = function() {
    return this;
  };
  
  MapKeySet__.prototype.thaw = function() {
    return this;
  };

  MapKeySet__.prototype.add = MapKeySet__.prototype.set = function() {
    return false;
  };
  
  MapKeySet__.prototype.contains = MapKeySet__.prototype.has = function(a) {
    return this.Map__instance_.contains(a);
  };
  
  MapKeySet__.prototype.clear = function() {

  };

  MapKeySet__.prototype.remove = MapKeySet__.prototype['delete'] = function() {
    return false;
  };
  // /オーバーライド
  
  MapKeySet__.prototype.first = function() {
    var a = this.Map__instance_.firstAddedValueSet_;
    return a !== null ? a.key : null;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  MapKeySet__.prototype.any = function(callback) {
    for (var b = this.Map__instance_.firstAddedValueSet_; b !== null;) {
      if (callback(b.key)) return true;
      b = b.juniorValueSet_;
    }
    return false
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  MapKeySet__.prototype.all = function(callback) {
    for (var b = this.Map__instance_.firstAddedValueSet_; b !== null;) {
      if (!callback(b.key)) return false;
      b = b.juniorValueSet_;
    }
    return true
  };
  
  // 配列の各要素に対してコールバック関数を呼び出す
  MapKeySet__.prototype.each = function(callback) {
    for (var b = this.Map__instance_.firstAddedValueSet_; b !== null;) {
      callback(b.key);
      b = b.juniorValueSet_;
    }
    return this;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスを返す
  // 値の重複はありえるのでList__を使う
  MapKeySet__.prototype.map = function(callback) {
    for (var b = new List__(this.Map__instance_.keyType_), c = this.Map__instance_.first1dedValueSet_; c !== null;) {
      b.add(callback(c.key));
      c = c.juniorValueSet_;
    }
    return b;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスを返す
  // 値の重複はありえるのでList__を使う
  MapKeySet__.prototype.filter = function(callback) {
    for (var b = new List__(this.Map__instance_.keyType_), c = this.Map__instance_.firstAddedValueSet_; c !== null;) {
      if (callback(c.key)) {
        b.add(c.key);
      }
      c = c.juniorValueSet_;
    }
    return b;
  };
  
  MapKeySet__.prototype.copy = function() {
    return new MapKeySet__(this.Map__instance_)
  };
  
  MapKeySet__.prototype.toSet = function() {
    var a = new Set__(this.Map__instance_.keyType_),
      b = this.Map__instance_.mapValueSets_,
      c;
    for (c in b) {
      a.add(b[c].key);
    }
    return a
  };
  
  MapKeySet__.prototype.toArray = MapKeySet__.prototype.dc = function() {
    var a = this.Map__instance_.mapValueSets_,
      b = Array(this.Map__instance_.count_),
      c = 0,
      d;
    for (d in a) {
      b[c] = a[d].key;
      c++;
    }
    return b
  };
  
  MapKeySet__.prototype.toList = function() {
    var a = new List__(this.type_),
      b = this.Map__instance_.mapValueSets_,
      c;
    for (c in b) {
      a.add(b[c].key);
    }
    return a;
  };


  /* ------------------------------------------------
  *
  * MapValueSetIterator__ [Iterable]
  *
  * Map__instance_.mapValueSets_
  * {
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***},
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***}
  * }
  * MapValueSet__インスタンスのvalue値を対象とする
  *
  ------------------------------------------------ */
  function MapValueSetIterator__(Map__instance) {
    this.Map__instance_ = Map__instance;
    this.reset();
  }

  MapValueSetIterator__.prototype.IF = {
    key: true,
    value: true
  }
  
  // Getter
  utility.makeAccessorOnlyGetter(MapValueSetIterator__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(MapValueSetIterator__, {
    count: 'count'
  }, function() {
    return this.Map__instance_.count_;
  });

  MapValueSetIterator__.prototype.reset = function() {
    this.Map__instance_.valueSetIterator_ = null;
    this.state_ = this.Map__instance_.actionCount_;
    this.lastValidatedValueSet_ = null;
  };

  MapValueSetIterator__.prototype.next = MapValueSetIterator__.prototype.hasNext = function() {
    var a = this.Map__instance_;

    // (hasNext)
    if (a.actionCount_ !== this.state_ && this.key === null) {
      return false;
    }

    var b = this.lastValidatedValueSet_;
    if (b === null) {
      b = a.firstAddedValueSet_;
    }
    else {
      b = b.juniorValueSet_;
    }

    if (b !== null) {
      this.lastValidatedValueSet_ = b;
      this.key = b.key;
      this.value = b.value;
      return true;
    }

    this.done();
    return false;
  };

  MapValueSetIterator__.prototype.done = function() {
    this.value = this.key = null;
    this.state_ = -1;
    this.Map__instance_.valueSetIterator_ = this;
  };

  MapValueSetIterator__.prototype.first = function() {
    var a = this.Map__instance_;
    // this.state_ = a.actionCount_;
    a = a.firstAddedValueSet_;
    if (a !== null) {
      this.lastValidatedValueSet_ = a;
      this.key = a.key;
      this.value = a.value;
      return a.value;
    }
    else {
      return null;
    }
  };

  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  MapValueSetIterator__.prototype.any = function(callback) {
    var b = this.Map__instance_;
    b.valueSetIterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (callback(d.value)) {
        return true;
      }
      d = d.juniorValueSet_;
    }
    return false;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  MapValueSetIterator__.prototype.all = function(callback) {
    var b = this.Map__instance_;
    b.valueSetIterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (!callback(d.value)) {
        return false;
      }
      d = d.juniorValueSet_;
    }
    return true;
  };

  // 配列の各要素に対してコールバック関数を呼び出す
  MapValueSetIterator__.prototype.each = function(callback) {
    var b = this.Map__instance_;
    b.valueSetIterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      callback(d.value);
      d = d.juniorValueSet_;
    }
    return this;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  MapValueSetIterator__.prototype.map = function(callback) {
    var b = this.Map__instance_;
    b.valueSetIterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = new List__(b.keyType_), e = b.firstAddedValueSet_; e !== null;) {
      d.add(callback(e.value));
      e = e.juniorValueSet_;
    }
    return d.iterator;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスのイテレータを返す
  // 値の重複はありえるのでList__を使う
  MapValueSetIterator__.prototype.filter = function(callback) {
    var b = this.Map__instance_;
    b.valueSetIterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = new List__(b.keyType_), e = b.firstAddedValueSet_; e !== null;) {
      if (callback(e.value)) {
        d.add(e.value);
      }
      e = e.juniorValueSet_;
    }
    return d.iterator;
  };


  /* ------------------------------------------------
  *
  * MapValueSet__
  *
  *
  ------------------------------------------------ */
  function MapValueSet__(key, value) {
    utility.numberHashId(this);
    this.key = key;
    this.value = value;
    this.seniorValueSet_ = this.juniorValueSet_ = null
  }

  MapValueSet__.prototype.IF = {
    key: true,
    value: true
  }


  /* ------------------------------------------------
  *
  * MapIterator__ [Iterable]
  *
  * Map__instance_.mapValueSets_
  * {
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***},
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***}
  * }
  * MapValueSet__インスタンスを対象とする
  *
  ------------------------------------------------ */
  function MapIterator__(Map__instance) {
    this.Map__instance_ = Map__instance;
    this.reset();
  }

  MapIterator__.prototype.IF = {
    key: true,
    value: true
  }

  // Getter
  utility.makeAccessorOnlyGetter(MapIterator__, {
    iterator: 'iterator'
  }, function() {
    return this;
  });

  utility.makeAccessorOnlyGetter(MapIterator__, {
    count: 'count'
  }, function() {
    return this.Map__instance_.count_;
  });

  MapIterator__.prototype.reset = function() {
    this.Map__instance_.iterator_ = null;
    this.state_ = this.Map__instance_.actionCount_;
    this.lastValidatedValueSet_ = null;
  };

  MapIterator__.prototype.next = MapIterator__.prototype.hasNext = function() {
    var a = this.Map__instance_;

    // (hasNext)
    if (a.actionCount_ !== this.state_ && this.key === null) {
      return false;
    }

    var b = this.lastValidatedValueSet_;
    if (b === null) {
      b = a.firstAddedValueSet_;
    }
    else {
      b = b.juniorValueSet_;
    }

    if (b !== null) {
      this.lastValidatedValueSet_ = b;
      this.key = b.key;
      this.value = b.value;
      return true;
    }

    this.done();
    return false;
  };

  MapIterator__.prototype.done = function() {
    this.value = this.key = null;
    this.state_ = -1;
    this.Map__instance_.iterator_ = this;
  };

  MapIterator__.prototype.first = function() {
    var a = this.Map__instance_;
    // this.state_ = a.actionCount_;
    a = a.firstAddedValueSet_;
    if (a !== null) {
      this.lastValidatedValueSet_ = a;
      this.key = a.key;
      this.value = a.value;
      return a;
    }
    else {
      return null;
    }
  };

  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  MapIterator__.prototype.any = function(callback) {
    var b = this.Map__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (callback(d)) {
        return true;
      }
      d = d.juniorValueSet_;
    }
    return false;
  };

  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  MapIterator__.prototype.all = function(callback) {
    var b = this.Map__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      if (!callback(d)) {
        return false;
      }
      d = d.juniorValueSet_;
    }
    return true;
  };

  // 配列の各要素に対してコールバック関数を呼び出す
  MapIterator__.prototype.each = function(callback) {
    var b = this.Map__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = b.firstAddedValueSet_; d !== null;) {
      callback(d);
      d = d.juniorValueSet_;
    }
    return this;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むList__インスタンスのイテレータを返す
  MapIterator__.prototype.map = function(callback) {
    var b = this.Map__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = new List__(b.keyType_), e = b.firstAddedValueSet_; e !== null;) {
      d.add(callback(e));
      e = e.juniorValueSet_;
    }
    return d.iterator;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むList__インスタンスのイテレータを返す
  MapIterator__.prototype.filter = function(callback) {
    var b = this.Map__instance_;
    b.iterator_ = null;
    this.lastValidatedValueSet_ = null;
    for (var d = new List__(b.keyType_), e = b.firstAddedValueSet_; e !== null;) {
      if (callback(e)) {
        d.add(e);
      }
      e = e.juniorValueSet_;
    }
    return d.iterator;
  };


  /* ------------------------------------------------
  *
  * Map__ [Iterable]
  *
  * キーと値をセットにして管理するデータ構造
  * キーを指定して値の取得、追加、更新、削除が可能
  * 同じキーがセット(put)された場合は上書きする
  * this.mapValueSets_
  * {
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***},
  *   hashId_: MapValueSet__インスタンス{key: ***, value: ***}
  * }
  * MapValueSet__インスタンスを対象とする
  *
  ------------------------------------------------ */
  function Map__(a, b) {
    utility.numberHashId(this);
    this.isFrozenFlag = false;

    if(a === void 0 || a === null){
      this.keyType_ = null;
    }
    else if(typeof a === 'string') {
      if('object' === a || 'string' === a || 'number' === a || 'boolean' === a || 'function' === a) {
        this.keyType_ = a;
      }
    }
    else if(typeof a === 'function'){
      if(a === Object){
        this.keyType_ = 'object';
      }
      else if (a === String) {
        this.keyType_ = 'string';
      }
      else if (a === Number) {
        this.keyType_ = 'number';
      }
      else if (a === Boolean) {
        this.keyType_ = 'boolean';
      }
      else if (a === Function) {
        this.keyType_ = 'function';
      }
      else {
        this.keyType_ = a;
      }
    }

    if(b === void 0 || b === null){
      this.valueType_ = null;
    }
    else if(typeof b === 'string') {
      if('object' === b || 'string' === b || 'number' === b || 'boolean' === b || 'function' === b) {
        this.valueType_ = b;
      }
    }
    else if(typeof b === 'function'){
      if(b === Object){
        this.valueType_ = 'object';
      }
      else if (b === String) {
        this.valueType_ = 'string';
      }
      else if (b === Number) {
        this.valueType_ = 'number';
      }
      else if (b === Boolean) {
        this.valueType_ = 'boolean';
      }
      else if (b === Function) {
        this.valueType_ = 'function';
      }
      else {
        this.valueType_ = b;
      }
    }

    this.mapValueSets_ = {};
    this.count_ = 0;
    this.valueSetIterator_ = this.iterator_ = null;
    this.actionCount_ = 0;
    this.lastAddedValueSet__ = this.firstAddedValueSet_ = null;
  }

  utility.setObjectIntoNamespace('Map', Map__);

  Map__.EnumValues = null;

  // Getter
  utility.makeAccessorOnlyGetter(Map__, {
    count: 'count'
  }, function() {
    return this.count_;
  });

  utility.makeAccessorOnlyGetter(Map__, {
    size: 'size'
  }, function() {
    return this.count_;
  });

  utility.makeAccessorOnlyGetter(Map__, {
    iterator: 'iterator'
  }, function() {
    if (this.count_ <= 0) {
      return new EmptyIterator__();
    }
    var a = this.iterator_;
    if (a !== null) {
      a.reset();
      return a;
    }
    else {
      return new MapIterator__(this);
    }
  });

  utility.makeAccessorOnlyGetter(Map__, {
    iteratorKeys: 'iteratorKeys'
  }, function() {
    if (this.count_ <= 0) {
      return new EmptyIterator__();
    }
    else {
      return new MapKeySetIterator__(this);
    }
  });
  
  utility.makeAccessorOnlyGetter(Map__, {
    iteratorValues: 'iteratorValues'
  }, function() {
    if (this.count_ <= 0) {
      return new EmptyIterator__();
    }
    var a = this.valueSetIterator_;
    if (a !== null) {
      a.reset();
      return a;
    }
    else {
      return new MapValueSetIterator__(this);
    }
  });
  
  Map__.prototype.memorize = function() {
    var a = this.actionCount_;
    a++;
    if (a > 999999999) {
      a = 0;
    }
    this.actionCount_ = a;
  };

  Map__.prototype.freeze = function() {
    this.isFrozenFlag = true;
    return this;
  };
  
  Map__.prototype.thaw = function() {
    this.isFrozenFlag = false;
    return this;
  };

  Map__.prototype.getValue = Map__.prototype.get = function(hashId) {
    var hashId_ = hashId;
    if (utility.isObject(hashId)) {
      hashId_ = hashId.hashId;
      if (hashId_ === void 0) {
        return null;
      }
    }
    var me = this.mapValueSets_[hashId_];
    if (me === void 0) {
      return null;
    }
    else {
      return me.value;
    }
  };
  
  Map__.prototype.add = Map__.prototype.set = function(key, value) {
    var hashId_ = key;
    
    if (utility.isObject(key)) {
      // hashIdIndexを返す
      hashId_ = utility.getHashId(key);
    }

    // console.log('----START----');
    // console.log('key:' + key);
    // console.log('hashId_:' + hashId_);
    // console.log(this.mapValueSets_);
    // console.log('---- END ----');

    var MapValueSet__instance = this.mapValueSets_[hashId_];
    
    if (MapValueSet__instance === void 0) {
      MapValueSet__instance = new MapValueSet__(key, value);

      this.mapValueSets_[hashId_] = MapValueSet__instance;
      
      if (this.lastAddedValueSet__ === null) {
        this.firstAddedValueSet_ = MapValueSet__instance;
      }
      else {
        MapValueSet__instance.seniorValueSet_ = this.lastAddedValueSet__;
        this.lastAddedValueSet__.juniorValueSet_ = MapValueSet__instance;
      }
      this.lastAddedValueSet__ = MapValueSet__instance;
      this.count_++;
      this.memorize();
      return true;
    }
    else {
      // 未定義じゃなかった場合に値を上書きする(set)
      MapValueSet__instance.value = value;
      return true;
    }

  };

  Map__.prototype.addAll = function(a) {
    if (a === null) {
      return this;
    }
    if (utility.isArray(a)){
      for (var b = a.length, c = 0; c < b; c++) {
        var d = a[c];
        this.add(d.key, d.value);
      }
    }
    else {
      for (a = a.iterator; a.next();) {
        this.add(a.key, a.value);
      }
    }
    return this;
  };

  Map__.prototype.first = function() {
    return this.firstAddedValueSet_;
  };

  // 配列内に引数の値が含まれていればtrueを返す
  Map__.prototype.contains = Map__.prototype.has = function(hashId) {
    var hashId_ = hashId;
    if (utility.isObject(hashId) && (hashId_ = hashId.hashId, hashId_ === void 0)) {
      return false;
    }
    else {
      return this.mapValueSets_[hashId_] !== void 0;
    }
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、一つでもtrueならtrueを返す
  Map__.prototype.any = function(callback) {
    for (var valueSet = this.firstAddedValueSet_; valueSet !== null;) {
      if (callback(valueSet)) {
        return true;
      }
      valueSet = valueSet.juniorValueSet_;
    }
    return false;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、すべてtrueならtrueを返す
  Map__.prototype.all = function(callback) {
    for (var valueSet = this.firstAddedValueSet_; valueSet !== null;) {
      if (!callback(valueSet)) {
        return false;
      }
      valueSet = valueSet.juniorValueSet_;
    }
    return true;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出す
  Map__.prototype.each = function(callback) {
    for (var valueSet = this.firstAddedValueSet_; valueSet !== null;) {
      callback(valueSet);
      valueSet = valueSet.juniorValueSet_;
    }
    return this;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // 結果を含むMap__インスタンスを返す
  Map__.prototype.map = function(callback) {
    for (var b = new Map__(this.keyType_, this.valueType_), valueSet = this.firstAddedValueSet_; valueSet !== null;) {
      b.add(valueSet.key, callback(valueSet));
      valueSet = valueSet.juniorValueSet_;
    }
    return b;
  };
  
  // 配列の各要素に対してコールバック関数を呼び出し、
  // trueになった結果を含むMap__インスタンスを返す
  Map__.prototype.filter = function(callback) {
    for (var b = new Map__(this.keyType_, this.valueType_), valueSet = this.firstAddedValueSet_; valueSet !== null;) {
      if (callback(valueSet)) {
        b.add(valueSet.key, valueSet.value);
        valueSet = valueSet.juniorValueSet_;
      }
    }
    return b;
  };

  Map__.prototype.clear = function() {
    this.mapValueSets_ = {};
    this.lastAddedValueSet__ = this.firstAddedValueSet_ = null;
    this.count_ = 0;
    this.memorize();
  };
  
  Map__.prototype.remove = Map__.prototype['delete'] = function(hashId) {
    if (hashId === null) {
      return false;
    }
    var hashId_ = hashId;
    if (utility.isObject(hashId)) {
      hashId_ = hashId.hashId;
      if (hashId_ === void 0) {
        return false;
      }
    }

    var me = this.mapValueSets_[hashId_];
    if (me === void 0) {
      return false;
    }

    var juniorOfMe = me.juniorValueSet_;
    var seniorOfMe = me.seniorValueSet_;

    if (juniorOfMe !== null) {
      juniorOfMe.seniorValueSet_ = seniorOfMe;
    }
    if (seniorOfMe !== null) {
      seniorOfMe.juniorValueSet_ = juniorOfMe;
    }

    if (me === this.firstAddedValueSet_) {
      this.firstAddedValueSet_ = juniorOfMe;
    }
    if (me === this.lastAddedValueSet__) {
      this.lastAddedValueSet__ = seniorOfMe;
    }

    delete this.mapValueSets_[hashId_];

    this.count_--;
    this.memorize();
    return true;
  };
  
  Map__.prototype.copy = function() {
    var a = new Map__(this.keyType_, this.valueType_);
    for (var key in this.mapValueSets_) {
      a.add(this.mapValueSets_[key].key, this.mapValueSets_[key].value)
    }
    return a;
  };
  
  Map__.prototype.toArray = function() {
    var a = Array(this.count_);
    var b = this.mapValueSets_;
    var c = 0;
    for (var d in b) {
      a[c] = new MapValueSet__(b[d].key, b[d].value);
      c++;
    }
    return a;
  };
  
  Map__.prototype.toKeySet = function() {
    return new MapKeySet__(this);
  };


  /* ------------------------------------------------
  * Export
  ------------------------------------------------ */
  if (window) {
    if (window.module && typeof window.module === 'object' && typeof window.module.exports === 'object') {
      window.module.exports = collection;
    }
    else {
      if (window.define && typeof window.define === 'function' && window.define.amd) {
        window.Industries.Collection = collection;
        window.define(collection);
      }
      else {
        window.Industries.Collection = collection;
      }
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = collection;
  }

})(window);
