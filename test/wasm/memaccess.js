//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft Corporation and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

var assert = function(a, b, txt)
{
    if(a === b) return;
    print(txt+" Fail!!: "+a+" and "+b+" does not match.")
}

const blob = WScript.LoadBinaryFile('memaccess.wasm');
const moduleBytesView = new Uint8Array(blob);
var a = Wasm.instantiateModule(moduleBytesView, {}).exports;

try     { print(a.loadNoffset(0))}
catch(err){ assert(true, err == 'Error: Compiling wasm failed: function loadNoffset[2]: Index offset must not be less than 0', "NegLoad");}

try      { print(a.storeNoffset(0)) }
catch(err) { assert(true, err == 'Error: Compiling wasm failed: function storeNoffset[3]: Index offset must not be less than 0', "NegStore");}


assert(-1, a.storeoffset(0));
assert(121, a.loadoffset(0));


// var c = new Int8Array(a.memory);
// assert(c[34], 121, "memory");
