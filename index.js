const db = require('./db.js')
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    // 读取之前的文件
    const list = await db.read()
    // 添加一个title任务
    list.push({title: title, done: false})
    // 存储任务到文件
    await db.write(list)
}

module.exports.clear = async () => {
    await db.write([])
}

module.exports.showAll = async () => {
    const list = await db.read()
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择任务',
            choices: [{name:'退出',value: -1},...list.map((ele, index) => ({
                name: `${ele.done ? '[x]' : '[_]'} ${index + 1} - ${ele.title}`,
                value: index
            })),{name:'新增',value:-2}
            ],
        })
        .then(({index}) => {
            if(index >= 0){
                // 选中任务
                inquirer
                    .prompt({
                        type: 'list',
                        name: 'action',
                        message: '请选择操作',
                        choices: [
                            {name:'退出',value: 'quit'},
                            {name:'已完成',value: 'markAsDone'},
                            {name:'未完成',value: 'markAsUndone'},
                            {name:'改标题',value: 'updateTitle'},
                            {name:'删除',value: 'remove'},
                        ],
                    })
                    .then(({action}) => {
                        switch(action){
                            case 'quit':
                                break;
                            case 'markAsDone':
                                list[index].done = true
                                db.write(list)
                                break;
                            case 'markAsUndone':
                                list[index].done = false
                                db.write(list)
                                break;
                            case 'updateTitle':

                                break;
                            case 'remove':
                                list.splice(index,1)
                                db.write(list)
                                break;
                        }
                    });
            }else if(index === -2){
                //输入姓名
            }
        });
}
