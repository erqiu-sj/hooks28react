#!/usr/bin/env node
const fs = require("fs");
const {resolve} = require("path");
const shell = require("shelljs");
// 开启一个子线程
const spawn = require("child_process").spawn;
const {program} = require("commander");
const figlet = require("figlet");
const inquirer = require("inquirer");
const templatePath = "https://github.com/erqiu-sj/diyReact.git";
const {compile} = require("handlebars");
const chalk = require("chalk");
const log = console.log;

/**
 * @example rmRf('filepath')
 * @description 删除文件
 * @param { string } filePath 文件路径
 * @param { string } fileName 文件名
 * @return { void }
 */
function rmRf(fileName) {
    shell.rm("-rf", fileName);
}

/**
 * @example command('npm i')
 * @description 执行命令
 * @param { string } command 需要执行的命令
 */
function command(command) {
    shell.exec(command);
}

function runInstall(
    cwd,
    executable = "npm",
    args = ["install"]
) {
    log(chalk.greenBright("正在安装依赖中..."));
    return new Promise((resolve, reject) => {
        const installProcess = spawn(executable, args, {
            cwd,
            stdio: "inherit",
            shell: true,
        });
        installProcess.on("exit", () => {
            log(chalk.greenBright('依赖安装完毕...'))
            resolve()
        });
        installProcess.on('error', (err) => {
            reject(err)
        })
    });
}

program
    .version("0.1.0") // --version 版本 查看cli版本号
    .command("init <name>") // 初始化命令 <必填> 【选填写】
    .description("初始化项目文件")
    .action((name) => {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "isAxios",
                    message: "install axios?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "isReactRouterDom",
                    message: "install react-router-dom?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "isRedux",
                    message: "install redux?",
                    default: true,
                },
                {
                    type: "confirm",
                    name: "isReactRedux",
                    message: "install react-redux?",
                    default: true,
                },
            ])
            .then((res) => {
                try {
                    // 获取当前路径的package文件目录
                    const packagePath = resolve("./") + `/${name}/package.json`;
                    rmRf(name);
                    command(`mkdir ${name}`);
                    log(chalk.blue("start!"));
                    command(`git clone ${templatePath} ${name}/`);
                    // 修改package文件依赖
                    const packageContent = fs.readFileSync(packagePath).toString();
                    fs.writeFileSync(packagePath, compile(packageContent)(res));
                    log(chalk.green("修改依赖成功！"), '\n');
                    figlet("hooks 28", (err, data) => {
                        if (err) log(chalk.red(err));
                        else log(chalk.blue(data));
                    });
                    runInstall(`./${name}`).then(() => {
                        log(chalk.green("success"), '\n');
                        log(chalk.green(`cd ./${name}`), '\n');
                        log(chalk.blue('npm start'), '\n')
                    }).catch((err) => {
                        log(chalk.red(err))
                    })
                } catch (e) {
                    log(chalk.red("fail", e));
                    rmRf(name);
                }
            });
    })
    .option("init", "hooks28react <name> 创建你的项目");
program.parse(process.argv); // 解析变量
if (program.debug) console.log(program.opts());
if (program.small) console.log("- small pizza size");
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
