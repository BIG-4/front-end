
window.app = window.app || {}
window.app.Controller = Controller

function Controller(model, view) {
    this.model = model
    this.view = view
    this.searchTemp = window.app.SearchTemplate
    this.projectTemp = window.app.ProjectTemplate
    this.homeTemp = window.app.HomeTemplate
    this.functTemp = window.app.FunctionTemplate
    this.compTemp = window.app.CompareTemplate

    this.refresh('Login')
    this.view.setBackground()
}

const api_url = "http://localhost:2000";
const api_key = "ahjgdj87698bjb89#sfksdfsfb#278";
// General Controller

Controller.prototype.refresh = function (page, args) {
    if (page === 'Home') {
        // this.view.render(page, { projects: this.model.getProjects() });
        document.querySelector('content').innerHTML = this.homeTemp.Home(this.model.getProjects())
        this.setHomeEvents()
        this.setSearchEvents()
        this.setHeaderEvents()
    } else if (page === 'Search') {
        // this.view.render(page, { items: args.items, data: args.data, projects: this.model.getProjects() })
        document.querySelector('content').innerHTML = this.searchTemp.Search(args.items, this.model.getProjects(), args.data)
        this.setSearchEvents()
        this.setHeaderEvents()
    } else if (page === 'Login') {
        this.view.render(page, {})
        this.setLoginEvents()
    } else if (page === 'Project') {
        console.log(args);
        document.querySelector('content').innerHTML = this.projectTemp.Project(args.project.project_id, args.project.project_name, args.tasks)
        this.setProjectEvents()
        this.setHeaderEvents()

    } else if (page === 'Account') {
        this.view.render(page, {})
        this.setHeaderEvents()
    } else if (page === 'Function') {
        console.log(args);
        document.querySelector('content').innerHTML = this.functTemp.Funct(this.model.getProjects(), this.model.getUsers(), args)
        this.setHeaderEvents()
        this.setFunctionEvents()
    } else if (page === 'Compare') {
        console.log(args);
        document.querySelector('content').innerHTML = this.compTemp.Compare(this.model.getProjects(), this.model.getUsers(), args)
        this.setHeaderEvents()
        this.setFunctionEvents()
    }

}

Controller.prototype.setHeaderEvents = function () {
    this.view.addEvent('nav-home', 'click', () => this.refresh('Home'))
    this.view.addEvent('nav-acc', 'click', () => this.refresh('Account'))
    this.view.addEvent('nav-func', 'click', () => this.refresh('Function'))
    this.view.addEvent('nav-logout', 'click', () => this.logOut())
}

Controller.prototype.logOut = function () {
    this.model.getData(api_url + '/users/logout', '')
        .then(res => {
            console.log(res.data);
            this.refresh('Login')
        })
}

//Controller for Login

Controller.prototype.setLoginEvents = function () {
    const container = document.getElementById('container');
    this.view.addEvent('signUpBtn', 'click', () => {
        container.classList.add("right-panel-active");
    });
    this.view.addEvent('signInBtn', 'click', () => {
        container.classList.remove("right-panel-active");
    });
    this.view.addEvent('signIn', 'click', () => this.signIn());
    this.view.addEvent('signUp', 'click', () => this.signUp());
}

Controller.prototype.signIn = function () {
    var data = {
        username: document.getElementById('signInUsername').value,
        password: document.getElementById('signInPassword').value
    };
    this.model.logData(api_url + '/users/login', data)
        .then(res => {
            console.log(res.data); // JSON data parsed by `data.json()` call
            localStorage.setItem("user_id", res.data.id);
            localStorage.setItem("auth_token", res.data.auth_token);
            localStorage.setItem("access_token", res.data.access_token);

            this.refresh('Home');
        });
    // this.refresh('Home');
}

Controller.prototype.validateSignUp = function (name, uname, pw, repw) {
    if (name == '' || uname == '' || pw == '' || repw == '') return false;
    else if (pw != repw) return false;
    else return true;
}

Controller.prototype.signUp = function () {
    var name = document.getElementById('signUpName').value;
    var uname = document.getElementById('signUpUsername').value;
    var pw = document.getElementById('signUpPw').value;
    var repw = document.getElementById('signUpRetypePw').value;

    var data = {
        username: uname,
        password: pw
    };

    if (!this.validateSignUp(name, uname, pw, repw)) {
        console.log('error');
    } else {
        this.model.logData(api_url + '/users/signup', data)
            .then(res => {
                console.log(res); // JSON data parsed by `data.json()` call
                this.refresh('Login');
            });
    }

}

// Controller for home page

Controller.prototype.setHomeEvents = function () {
    this.view.addEvent('add-project', 'click', () => this.createProject())
    this.view.addEvent('search', 'click', () => this.search())
    this.view.addEvent('reset', 'click', () => this.reset())

    this.view.getElements('.edit-project').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.editProject(button.id.split('-')[2]))
    })
    this.view.getElements('.remove-project').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.removeProject(button.id.split('-')[2]))
    })
    this.view.getElements('.project-button').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => {
            this.openProject(button.id.split('-')[2]);
        })
    })
}

Controller.prototype.createProject = function () {
    this.view.showProjectModal('New Project', '')
    this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

    this.view.addEvent('modal-submit', 'click', () => {
        var data = {
            project_name: document.getElementById('p_name').value
        }
        this.model.createData(api_url + "/projects/create", data)
            .then(res => {
                this.refresh('Home');
            });
    })
}

Controller.prototype.editProject = function (projectID) {
    let pid = 'open-project-' + projectID;
    this.view.showProjectModal('Edit Project', document.getElementById(pid).innerHTML.trim())
    this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

    this.view.addEvent('modal-submit', 'click', () => {
        var data = {
            project_id: projectID,
            project_name: document.getElementById('p_name').value
        }
        this.model.updateData(api_url + '/projects/update', data)
            .then(res => {
                this.refresh('Home');
            })
    })
}

Controller.prototype.removeProject = function (projectID) {
    this.view.showModal('Remove project', 'Are you sure you want to remove this project?', true, () => {
        var id = projectID.toString();
        this.model.delData(api_url + "/projects/delete?id=" + id)
            .then(res => {
                this.refresh('Home');
            })
    })
}

Controller.prototype.openProject = async function (projectID) {

    var project = await this.model.getAsyncData(api_url + '/project?id=' + projectID.toString())
        .then(res => {
            return res
        })

    this.getTasksList(projectID)
        .then(res => {
            this.refresh('Project', { project: project, tasks: res })

        })
}

Controller.prototype.getTasksList = async function (projectID) {
    var path_prj = api_url + '/tasks/search?key=&project_id=' + projectID

    var unsigned = await this.model.getAsyncData(path_prj + '&status_id=0')
        .then(res => {
            return res
        })

    var todo = await this.model.getAsyncData(path_prj + '&status_id=1')
        .then(res => {
            return res
        })

    var doing = await this.model.getAsyncData(path_prj + '&status_id=2')
        .then(res => {
            return res
        })

    var done = await this.model.getAsyncData(path_prj + '&status_id=3')
        .then(res => {
            return res
        })

    var tasks = {
        unsigned: unsigned,
        todo: todo,
        doing: doing,
        done: done
    }
    console.log(tasks);

    return tasks
}

// Controller for Search page
Controller.prototype.setSearchEvents = function () {
    this.view.addEvent('search', 'click', () => this.Search())
    this.view.addEvent('reset', 'click', () => this.Reset())
}

Controller.prototype.Search = function () {
    var key = this.view.getElement('#search-key').value
    var user = this.view.getElement('#search-user').value
    var prj = this.view.getElement('#search-prj').value
    var status = this.view.getElement('#search-status').value

    var data = {
        key: key,
        user: user,
        prj: prj,
        status: status
    }


    var path_key = 'key=' + key
    var path_user = '&user=' + user
    var path_prj = prj == 'all' ? '' : '&project_id=' + prj
    var path_status = status == 'all' ? '' : '&status_id=' + status

    this.model.getData(api_url + '/tasks/search?' + path_key + path_user + path_prj + path_status)
        .then(res => {
            console.log(res.data);
            this.refresh('Search', { items: res.data, data: data })
        })
}


// Controller for Function

Controller.prototype.setFunctionEvents = function () {
    this.view.addEvent('submit', 'click', () => this.compare())
}

Controller.prototype.compare = async function () {
    var prj = this.view.getElement('#compare-prj').value

    var users = document.getElementsByName('compare-user');
    var checked = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].checked) {
            checked.push(users[i].value);
        }
    }
    var path_prj = prj == 'all' ? '' : '&project_id=' + prj
    var result = [];
    var url = api_url + '/tasks/count?' + path_prj

    for (var i = 0; i < checked.length; i++) {
        var data = await this.getNumTask(url, checked[i])
            .then(res => {
                return res
            })
        result.push(data)
    }

    var all_task = await this.model.getAsyncData(url)
        .then(res => {
            return res
        })

    var data = {
        all: all_task.number_of_tasks,
        result: result,
        prj: prj,
        checked: checked
    }
    console.log(data);

    this.refresh('Compare', data)

}

Controller.prototype.getNumTask = async function (url, user) {
    var path_user = 'user=' + user

    var todo = await this.model.getAsyncData(url + path_user + '&status_id=1')
        .then(res => {
            return res
        })
    var doing = await this.model.getAsyncData(url + path_user + '&status_id=2')
        .then(res => {
            return res
        })
    var done = await this.model.getAsyncData(url + path_user + '&status_id=3')
        .then(res => {
            return res
        })
    var data = {
        user: user,
        todo: todo.number_of_tasks,
        doing: doing.number_of_tasks,
        done: done.number_of_tasks
    }

    return data
}

// Controller for Project board

Controller.prototype.setProjectEvents = function () {
    this.view.getElements('.add-item').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.createItem(button.id.split('-')[2]))
    })
    this.view.getElements('.item').forEach((item) => {
        this.view.addEvent(item.id, 'dragstart', (event) => this.dragStarted(event, item.id))
        this.view.addEvent(item.id, 'dragend', (event) => this.dragEnded(event, item.id))
    })
    this.view.getElements('.droppable').forEach((element) => {
        this.view.addEvent(element.id, 'dragenter', (event) => this.dragEnter(event))
    })
    this.view.addEvent('help-button', 'click', () => this.view.showHelp())
}

Controller.prototype.createItem = function (listID) {
    this.model.addItem(listID, {
        id: this.model.uid(),
        title: 'Item'
    })
    this.refresh('Project', { projectID: this.currentProject })
}

Controller.prototype.removeItem = function (itemID) {
    this.model.removeItem(itemID)
    this.refresh('Project', { projectID: this.currentProject })
}

Controller.prototype.dragStarted = function (event, id) {
    event.dataTransfer.setData('id', id)
    event.dataTransfer.dropEffect = 'move'
    event.currentTarget.style.opacity = '0.6'
    console.log('drag-start', event, id);
}

Controller.prototype.dragEnded = function (event, itemID) {
    if (document.querySelector('.drag-preview')) {
        document.querySelector('.drag-preview').remove()
    }
    event.target.style.opacity = '1'
    console.log('drag-end');

}

Controller.prototype.dragEnter = function (event) {
    if (event.dataTransfer.types.includes('id') && !isPreview(event.fromElement) && !isSelected(event.currentTarget) && !previousIsSelected(event.currentTarget)) {
        event.preventDefault();
        console.log('aaa');
        event.currentTarget.parentNode.insertBefore(this.createDragPreview(), event.currentTarget)
    }
    console.log('drag-enter', event);

}

function isPreview(element) {
    return element && element.className === 'drag-preview'
}

function isSelected(element) {
    return element && element.style && element.style.opacity === '0.6'
}

function previousIsSelected(element) {
    return Array.from(element.parentNode.children).findIndex(el => el == element) !== 0 && Array.from(element.parentNode.children)[Array.from(element.parentNode.children).findIndex(el => el == element) - 2].style.opacity === '0.6'
}

Controller.prototype.createDragPreview = function () {
    document.querySelectorAll('.drag-preview').forEach(element => element.remove())
    let previewElement = document.createElement('div')
    previewElement.className = 'drag-preview'
    previewElement.innerHTML = '<div class="dashed"></>'
    previewElement.ondragover = (event) => event.preventDefault()
    previewElement.ondragleave = (event) => event.currentTarget.remove()
    previewElement.ondrop = (event) => this.dragDropped(event)
    return previewElement
}

Controller.prototype.dragDropped = function (event) {
    let sourceItemID = event.dataTransfer.getData('id').split('-')[1]
    let sourceItem = Object.assign({}, this.model.getItem(sourceItemID))
    let targetListID = event.currentTarget.parentNode.id.split('-')[2]
    let targetPosition = this.targetPosition(event, sourceItemID, targetListID)
    this.model.removeItem(sourceItemID)
    this.model.insertItem(targetListID, sourceItem, targetPosition)
    this.refresh('Project', { projectID: this.currentProject })
}

Controller.prototype.targetPosition = function (event, sourceItemID, targetListID) {
    if (nextIsItem()) {
        console.log('asss ', event);
        let targetItemID = event.currentTarget.nextSibling.id.split('-')[1]
        let sourceListID = this.model.getItemList(sourceItemID).id
        if (targetListID === sourceListID && this.model.getItemIndex(sourceItemID) < this.model.getItemIndex(targetItemID)) {
            return this.model.getItemIndex(targetItemID) - 1
        } else {
            return this.model.getItemIndex(targetItemID)
        }
    } else {
        return this.model.getList(targetListID).items.length
    }
}

function nextIsItem() {
    return !event.currentTarget.nextSibling.className.includes('add-item')
}

