window.app = window.app || {}

function Account() {
  return `<header class="shadow header " style="height: 56px">
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

window.app.AccountTemplate = { Account }
