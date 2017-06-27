//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
let passed = true;

function assertEquals(expected, actual) {
    if (expected != actual) {
        passed = false;
        throw `Expected ${expected}, received ${actual}`;
    }
}

const INITIAL_SIZE = 1;
const memObj = new WebAssembly.Memory({initial:INITIAL_SIZE});
const module = new WebAssembly.Module(readbuffer('comp.wasm'));
const instance = new WebAssembly.Instance(module, { "dummy" : { "memory" : memObj } }).exports;
const arrays = {
    "i32x4" : new Int32Array (memObj.buffer),
    "i16x8" : new Int16Array (memObj.buffer),
    "i8x16" : new Int8Array (memObj.buffer),
    "f32x4" : new Float32Array (memObj.buffer)
};

function moveArgsIntoArray(args, offset, arr) {
    for (let i = 0; i < args.length; i++) {
        arr[offset + i] = args[i];
    }
}

let testCompOps = function (funcname, args1, args2, op, resultArr) {

    const len = args1.length;
    const arr = arrays[funcname.split('_')[1]];

    moveArgsIntoArray(args1, 0, arr);
    moveArgsIntoArray(args2, len, arr);    
    instance[funcname](op);
    for (let i = 0; i < len; i++) {
        assertEquals(resultArr[i], Number.isNaN(arr[i]) || !!arr[i]);
    }
}

testCompOps("func_i32x4_compare_s",
    [2147483647,0,-100,-2147483648],
    [2147483647,45,202,-2147483648],
    0,// eq
    [1,0,0,1]
);

testCompOps("func_i32x4_compare_s",
    [277,2147483647,-100,2147483647],
    [431,2147483647,555,2147483647],
    0,// eq
    [0,1,0,1]
);

testCompOps("func_i32x4_compare_s",
    [2147483647,0,-100,-2147483648],
    [2147483647,45,202,-2147483648],
    1,// ne
    [0,1,1,0]
);

testCompOps("func_i32x4_compare_s",
    [277,2147483647,-100,2147483647],
    [431,2147483647,555,2147483647],
    1,// ne
    [1,0,1,0]
);

testCompOps("func_i32x4_compare_s",
    [-1,1440,2100,-2147483648],
    [2147483647,45,202,4],
    2,// lt
    [1,0,0,1]
);

testCompOps("func_i32x4_compare_s",
    [431,-2147483646,555,21474836],
    [277,2147483647,-100,2147483647],
    2,// lt
    [0,1,0,1]
);

testCompOps("func_i32x4_compare_s",
    [2147483647,1440,2100,4],
    [2147483647,45,202,4],
    3,// le
    [1,0,0,1]
);

testCompOps("func_i32x4_compare_s",
    [431,-2147483646,555,21474835],
    [277,-2147483646,-100,21474836],
    3,// le
    [0,1,0,1]
);

testCompOps("func_i32x4_compare_s",
    [-1,1440,2100,-2147483648],
    [2147483647,45,202,4],
    4,// gt
    [0,1,1,0]
);

testCompOps("func_i32x4_compare_s",
    [431,-2147483646,555,21474836],
    [277,2147483647,-100,2147483647],
    4,// gt
    [1,0,1,0]
);

testCompOps("func_i32x4_compare_s",
    [-1,1440,2100,-2147483648],
    [2147483647,1440,202,4],
    5,// ge
    [0,1,1,0]
);

testCompOps("func_i32x4_compare_s",
    [431,-2147483646,-100,21474836],
    [277,2147483647,-100,2147483647],
    5,// ge
    [1,0,1,0]
);

testCompOps("func_i32x4_compare_u",
    [2147483647,0,-100,-2147483648],
    [2147483647,45,202,-2147483648],
    0,// eq
    [1,0,0,1]
);

testCompOps("func_i32x4_compare_u",
    [277,2147483647,-100,2147483647],
    [431,2147483647,555,2147483647],
    0,// eq
    [0,1,0,1]
);

testCompOps("func_i32x4_compare_u",
    [2147483647,0,-100,-2147483648],
    [2147483647,45,202,-2147483648],
    1,// ne
    [0,1,1,0]
);

testCompOps("func_i32x4_compare_u",
    [277,2147483647,-100,2147483647],
    [431,2147483647,555,2147483647],
    1,// ne
    [1,0,1,0]
);

testCompOps("func_i32x4_compare_u",
    [-100,1440,2100,-2147483648],
    [-1,45,202,-2147483647],
    2,// lt
    [1,0,0,1]
);

testCompOps("func_i32x4_compare_u",
    [431,2147483646,555,21474836],
    [277,-2147483647,100,2147483647],
    2,// lt
    [0,1,0,1]
);

testCompOps("func_i32x4_compare_u",
    [2147483647,1440,2100,4],
    [2147483647,45,202,4],
    3,// le
    [1,0,0,1]
);

testCompOps("func_i32x4_compare_u",
    [431,-2147483646,-555,21474835],
    [277,-2147483646,100,21474836],
    3,// le
    [0,1,0,1]
);

testCompOps("func_i32x4_compare_u",
    [2147483647,1440,2100,2147483647],
    [-1,45,202,-4],
    4,// gt
    [0,1,1,0]
);

testCompOps("func_i32x4_compare_u",
    [431,2147483646,555,21474836],
    [277,-2147483647,100,2147483647],
    4,// gt
    [1,0,1,0]
);

testCompOps("func_i32x4_compare_u",
    [1,1440,2100,2147483648],
    [-2147483647,1440,202,-4],
    5,// ge
    [0,1,1,0]
);

testCompOps("func_i32x4_compare_u",
    [431,2147483646,-100,21474836],
    [277,-2147483647,-100,2147483647],
    5,// ge
    [1,0,1,0]
);

testCompOps("func_i16x8_compare_s",
    [65535,0,-100,-777,4,2,207,-65536],
    [65535,0,-123,-777,3,1,202,-65536],
    0,// eq
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_s",
    [11,2147483647,-200,2147483647,431,2147483647,555,2147483647],
    [277,2147483647,-100,2147483647,432,2147483647,755,2147483647],
    0,// eq
    [0,1,0,1,0,1,0,1]
);

testCompOps("func_i16x8_compare_s",
    [65535,0,-100,-777,4,2,207,-65536],
    [65535,0,-123,-777,3,1,202,-65536],
    1,// ne
    [0,0,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_s",
    [11,2147483647,-200,2147483647,431,2147483647,555,2147483647],
    [277,2147483647,-100,2147483647,432,2147483647,755,2147483647],
    1,// ne
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_s",
    [32766,-1,-100,-778,4,2,207,-32768],
    [32767,0,-123,-777,3,1,202,-32767],
    2,// lt
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_s",
    [1111,32766,-99,32765,1001,1,855,-32768],
    [277,32767,-100,32766,432,2,755,-32767],
    2,// lt
    [0,1,0,1,0,1,0,1]
);

testCompOps("func_i16x8_compare_s",
    [32767,-1,-100,-778,4,2,207,-32768],
    [32767,-1,-123,-777,3,1,202,-32767],
    3,// le
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_s",
    [1111,32766,-99,32765,1001,1,855,-32768],
    [277,32767,-100,32766,432,2,855,-32767],
    3,// le
    [0,1,0,1,0,1,1,1]
);

testCompOps("func_i16x8_compare_s",
    [32766,-1,-100,-778,4,2,207,-32768],
    [32767,0,-123,-777,3,1,202,-32767],
    4,// gt
    [0,0,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_s",
    [1111,32766,-99,32765,1001,1,855,-32768],
    [277,32767,-100,32766,432,2,755,-32767],
    4,// gt
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_s",
    [32767,-1,-100,-778,4,2,207,-32768],
    [32767,-1,-123,-777,3,1,202,-32767],
    5,// ge
    [1,1,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_s",
    [1111,32766,-99,32765,1001,1,855,-32768],
    [277,32767,-100,32766,432,2,855,-32767],
    5,// ge
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_u",
    [65534,32766,129,0,4,2,207,65530],
    [65535,32767,123,1,3,1,202,65531],
    2,// lt
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_u",
    [1111,32766,65535,32765,1001,1,855,32767],
    [277,32767,65531,32766,432,2,755,32768],
    2,// lt
    [0,1,0,1,0,1,0,1]
);

testCompOps("func_i16x8_compare_u",
    [65535,32766,129,0,4,2,207,65530],
    [65535,32767,123,1,3,1,202,65531],
    3,// le
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_u",
    [1111,32766,65535,32765,1001,1,855,32767],
    [277,32767,65531,32766,432,2,855,32768],
    3,// le
    [0,1,0,1,0,1,1,1]
);

testCompOps("func_i16x8_compare_u",
    [65534,32766,129,0,4,2,207,65530],
    [65535,32767,123,1,3,1,202,65531],
    4,// gt
    [0,0,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_u",
    [1111,32766,65535,32765,1001,1,855,32767],
    [277,32767,65531,32766,432,2,755,32768],
    4,// gt
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_u",
    [65535,32767,129,0,4,2,207,65530],
    [65535,32766,123,1,3,1,202,65531],
    5,// ge
    [1,1,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_u",
    [1111,32766,65535,32765,1001,1,855,32767],
    [277,32767,65531,32766,432,2,855,32768],
    5,// ge
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_s",
    [255,0,-100,-77,4,2,207,-1],
    [255,0,-123,-77,3,1,202,-1],
    0,// eq
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_s",
    [11,127,-111,127,43,127,55,127],
    [12,127,-100,127,42,127,75,127],
    0,// eq
    [0,1,0,1,0,1,0,1]
);

testCompOps("func_i16x8_compare_s",
    [255,0,-100,-77,4,2,207,-1],
    [255,0,-123,-77,3,1,202,-1],
    1,// ne
    [0,0,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_s",
    [11,127,-111,127,431,127,555,127],
    [12,127,-100,127,432,127,755,127],
    1,// ne
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_s",
    [126,-1,-100,-78,4,2,27,-128],
    [127,0,-123,-77,3,1,22,-127],
    2,// lt
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_s",
    [111,126,-99,64,101,1,85,-128],
    [12,127,-100,126,43,2,75,-127],
    2,// lt
    [0,1,0,1,0,1,0,1]
);

testCompOps("func_i16x8_compare_s",
    [127,-1,-100,-78,4,2,27,-128],
    [127,-1,-123,-77,3,1,22,-127],
    3,// le
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_s",
    [111,126,-99,64,101,1,85,-128],
    [12,127,-100,126,43,2,85,-127],
    3,// le
    [0,1,0,1,0,1,1,1]
);

testCompOps("func_i16x8_compare_s",
    [126,-1,-100,-78,4,2,27,-128],
    [127,0,-123,-77,3,1,22,-127],
    4,// gt
    [0,0,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_s",
    [111,126,-99,64,101,1,85,-128],
    [12,127,-100,126,43,2,75,-127],
    4,// gt
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_s",
    [127,-1,-100,-78,4,2,27,-128],
    [127,-1,-123,-77,3,1,22,-127],
    5,// ge
    [1,1,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_s",
    [111,126,-99,64,101,1,85,-128],
    [12,127,-100,126,42,2,85,-127],
    5,// ge
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_u",
    [253,126,129,0,4,2,207,63],
    [255,127,123,1,3,1,202,65],
    2,// lt
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_u",
    [111,126,255,64,101,1,85,127],
    [12,127,65,126,43,2,75,128],
    2,// lt
    [0,1,0,1,0,1,0,1]
);

testCompOps("func_i16x8_compare_u",
    [255,126,129,0,4,2,207,63],
    [255,127,123,1,3,1,202,65],
    3,// le
    [1,1,0,1,0,0,0,1]
);

testCompOps("func_i16x8_compare_u",
    [111,126,255,64,101,1,85,127],
    [12,127,65,126,43,2,85,128],
    3,// le
    [0,1,0,1,0,1,1,1]
);

testCompOps("func_i16x8_compare_u",
    [253,126,129,0,4,2,207,63],
    [255,127,123,1,3,1,202,65],
    4,// gt
    [0,0,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_u",
    [111,126,255,64,101,1,85,127],
    [12,127,200,126,43,2,75,128],
    4,// gt
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_i16x8_compare_u",
    [255,127,129,0,4,2,207,63],
    [255,126,123,1,3,1,202,65],
    5,// ge
    [1,1,1,0,1,1,1,0]
);

testCompOps("func_i16x8_compare_u",
    [111,126,255,64,101,1,85,127],
    [12,127,200,126,43,2,85,128],
    5,// ge
    [1,0,1,0,1,0,1,0]
);

testCompOps("func_f32x4_compare",
    [1234.5,0,NaN,-567.25],
    [1234.5,45,202,-567.25],
    0,// eq
    [1,0,0,1]
);

testCompOps("func_f32x4_compare",
    [277,1234.5,-100,1234.5],
    [431,1234.5,NaN,1234.5],
    0,// eq
    [0,1,0,1]
);

testCompOps("func_f32x4_compare",
    [1234.5,0,-100,-567.25],
    [1234.5,45,NaN,-567.25],
    1,// ne
    [0,1,1,0]
);

testCompOps("func_f32x4_compare",
    [277,1234.5,-100,1234.5],
    [431,1234.5,NaN,1234.5],
    1,// ne
    [1,0,1,0]
);

testCompOps("func_f32x4_compare",
    [-1,1440,2100,-567.25],
    [1234.5,45,202,4],
    2,// lt
    [1,0,0,1]
);

testCompOps("func_f32x4_compare",
    [431,-2147483646,555,1234.1],
    [277,1234.5,-100,1234.5],
    2,// lt
    [0,1,0,1]
);

testCompOps("func_f32x4_compare",
    [1234.5,1440,2100,4],
    [1234.5,45,202,4],
    3,// le
    [1,0,0,1]
);

testCompOps("func_f32x4_compare",
    [431,-2147483646,555,21474835],
    [277,-2147483646,-100,21474836],
    3,// le
    [0,1,0,1]
);

testCompOps("func_f32x4_compare",
    [-1,1440,2100,-567.25],
    [1234.5,45,202,4],
    4,// gt
    [0,1,1,0]
);

testCompOps("func_f32x4_compare",
    [431,-2147483646,555,1234.4],
    [277,1234.5,-100,1234.5],
    4,// gt
    [1,0,1,0]
);

testCompOps("func_f32x4_compare",
    [-1,1440,2100,-567.25],
    [1234.5,1440,202,4],
    5,// ge
    [0,1,1,0]
);

testCompOps("func_f32x4_compare",
    [431,-2147483646,-100,1234.4],
    [277,1234.5,-100,1234.5],
    5,// ge
    [1,0,1,0]
);

if (passed) {
    print("Passed");
}