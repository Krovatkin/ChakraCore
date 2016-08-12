;;-------------------------------------------------------------------------------------------------------
;; Copyright (C) Microsoft Corporation and contributors. All rights reserved.
;; Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
;;-------------------------------------------------------------------------------------------------------

(module
  (memory 5000 5000)

  (func $loadOffset (param i32) (result i32)
    (return (i32.load offset=12 (i32.const 22))))
  (func $storeOffset (param i32) (result i32)
    (i32.store offset=12 (i32.const 22) (i32.const 121)) (return (i32.const -1)))
    
  (func $loadNOffset (param i32) (result i32)
    (i32.store offset=12 (i32.const 22) (i32.const 121)) (return (i32.load offset=14 (i32.const 22))))
  (func $storeNOffset (param i32) (result i32)
    (i32.store offset=14 (i32.const 22) (i32.const 121)) (return (i32.load offset=2 (i32.const 22))))

  (export "loadNoffset" $loadNOffset)
  (export "storeNoffset" $storeNOffset)
  (export "loadoffset" $loadOffset)
  (export "storeoffset" $storeOffset)
  (export "memory" memory)
)
