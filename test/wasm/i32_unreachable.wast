;; i32 operations

(module

  (func $test_unreachable (result i32) (unreachable) (i32.const 1))
  (export "test_unreachable" $test_unreachable)


)


(assert_return (invoke "test_unreachable") (i32.const 1))
