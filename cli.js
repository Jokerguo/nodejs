const program = require('commander');
const api = require('./index.js')
// program.version('0.1.1');

program
    .option('-x, --xxx', 'x is here')

program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const words =  args.slice(0,-1).join(' ')
        api.add(words)
    });
program
    .command('clear')
    .description('clear all task')
    .action(() => {
        api.clear()
    });

program.parse(process.argv);

if(process.argv.length === 2){
    api.showAll()
}

