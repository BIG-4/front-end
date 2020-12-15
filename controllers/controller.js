
window.app = window.app || {}
window.app.Controller = Controller

function Controller(model, view) {
    this.model = model
    this.view = view
    this.searchTemp = window.app.SearchTemplate
    this.projectTemp = window.app.ProjectTemplate
    this.homeTemp = window.app.HomeTemplate

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
        // this.currentProject = args.projectID
        // this.view.render(page, { project: this.model.getProject(this.currentProject) })
        document.querySelector('content').innerHTML = this.projectTemp.Project(args.project.project_id, args.project.project_name, args.project.tasks)
        this.setProjectEvents()
        this.setHeaderEvents()

    } else if (page === 'Account') {
        this.view.render(page, {})
        this.setHeaderEvents()
    }
}

Controller.prototype.setHeaderEvents = function () {
    this.view.addEvent('nav-home', 'click', () => this.refresh('Home'))
    this.view.addEvent('nav-acc', 'click', () => this.refresh('Account'))
    this.view.addEvent('nav-func', 'click', () => this.refresh('Funtion'))
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

Controller.prototype.openProject = function (projectID) {

    this.model.getData(api_url + '/project?id=' + projectID.toString())
        .then(res => {
            this.refresh('Project', { project: res.data })
        })
}

// Controller for Search page
Controller.prototype.setSearchEvents = function () {
    this.view.addEvent('search', 'click', () => this.Search())
    this.view.addEvent('reset', 'click', () => this.Reset())
}

Controller.prototype.Search = function () {
    var key = this.view.getElement('#search-key').value
    var prj = this.view.getElement('#search-prj').value
    var status = this.view.getElement('#search-status').value

    var data = {
        key: key,
        prj: prj,
        status: status
    }


    var path_key = 'key=' + key
    var path_prj = prj == 'all' ? '' : '&project_id=' + prj
    var path_status = status == 'all' ? '' : '&status_id=' + status

    this.model.getData(api_url + '/tasks/search?' + path_key + path_prj + path_status)
        .then(res => {
            console.log(res.data);
            this.refresh('Search', { items: res.data, data: data })
        })
}

Controller.prototype.Reset = function () {

}

// Controller for Project board

Controller.prototype.setProjectEvents = function () {
    this.view.addEvent('back-page', 'click', () => this.refresh('Home'))
    this.view.addEvent('add-list', 'click', (event) => this.createList())
    this.view.getElements('.remove-list').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.removeList(button.id.split('-')[2]))
    })
    this.view.getElements('.add-item').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.createItem(button.id.split('-')[2]))
    })
    this.setTitleEditionEvents('project-title', 'project-title-input', 'project')
    this.view.getElements('.list-title').forEach((list) => {
        this.setTitleEditionEvents(list.id, list.id + '-input', 'list')
    })
    this.view.getElements('.item').forEach((item) => {
        this.setTitleEditionEvents(item.id, item.id + '-input', 'item')
        this.view.addEvent(item.id, 'dragstart', (event) => this.dragStarted(event, item.id))
        this.view.addEvent(item.id, 'dragend', (event) => this.dragEnded(event, item.id))
    })
    this.view.getElements('.droppable').forEach((element) => {
        this.view.addEvent(element.id, 'dragenter', (event) => this.dragEnter(event))
    })
    this.view.addEvent('help-button', 'click', () => this.view.showHelp())
}

Controller.prototype.setTitleEditionEvents = function (textID, inputID, type) {
    let elementID = type === 'project' ? this.currentProject : textID.split('-')[1]
    this.view.addEvent(textID, 'click', () => this.view.showTitleInput(textID, inputID))
    this.view.addEvent(inputID, 'blur', () => this.changeElementTitle(type, elementID, this.view.getElement('#' + inputID).value))
    if (type !== 'item') {
        this.view.addEvent(inputID, 'keyup', (e) => e.code === 'Enter' && this.changeElementTitle(type, elementID, this.view.getElement('#' + inputID).value))
    }
}

Controller.prototype.createList = function () {
    this.model.addList(this.currentProject, {
        id: this.model.uid(),
        title: 'List',
        items: [],
    })
    this.refresh('Project', { projectID: this.currentProject })
}

Controller.prototype.removeList = function (listID) {
    this.view.showModal('Remove list', 'Are you sure you want to remove this list?', true, () => {
        this.model.removeList(listID)
        this.refresh('Project', { projectID: this.currentProject })
    })
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

Controller.prototype.changeElementTitle = function (type, id, value) {
    if (value === '') {
        if (type !== 'item') {
            this.view.setInputError(type == 'project' ? 'project-title-input' : 'list-' + id + '-title-input')
        } else {
            this.removeItem(id)
        }
    } else {
        if (type === 'project') {
            this.model.updateProjectTitle(id, value)
        } else if (type === 'list') {
            this.model.updateListTitle(id, value)
        } else if (type === 'item') {
            this.model.updateItemTitle(id, value)
        }
        this.refresh('Project', { projectID: this.currentProject })
    }
}

Controller.prototype.dragStarted = function (event, id) {
    event.dataTransfer.setData('id', id)
    event.dataTransfer.dropEffect = 'move'
    event.currentTarget.style.opacity = '0.6'
}

Controller.prototype.dragEnded = function (event, itemID) {
    if (document.querySelector('.drag-preview')) {
        document.querySelector('.drag-preview').remove()
    }
    event.target.style.opacity = '1'
}

Controller.prototype.dragEnter = function (event) {
    if (event.dataTransfer.types.includes('id') && !isPreview(event.fromElement) && !isSelected(event.currentTarget) && !previousIsSelected(event.currentTarget)) {
        event.preventDefault();
        event.currentTarget.parentNode.insertBefore(this.createDragPreview(), event.currentTarget)
    }
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

