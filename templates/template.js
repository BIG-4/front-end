
window.app = window.app || {}
window.app.Templates = { Login, Home, Project, Modal, ProjectModal, Account }

// Template for login page

function Login() {
    return `
    <main class="vertical-center">
        <div class="border-radius shadow w-50 auto-margin">
        <div class="container" id="container">
            <div class="form-container sign-up-container">
                <div id="signUpForm">
                    <h1>Create Account</h1>
                    <input id="signUpName" type="text" name="name" placeholder="Name" required />
                    <input id="signUpUsername" type="text" name="username" placeholder="Username" required />
                    <input id="signUpPw" type="password" name="password" placeholder="Password" required />
                    <input id="signUpRetypePw" type="password" name="retype-password" placeholder="Retype Password" required />
                    <button id="signUp">Sign Up</button>
                </div>
            </div>
            <div class="form-container sign-in-container">
                <div id="signInForm">
                    <h1>Sign in</h1>
                    <input id="signInUsername" type="text" name="username" placeholder="Username" />
                    <input id="signInPassword" type="password" name="password" placeholder="Password" />
                    <a href="#">Forgot your password?</a>
                    <button id="signIn">Sign In</button>
                </div>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button class="ghost" id="signInBtn">Sign In</button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button class="ghost" id="signUpBtn">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </main>
    `
}

// Template for Home page

function Home(projects) {
    return `<header class="shadow header fixed" style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-acc" class="nav-link">Account</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <main class="vertical-center">
                <div class="border-radius shadow bg-white w-50 auto-margin">
                    <div class="flex border-bottom padding">
                        <h3 class="no-margin">Projects</h3>
                        <button id="add-project" class="icon-button color-success"><i class="lnr lnr-plus-circle"></i></button>
                    </div>
                    ${projects.length !== 0 ?
            projects.reduce((acc, project) => acc += ProjectButton(project), '') :
            '<div class="padding color-gray text-center">No projects</div>'
        }
                    <div class="padding border-top"></div>
                </div>
            </main>`
}

function ProjectButton({ id, title }) {
    return `<div class="flex list-button">
                <button id="open-project-${id}" class="padding flex project-button"> 
                    ${title}  
                </button>
                <button id="edit-project-${id}" class="icon-button color-info edit-project">
                    <i class="lnr lnr-cog"></i>
                </button>
                <button id="remove-project-${id}" class="icon-button color-danger remove-project">
                    <i class="lnr lnr-trash"></i>
                </button>
            </div>`
}

function ProjectModal(title, p_name) {
    console.log(p_name);
    return `
    <div class="modal-container">
        <div id="project-modal-bg"></div>

        <div class="modal border-radius shadow bg-white">
            <div class="padding modal-header">
                <h4 class="text-center no-margin">${title}</h4>
                <button id="close-modal" class="icon-button color-danger close-modal">
                    <i class="lnr lnr-cross"></i>
                </button>
            </div>
            <div class="padding">
                <div class="project-form">
                    <label>Project Name: </label>
                    <input name="p_name" id="p_name" value="${p_name}">
                </div>
            </div>
            <div class="padding modal-submit">
                <button id="modal-submit">Submit</button>
            </div>
            
        </div>
    </div>
    `
}

// Template for project detail page

function Project({ id, title, lists }) {
    return `<header class="header shadow">
                <div class="flex">
                    <button id="back-page" class="icon-button color-gray back-button"><i class="lnr lnr-chevron-left"></i></button>
                    <h3 id="project-title" class="no-margin show">${title}</h3>
                    <input type="text" id="project-title-input" class="hide" value="${title}" placeholder="Title">
                </div>
                <div>
                    <button id="help-button" class="icon-button color-info"><i class="lnr lnr-question-circle"></i></button>
                </div>
            </header>
            <main class="padding row">
                ${lists.reduce((acc, list) => acc += List(list), '')}
                <div>
                    <button id="add-list" project="${this.id}" class="icon-button"><i class="lnr lnr-plus-circle"></i></button>
                </div>
            </main>`
}

function List({ id, title, items }) {
    return `<div class="list bg-white shadow border-radius">
                <div class="header border-bottom">
                    <h4 id="list-${id}-title" class="no-margin show list-title">${title}</h4>
                    <input id="list-${id}-title-input" type="text" class="hide list-title-input" value="${title}" placeholder="Title">
                    <button id="remove-list-${id}" class="icon-button color-danger remove-list"><i class="lnr lnr-cross"></i></button>
                </div>
                <div id="items-container-${id}" class="padding items-container">
                    ${items.reduce((acc, item) => acc += Item(item), '')}
                    <button id="add-item-${id}" class="icon-button color-info add-item droppable"><i class="lnr lnr-plus-circle"></i></button>
                </div>
            </div>`
}

function Item({ id, title }) {
    return `<div id="item-${id}-title" class="item show droppable" draggable="true">
                <p class="no-margin border border-radius">${title}</p>
            </div>
            <textarea id="item-${id}-title-input" class="hide border border-radius item-input">${title}</textarea>`
}

function Modal(title, text, hasButtons) {
    return `<div class="modal-container">
                <div id="modal-bg"></div>
                <div class="modal border-radius shadow bg-white">
                    <div class="padding">
                        <h4 class="text-center no-margin">${title}</h4>
                    </div>
                    <div class="padding">
                        <p class="no-margin">${text}</p>
                    </div>
                    <div class="flex-right full-width border-top padding">
                    ${hasButtons ? `<button id="no-button" class="link">No</button><button id="yes-button" class="link">Yes</button>` : ''}
                    </div>
                </div>
            </div>`
}

function TaskModal(title) {
    return `
    <div class="modal-container">
        <div id="task-modal-bg"></div>

        <div class="modal border-radius shadow bg-white">
            <div class="padding modal-header">
                <h4 class="text-center no-margin">${title}</h4>
                <button id="close-modal" class="icon-button color-danger close-modal">
                    <i class="lnr lnr-cross"></i>
                </button>
            </div>
            <div class="padding">
                <div class="task-form">
                    <div class="task-name">
                        <label>Task Name: </label>
                        <input name="p_name" id="p_name">
                    </div>
                    <div class="task-user">
                        <label>Assignee: </label>
                        <select class="asigned-user">
                            <option id="1">User 1</option>
                            <option id="2">User 2</option>
                            <option id="3">User 3</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

// Template for account page

function Account() {
    return `<header class="shadow header fixed" style="height: 56px">
                <h3 class="no-margin">Task Manangement</h3>
                <div class="nav-main">
                    <a id="nav-home" class="nav-link">Home</a>
                    <a id="nav-acc" class="nav-link">Account</a>
                    <a id="nav-func" class="nav-link">Function</a>
                    <a id="nav-logout" class="nav-link">Log Out</a>
                </div>
            </header>
            <main class="vertical-center">
                <div class="border-radius shadow bg-white w-50 auto-margin">
                    <div class="account-header">
                        <h3 class="no-margin">Account Management</h3>
                    </div>
                    <div class="account-form">
                        <div class="acc-form">
                            <label class="label-name">Name</label>
                            <input name="name" value="">
                        </div>
                        <div class="acc-form">
                            <label class="label-current-pw">Current Password</label>
                            <input name="current-pw">
                        </div>
                        <div class="acc-form">
                            <label class="label-new-pw">New Password</label>
                            <input name="new-pw">
                        </div>
                        <div class="acc-form">
                            <label class="label-retype-pw">Retype New Password</label>
                            <input name="retype-pw">
                        </div>
                        <div class="padding modal-submit">
                            <button id="modal-submit">Submit</button>
                        </div>
                    </div>
                </div>
            </main>`
}