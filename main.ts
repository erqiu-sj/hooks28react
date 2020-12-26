#!/usr/bin/env node
const fs = require('fs')
const shell = require('shelljs')
const {program} = require("commander");
const inquirer = require('inquirer')
const templatePath = 'https://github.com/erqiu-sj/diyReact.git'
const {compile} = require('handlebars')
const chalk = require('chalk')
const log = console.log

/**
 * @example rmRf('filepath')
 * @description 删除文件
 * @param { string } filePath 文件路径
 * @param { string } fileName 文件名
 * @return { void }
 */
function rmRf(filePath, fileName) {
    shell.rm('-rf', fileName)
}

/**
 * @example command('npm i')
 * @description 执行命令
 * @param { string } command 需要执行的命令
 */
function command(command) {
    shell.exec(command)
}

program
    .version("0.1.0") // --version 版本 查看cli版本号
    .command("init <name>") // 初始化命令 <必填> 【选填写】
    .description("初始化项目文件")
    .action((name) => {
        inquirer.prompt([
            {type: "confirm", name: "isAxios", message: "install axios?", default: true},
            {type: "confirm", name: "isReactRouterDom", message: "install react-router-dom?", default: true},
            {type: "confirm", name: "isRedux", message: "install redux?", default: true},
            {type: "confirm", name: "isReactRedux", message: "install react-redux?", default: true}
        ]).then((res) => {
            try {
                // 获取当前路径的package文件目录
                const packagePath = `${__dirname}/${name}/package.json`
                rmRf('-rf', name)
                command(`mkdir ${name}`)
                log(chalk.blue('start!'))
                command(`git clone ${templatePath} ${name}/`)
                // 修改package文件依赖
                const packageContent = fs.readFileSync(packagePath).toString();
                fs.writeFileSync(packagePath, compile(packageContent)(res))
                command('npm i')
                log(chalk.green('success'))
                log(chalk.blue('cd'), `./${name}`)
                log(chalk.blue('npm start'))
            } catch (e) {
                log(chalk.red('fail'))
                rmRf('-rf', name)
            }
        })
    })
    .option('init', 'hooks28react <name> 创建你的项目');
program.parse(process.argv) // 解析变量
if (program.debug) console.log(program.opts());
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);