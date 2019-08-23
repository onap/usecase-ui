# Usecase UI

This is the frontend part of Usecase UI project.


### Getting Started

1. Go to project folder and install dependencies:

```bash
npm install
```

2. Launch local server, and open `localhost:4200` in your browser:

```bash
npm run start
```

3. Launch data server, and open `localhost:4200` in your browser:

```bash
npm run mock
```

4. Launch remote server, and open `localhost:4200` in your browser:

```bash
npm run server
```

5. Print changelog in `CHANGELOG.md`:

```bash
npm run changelog
```


### Project Structure

```
├── e2e
├── src
│   ├── app   
│   │   ├── core     
│   │   │   ├── models
│   │   │   └── services 
│   │   ├── mock
│   │   │   ├── json                        # container of all local mock data files 
│   │   │   ├── fakedata.js                 # container of all remote mock data created by faker.js 
│   │   │   ├── mock.js                     # connector of remote mock data and mock interface
│   │   │   └── server.js                   # mock data server
│   │   ├── shared
│   │   │   ├── components                  # container of all general components 
│   │   │   └── utils                       # container of all general functions 
│   │   ├── test                            # test page, can be deleted if nessary 
│   │   ├── views                           # container of all business pages
│   │   │   ├── alarm 
│   │   │   └── ......                      
│   │   ├── app-routing.module.ts                                             
│   │   ├── app.component.css                                            
│   │   ├── app.component.less                                              
│   │   ├── app.component.html                                                                                         
│   │   ├── app.component.ts                                                                                                            │   │   └── app.module.ts    
│   ├── assets 
│   │   ├── i18n                            # container of internationalization assets                      
│   │   └── images   
│   ├── environments 
│   ├── favicon.ico                        
│   ├── index.html    
│   ├── style.css  
│   ├── style.less                         
│   ├── my-theme.css 
│   ├── my-theme.less  
│   ├── main.ts  
│   ├── polyfill.ts   
│   ├── test.ts   
│   ├── tsconfig.app.json 
│   ├── tsconfig.spec.json 
│   ├── typing.d.ts 
├── .angular-cli.json
├── CHANGELOG.md                            # recorder of all the important changes 
├── karma.conf.js 
├── localproxy.conf.json                    # config for mock server proxy 
├── proxy.conf.json                         # config for server proxy 
├── tsconfig.json
├── package.json
└── README.md   
```

### [Change log](./CHANGELOG.md)

### Git commit message rules

PLEASE obey [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#) when write the commit messages. One commit message should include three parts: `Header`, `Body` and `Footer`. The `Header` part is necessary, and the other two parts are optional. The `Header` part follows the rule as: `<type>(<scope>): <subject>`. `type` and `subject` are necessary, `scope` is optional. Only 7 tokens are allowed for `type`:
   * feat: new features（feature）
   * fix: fix bugs
   * docs: documentation
   * style: style
   * refactor：reconstruction 
   * test：add test
   * chore：change for construction and assistant tools

For example:

```bash
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected
----------------------------------------------------- 
docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace
```


When there is breaking changes in the project, please write the commit message in `Footer`. For example:

```bash 
    BREAKING CHANGE: isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```
Also, run the script `npm run changelog` can generate all the `feat` and `fix` commits. Click [CHANGELOG.md](./CHANGELOG.md) shows all these commit histories. 

### Contributor

```
Copyright 2019 CMCC Corporation.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
