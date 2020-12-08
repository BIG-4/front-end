
window.app = window.app || {}
window.app.Controller = Controller

function Controller(model, view) {
    this.model = model
    this.view = view
    this.refresh('Login')
    this.view.setBackground()
}

Controller.prototype.refresh = function (page, args) {
    if (page === 'Home') {
        this.view.render(page, { projects: this.model.getProjects() })
        this.setHomeEvents()
    } else if (page === 'Login') {
        this.view.render(page, {})
        this.setLoginEvents()
    } else if (page === 'Project') {
        this.currentProject = args.projectID
        this.view.render(page, { project: this.model.getProject(this.currentProject) })
        this.setProjectEvents()
    }
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
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "ajaxfile.php", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Response
            var response = this.responseText;
        }
    };
    var data = {
        email: document.getElementById('signInEmail').value,
        password: document.getElementById('signInPassword').value
    };;
    xhttp.send(JSON.stringify(data));
    this.refresh('Home');
}

// Controller for home page

Controller.prototype.setHomeEvents = function () {
    this.view.addEvent('add-project', 'click', () => this.createProject())
    this.view.getElements('.remove-project').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.removeProject(button.id.split('-')[2]))
    })
    this.view.getElements('.project-button').forEach((button) => {
        this.view.addEvent(button.id, 'click', () => this.openProject(button.id.split('-')[2]))
    })
}

Controller.prototype.createProject = function () {
    this.view.showProjectModal('New Project')
    this.view.addEvent('close-modal', 'click', () => this.view.closeModal())

    this.view.addEvent('modal-submit', 'click', () => {
        this.model.addProject({
            id: this.model.uid(),
            title: document.getElementById('p_name').value,
            lists: []
        })
        console.log(document.getElementById('p_name').value);
        this.refresh('Home');
    })
    // this.refresh('Home');
}

Controller.prototype.removeProject = function (projectID) {
    this.view.showModal('Remove project', 'Are you sure you want to remove this project?', true, () => {
        this.model.removeProject(projectID)
        this.refresh('Home')
    })
}

Controller.prototype.openProject = function (projectID) {
    this.refresh('Project', { projectID })
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

