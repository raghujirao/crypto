/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
//  Crypto Test Harness                                                    (c) Chris Veness 2014  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

var chai = require('chai');  // BDD/TDD assertion library

chai.should();
var test = it; // just an alias

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* AES - test vectors: csrc.nist.gov/publications/fips/fips197/fips-197.pdf C.1                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

describe('aes', function() {
    var Aes = require('./aes.js');

    var plaintext = vectorToBytes('00 11 22 33 44 55 66 77 88 99 aa bb cc dd ee ff');

    var key128    = vectorToBytes('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');
    var cipher128 = vectorToBytes('69 c4 e0 d8 6a 7b 04 30 d8 cd b7 80 70 b4 c5 5a');

    var key192    = vectorToBytes('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 10 11 12 13 14 15 16 17');
    var cipher192 = vectorToBytes('dd a9 7c a4 86 4c df e0 6e af 70 a0 ec 0d 71 91');

    var key256    = vectorToBytes('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 10 11 12 13 14 15 16 17 18 19 1a 1b 1c 1d 1e 1f');
    var cipher256 = vectorToBytes('8e a2 b7 ca 51 67 45 bf ea fc 49 90 4b 49 60 89');

    test('Aes-128-bit test vector', function() { Aes.cipher(plaintext, Aes.keyExpansion(key128)).should.eql(cipher128); });
    test('Aes-192-bit test vector', function() { Aes.cipher(plaintext, Aes.keyExpansion(key192)).should.eql(cipher192); });
    test('Aes-256-bit test vector', function() { Aes.cipher(plaintext, Aes.keyExpansion(key256)).should.eql(cipher256); });

    function vectorToBytes(v) {
        var a = v.split(/ /);
        for (var i=0; i<a.length; i++) a[i] = parseInt('0x'+a[i]);
        return a;
    }

    function bytesToVector(b) {
        var v = b.slice(); // clone b
        for (var i=0; i<v.length; i++) {
            v[i] = v[i]<0x10 ? '0'+v[i].toString(16) : v[i].toString(16);
        }
        return v.join(' ');
    }
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Aes CTR: test Unicode text & password (ciphertext will be different on each invocation)        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

describe('aes.ctr', function() {
    var Aes = require('./aes.js');
    Aes.Ctr = require('./aes-ctr.js');

    var origtext = 'My big secret סוד קצת بت سرية  ความลับบิต 位的秘密';
    var ciphertext = Aes.Ctr.encrypt(origtext, 'pāšşŵōřđ', 256);
    var decrtext = Aes.Ctr.decrypt(ciphertext, 'pāšşŵōřđ', 256);

    test('decrypted ciphertext matches original text', function() { decrtext.should.equal(origtext); });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Block TEA: test decrypted encrypted text matches original text (with Unicode text & password)  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

describe('tea-block', function() {
    var Tea = require('./tea-block.js');

    var origtext = 'My big secret סוד קצת بت سرية  ความลับบิต 位的秘密';
    var ciphertext = Tea.encrypt(origtext, 'pāšşŵōřđ');
    var decrtext = Tea.decrypt(ciphertext, 'pāšşŵōřđ');

    test('decrypted ciphertext matches original text', function() { decrtext.should.equal(origtext); });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-1: csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA1.pdf                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

describe('sha1', function() {
    var Sha1 = require('./sha1.js');

    var msg1 = 'abc';
    test('sha1 1 block msg', function() { Sha1.hash(msg1).should.equal('a9993e364706816aba3e25717850c26c9cd0d89d'); });
    var msg2 = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq';
    test('sha1 2 block msg', function() { Sha1.hash(msg2).should.equal('84983e441c3bd26ebaae4aa1f95129e5e54670f1'); });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-256: csrc.nist.gov/groups/ST/toolkit/documents/Examples/SHA256.pdf                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

describe('sha256', function() {
    var Sha256 = require('./sha256.js');

    var msg1 = 'abc';
    test('sha256 1 block msg', function() { Sha256.hash(msg1).should.equal('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'); });
    var msg2 = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq';
    test('sha256 2 block msg', function() { Sha256.hash(msg2).should.equal('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'); });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
