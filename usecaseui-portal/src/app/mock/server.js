const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
// const customersRouters = require('./routes');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Get mock data
const fs = require('fs');
const path = require('path');

let localJsonDb = {};  //import mock datas
const fakeoriginalData = require('./fake/mock.js');  //import datas created in fakedata.js
const mockFolder = './src/app/mock/json'; //mock json path folder
const filePath = path.resolve(mockFolder);

fileDisplay(filePath);

function fileDisplay(filePath) {
    let fileList = [];
    let originPath = [];
    let rewriter = {};
    // Return filelist on based of filePath
    const files = fs.readdirSync(filePath);
    files.forEach((filename) => {
        // Get filename's absolute path
        let filedir = path.join(filePath, filename);
        // Get the file information according to the file path and return an fs.Stats object
        fs.stat(filedir, (err, stats) => {
            if (err) {
                console.warn('Get files failed......');
            } else {
                let isFile = stats.isFile(); // files
                let isDir = stats.isDirectory(); //files folder
                if (isFile) {
                    fileList.push(path.basename(filedir, '.json'));
                    fileList.forEach(item => {
                        let paser = item.split("_").join("/");
                        originPath.push({ route: `/${paser}`, origin: `/${item}` })
                        originPath.map(route => {
                            rewriter[route.route] = route.origin;
                        })
                        localJsonDb[item] = getjsonContent(item);
                    })
                }
                if (isDir) {
                    console.warn("=====> DO NOT support mock data in folder");
                    fileDisplay(filedir);
                }
                Object.keys(fakeoriginalData).map(item => {
                    localJsonDb[item] = fakeoriginalData[item];
                })
            }
        })
    })
    setTimeout(() => {
        serverRewrite(rewriter);
        runServer(localJsonDb);
    }, 100)
}
function getjsonContent(path) {
    let newpath = `./src/app/mock/json/${path}.json`;
    let result = JSON.parse(fs.readFileSync(newpath));
    return result;
}

//only multi router data needs jsonServer.rewriter
function serverRewrite(routerpath) {
    let routerpathArr = routerpath;
    //rewrite mock multiple routers here
    Object.keys(fakeoriginalData).map(item => {
        let newPath = item.split("_").join("/")
        routerpathArr[`/${newPath}`] = `/${item}`;
    })
    //start to rewrite routers
    // console.log(customersRouters, "===customersRouters")
    // server.use(jsonServer.rewriter(customersRouters))
    server.use(jsonServer.rewriter(routerpathArr));
}

function runServer(db) {
    server.use(jsonServer.router(db));
}

server.listen(3004, () => {
    console.log('Mock Server is successfully running on port 3004 😁')
});
