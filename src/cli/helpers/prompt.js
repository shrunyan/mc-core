/**
 *
 * @param {string} promptText
 * @param {function} callback
 */
export default function(promptText, callback) {
    process.stdout.write(str);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(val) {
        fn(val.trim());
    }).resume();
}