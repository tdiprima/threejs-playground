// See: https://github.com/kaimallea/isMobile/blob/master/src/isMobile.ts
(function (a) {
  var appleIphone = /iPhone/i;
  var appleIpod = /iPod/i;
  var appleTablet = /iPad/i;
  var androidPhone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i;
  var androidTablet = /Android/i;
  var amazonPhone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i;
  var h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i;
  var ieMobile = /IEMobile/i;
  var windowsTablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i;
  var otherBlackBerry = /BlackBerry/i;
  var otherBlackBerry10 = /BB10/i;
  var otherOpera = /Opera Mini/i;
  var otherChrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i;
  var otherFirefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i;

  var nexus = new RegExp('(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)', 'i');

  var q = function (a, b) {
    return a.test(b);
  };

  var r = function (a) {
    var r = a || navigator.userAgent;
    var s = r.split('[FBAN');

    if (typeof s[1] != 'undefined') {
      r = s[0];
    }

    this.apple = {
      phone: q(appleIphone, r),
      ipod: q(appleIpod, r),
      tablet: !q(appleIphone, r) && q(appleTablet, r),
      device: q(appleIphone, r) || q(appleIpod, r) || q(appleTablet, r),
    };

    this.amazon = {
      phone: q(amazonPhone, r),
      tablet: !q(amazonPhone, r) && q(h, r),
      device: q(amazonPhone, r) || q(h, r),
    };

    this.android = {
      phone: q(amazonPhone, r) || q(androidPhone, r),
      tablet: !q(amazonPhone, r) && !q(androidPhone, r) && (q(h, r) || q(androidTablet, r)),
      device: q(amazonPhone, r) || q(h, r) || q(androidPhone, r) || q(androidTablet, r),
    };

    this.windows = {
      phone: q(ieMobile, r),
      tablet: q(windowsTablet, r),
      device: q(ieMobile, r) || q(windowsTablet, r),
    };

    this.other = {
      blackberry: q(otherBlackBerry, r),
      blackberry10: q(otherBlackBerry10, r),
      opera: q(otherOpera, r),
      firefox: q(otherFirefox, r),
      chrome: q(otherChrome, r),
      device: q(otherBlackBerry, r) || q(otherBlackBerry10, r) || q(otherOpera, r) || q(otherFirefox, r) || q(otherChrome, r),
    };

    this.seven_inch = q(nexus, r);

    this.any =
      this.apple.device ||
      this.android.device ||
      this.windows.device ||
      this.other.device ||
      this.seven_inch;

    this.phone = this.apple.phone || this.android.phone || this.windows.phone;

    this.tablet =
      this.apple.tablet || this.android.tablet || this.windows.tablet;

    if (typeof window == 'undefined') {
      return this;
    } else {
      return;
    }
  };

  var s = function () {
    var a = new r();
    a.Class = r;
    return a;
  };

  if (
    typeof module != 'undefined' &&
    module.exports &&
    typeof window == 'undefined'
  ) {
    module.exports = r;
  } else if (
    typeof module != 'undefined' &&
    module.exports &&
    typeof window != 'undefined'
  ) {
    module.exports = s();
  } else if (typeof define == 'function' && define.amd) {
    define('isMobile', [], (a.isMobile = s()));
  } else {
    a.isMobile = s();
  }
})(this);

// isMobile.any
