import prompt from '../helpers/prompt'

export default function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);

    prompt('Yes or no? ', function(text) {
        console.log('You responded: ');
        console.log(text);
    });

};