import lazyDependable from 'lazy-dependable'

let container = new lazyDependable.Container()

//container.register('a', function() {
//    console.log('loaded a');
//   return 'a'
//})
//
//container.register('b', function() {
//    console.log('loaded b');
//    return 'b'
//})
//
//container.register('c', function(a) {
//    console.log('loaded c');
//    return 'c'
//})

module.exports = container
