(function () {

    window.app = window.app || {}
    window.app.Model = Model

    const api_url = "http://localhost:2000";
    const api_key = "ahjgdj87698bjb89#sfksdfsfb#278";


    function Model() {
        this.getData(api_url + '/project').then(res => {
            this.projects = res.data;
        })

        this.getData(api_url + '/users').then(res => {
            this.users = res.data
        })
    }

    // api

    Model.prototype.getData = async function (url) {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "api_key": api_key,
                "user_id": localStorage.getItem("user_id"),
                "auth_token": localStorage.getItem("auth_token"),
                "access_token": localStorage.getItem("access_token")
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        });
        return response.json();
    }

    Model.prototype.logData = async function (url, data) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "api_key": api_key
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    Model.prototype.createData = async function (url, data) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "api_key": api_key,
                "user_id": localStorage.getItem("user_id"),
                "auth_token": localStorage.getItem("auth_token"),
                "access_token": localStorage.getItem("access_token")
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    Model.prototype.updateData = async function (url, data) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "api_key": api_key,
                "user_id": localStorage.getItem("user_id"),
                "auth_token": localStorage.getItem("auth_token"),
                "access_token": localStorage.getItem("access_token")
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }


    Model.prototype.delData = async function (url) {
        const response = await fetch(url, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                "api_key": api_key,
                "user_id": localStorage.getItem("user_id"),
                "auth_token": localStorage.getItem("auth_token"),
                "access_token": localStorage.getItem("access_token")
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // home page

    Model.prototype.addProject = function (project) {
        this.projects.push(project)
    }

    Model.prototype.getProjects = function () {
        return this.projects
    }

    Model.prototype.getUsers = function () {
        return this.users
    }

    Model.prototype.getProject = async function (projectID) {
        var project = await this.getData(api_url + '/project?id=' + projectID.toString())
            .then(res => {
                return res.data
            })
        console.log(project);
        return project;
    }

    Model.prototype.getAsyncData = async function (url) {
        var result = await this.getData(url)
            .then(res => {
                return res.data
            })
        return result
    }

    Model.prototype.addItem = function (listID, item) {
        this.getList(listID).items.push(item)
    }

    Model.prototype.insertItem = function (listID, item, position) {
        this.getList(listID).items = this.getList(listID).items.slice(0, position).concat(item).concat(this.getList(listID).items.slice(position))
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
        this.getData(api_url + '/task?id=' + itemID)
            .then(res => {
                return res.data.status_id
            })
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