//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

function assertEquals(expected, actual) {
    if (expected != actual) {
        throw `Expected ${expected}, received ${actual}`;
    }
}

function createModulesUntilOOM (module, newSize) {
    const n = 128; //~ 128GB which, hopefully, should be enough to counter a page file/swap
    let arr = [];
    for (let i = 0; i < n; i++)
    {
        let mod = new WebAssembly.Module(readbuffer('oom.wasm'));
        let a = new WebAssembly.Instance(mod).exports;
        let oldSize = a.grow(newSize);
        if (oldSize == -1) {
            return 0;
        }
        arr.push(mod); //keep WASM module references live in case GC decides to collect?
    }

    return newSize;
}

assertEquals(0, createModulesUntilOOM('oom.wasm',  0x4000)); // (memory 0) to 1GB (2^14*2^16)
assertEquals(0, createModulesUntilOOM('oom2.wasm', 0x3ffe)); // (memory 2) to 1GB ((2^14-2)*2^16)
assertEquals(0, createModulesUntilOOM('oom3.wasm', 0x4000)); // (memory 256) tests fast path on x64
print ("PASSED");



