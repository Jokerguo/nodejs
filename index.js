const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  // 读取之前的文件
  const list = await db.read()
  // 添加一个title任务
  list.push({ title: title, done: false })
  // 存储任务到文件
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}
function markAsUndone(list, index) {
  list[index].done = false
  db.write(list)
}
function updateTitle(list, index) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: "What's your title",
      default() {
        return list[index].title
      },
    })
    .then(({ title }) => {
      list[index].title = title
      db.write(list)
    })
}
function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}
function askForActionList(list, index) {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [
        { name: '退出', value: 'quit' },
        { name: '已完成', value: 'markAsDone' },
        { name: '未完成', value: 'markAsUndone' },
        { name: '改标题', value: 'updateTitle' },
        { name: '删除', value: 'remove' },
      ],
    })
      .then(({ action }) => {
        const actions = { markAsDone, markAsUndone, updateTitle, remove }
        action && actions[action](list,index)
    })
}
function printAllTask(list) {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择任务',
      choices: [
        { name: '退出', value: -1 },
        ...list.map((ele, index) => ({
          name: `${ele.done ? '[x]' : '[_]'} ${index + 1} - ${ele.title}`,
          value: index,
        })),
        { name: '新增', value: -2 },
      ],
    })
    .then(({ index }) => {
      if (index >= 0) {
        askForActionList(list,index)
      } else if (index === -2) {
        inquirer
          .prompt({
            type: 'input',
            name: 'title',
            message: "What's your title",
          })
          .then(({ title }) => {
            list.push({ title, done: false })
            db.write(list)
          })
      }
    })
}

module.exports.showAll = async () => {
  const list = await db.read()
  printAllTask(list)
}
