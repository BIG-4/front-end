(function () {

    window.app = window.app || {}
    window.app.Model = Model

    function Model() {
        this.projects = []
    }

    Model.prototype.uid = function () {
        return Array(5).fill().map(i => Math.floor(Math.random() * (10 - 0)) + 0).join('')
    }

    Model.prototype.addProject = function (project) {
        this.projects.push(project)
    }

    Model.prototype.addList = function (projectID, list) {
        this.getProject(projectID).lists.push(list)
    }

    Model.prototype.addItem = function (listID, item) {
        this.getList(listID).items.push(item)
    }

    Model.prototype.insertItem = function (listID, item, position) {
        this.getList(listID).items = this.getList(listID).items.slice(0, position).concat(item).concat(this.getList(listID).items.slice(position))
    }

    Model.prototype.getProjects = function () {
        return this.projects
    }

    Model.prototype.getProject = function (projectID) {
        return this.projects.find(project => project.id == projectID)
    }

    Model.prototype.getList = function (listID) {
        return this.getListProject(listID).lists.find(list => list.id == listID)
    }

    Model.prototype.getListProject = function (listID) {
        return this.projects.find(project => project.lists.find(list => list.id == listID))
    }

    Model.prototype.getItem = function (itemID) {
        return this.getItemList(itemID).items.find((item) => item.id == itemID)
    }

    Model.prototype.getItemList = function (itemID) {
        let itemList
        this.projects.forEach(project => {
            project.lists.forEach(list => {
                list.items.forEach(item => {
                    if (item.id == itemID) {
                        itemList = list
                    }
                })
            })
        })
        return itemList
    }

    Model.prototype.updateProjectTitle = function (projectID, title) {
        this.getProject(projectID).title = title
    }

    Model.prototype.updateListTitle = function (listID, title) {
        this.getList(listID).title = title
    }

    Model.prototype.updateItemTitle = function (itemID, title) {
        this.getItem(itemID).title = title
    }

    Model.prototype.removeProject = function (projectID) {
        this.projects.splice(this.getProjectIndex(projectID), 1)
    }

    Model.prototype.removeList = function (listID) {
        this.getListProject(listID).lists.splice(this.getListIndex(listID), 1)
    }

    Model.prototype.removeItem = function (itemID) {
        this.getItemList(itemID).items.splice(this.getItemIndex(itemID), 1)
    }

    Model.prototype.getProjectIndex = function (projectID) {
        return this.projects.findIndex(project => project.id === projectID)
    }

    Model.prototype.getListIndex = function (listID) {
        return this.getListProject(listID).lists.findIndex(list => list.id == listID)
    }

    Model.prototype.getItemIndex = function (itemID) {
        return this.getItemList(itemID).items.findIndex((item) => item.id == itemID)
    }
    /*
        Model.prototype.getProjectsCount = function () {
            return this.projects.length
        }
    
        Model.prototype.getListsCount = function () {
            return this.projects.reduce((sum, project) => sum += project.lists.length, 0)
        }
    
        Model.prototype.getItemsCount = function () {
            return this.projects.reduce((sum, project) => sum += project.lists.reduce((sumI, list) => sumI += list.items.length, 0), 0)
        }
    */
})()