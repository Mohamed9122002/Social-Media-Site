    // let currentPage = 1
    // let lastPage = 1
    //  infinite scroll Js
    // window.addEventListener('scroll', function () {
    //     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight
    //      console.log(endOfPage)
// pagination
    //     if (endOfPage && currentPage < lastPage) {
    //         currentPage = currentPage + 1
    //         getPosts(false, currentPage)

    //     }
    // })

//  get post the page
    // const getPosts = (reload = true, page = 1) => {
    //     axios.get(`${baseURL}/posts?limit=2&page=${page}`).then((response) => {
    //         const posts = response.data.data
    //         lastPage = response.data.meta.last_page
    //         if (reload) {
    //             document.getElementById('posts').innerHTML = ""
    //         }
const baseURL = "https://tarmeezacademy.com/api/v1";
// get post the page
const getPosts = () => {
    axios
        .get(`${baseURL}/posts`)
        .then((response) => {
            const posts = response.data.data;
            document.getElementById("posts").innerHTML = "";
            for (post of posts) {
                console.log(post);
                const author = post.author;
                let postTitle = "";
                // start  show or hide edit button the user login
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                let editBtnContent = "";
                if (isMyPost) {
                    editBtnContent = `
                    <button class='ms-2 btn btn-danger float-end' onclick="deletePostBtnClicked('${encodeURIComponent(
                        JSON.stringify(post)
                    )}')">Delete</button>
                    <button class='btn btn-secondary float-end' onclick="editPostBtnClicked('${encodeURIComponent(
                        JSON.stringify(post)
                    )}')">Edit</button>

                    `;
                }
                // end show or hide edit button the user login

                if (post.title != null) {
                    postTitle = post.title;
                }
                let content = `
            <div class="card shadow-lg my-4">
            <div class="card-header">
            <span  onclick="userClicked(${author.id})" style="cursor: pointer;">
            <img style="height: 40px; width: 40px;" class="rounded-circle " src="${author.profile_image}"alt=''>
            <b>${author.username}</b>
            </span>

                ${editBtnContent}
            </div>
            <div class="card-body" onclick="postClick(${post.id})">
                <img class="w-100" src=${post.image} alt="">
                <h6 class="mt-1" style="color: rgb(193,193,193);">${post.created_at}</h6>
                <h5 class="card-title">${postTitle}</h5>
                <p class="card-text">${post.body}</p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-brush" viewBox="0 0 16 16">
                        <path
                            d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
                    </svg>
                    <span>${post.comments_count} Comments
                    </span>
                </div>
            </div>
        </div>
            `;
                document.getElementById("posts").innerHTML += content;
            }
        })
        .catch((error) => {
            alert(error);
        });
};
getPosts();
// update post post
function editPostBtnClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj));
    console.log(post);
    document.getElementById("post-id-input").value = post.id;
    document.getElementById("post-modal-title").innerHTML = "Edit Post";
    document.getElementById("post-title-input").value = post.title;
    document.getElementById("post-body-input").value = post.body;
    document.getElementById("create-new-post").innerHTML = "Update";
    // copy create post model
    let postModal = new bootstrap.Modal(
        document.getElementById("create-post-modal")
    );
    postModal.toggle();
}
function deletePostBtnClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj));
    document.getElementById("delete-post-id-input").value = post.id;
    // console.log(post)
    // copy create post model
    let postModal = new bootstrap.Modal(
        document.getElementById("delete-post-modal")
    );
    postModal.toggle();
}
//s delete post
document.getElementById("delete-post").addEventListener("click", () => {
    const postId = document.getElementById("delete-post-id-input").value;
    // alert(postId)
    const url = `${baseURL}/posts/${postId}`;
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
    };
    axios
        .delete(url, {
            headers: headers,
        })
        .then((response) => {
            // console.log(response)
            const model = document.getElementById("delete-post-modal");
            const modalInstance = bootstrap.Modal.getInstance(model);
            modalInstance.hide();
            showAlert("the post has been deleted successfully ", `success`);
            getPost();
        })
        .catch((error) => {
            const message = error.response.data.message;
            showAlert(message, "danger");
        });
});
// create post
function addBtnClicked() {
    document.getElementById("post-id-input").value = "";
    document.getElementById("post-modal-title").innerHTML = "createPost";
    document.getElementById("post-title-input").value = "";
    document.getElementById("post-body-input").value = "";
    document.getElementById("create-new-post").innerHTML = "create";
    // copy create post model
    let postModal = new bootstrap.Modal(
        document.getElementById("create-post-modal")
    );
    postModal.toggle();
}

// addEventListener("click")
//  for login  in user
document.getElementById("login").addEventListener("click", () => {
    const userName = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;
    const params = {
        username: userName,
        password: password,
    };
    const url = `${baseURL}/login`;
    axios.post(url, params).then((response) => {
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        // close the model
        const model = document.getElementById("login-modal");
        const modalInstance = bootstrap.Modal.getInstance(model);
        modalInstance.hide();
        showAlert("login in ", `success`);
        // refresh
        setupUI();
        // console.log(token)
    });
});
// register newUser
document.getElementById("Register").addEventListener("click", () => {
    const name = document.getElementById("R-name-input").value;
    const userName = document.getElementById("R-username-input").value;
    const password = document.getElementById("R-password-input").value;
    const image = document.getElementById("R-image-input").files[0];
    // console.log(body,title)
    // form data
    let fomData = new FormData();
    fomData.append("name", name);
    fomData.append("username", userName);
    fomData.append("password", password);
    fomData.append("image", image);
    // const params = {
    // "title": title,
    // "body": body,
    // }

    const headers = {
        "Content-Type": "multipart/form-data",
    };
    // console.log(name,userName,password)

    const url = `${baseURL}/register`;
    axios
        .post(url, fomData, {
            headers: headers,
        })
        .then((response) => {
            console.log(response);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
            // close the model
            const model = document.getElementById("register-modal");
            const modalInstance = bootstrap.Modal.getInstance(model);
            modalInstance.hide();
            shadowSuccessAlert("New user Registered successfully");
            setupUI();
        })
        .catch((error) => {
            const message = error.response.data.message;
            showAlert(message, `danger`);
        });
});
// create new post model
// to dos
document.getElementById("create-new-post").addEventListener("click", () => {
    //  edit post
    let postId = document.getElementById("post-id-input").value;
    // create
    let isCreate = postId == null || postId == "";
    // alert(isCreate)
    const title = document.getElementById("post-title-input").value;
    const body = document.getElementById("post-body-input").value;
    const image = document.getElementById("post-image-input").files[0];
    // console.log(body,title)
    // form data
    let fomData = new FormData();
    fomData.append("title", title);
    fomData.append("body", body);
    fomData.append("image", image);
    // const params = {
    // "title": title,
    // "body": body,
    // }
    const token = localStorage.getItem("token");
    let url = ``;
    const headers = {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
    };
    // create
    if (isCreate == true) {
        url = `${baseURL}/posts`;
    }
    // edit
    else {
        fomData.append("_method", "put");
        url = `${baseURL}/posts/${postId}`;
    }
    // end edit

    axios
        .post(url, fomData, {
            headers: headers,
        })
        .then((response) => {
            console.log(response);
            // close the model
            const model = document.getElementById("create-post-modal");
            const modalInstance = bootstrap.Modal.getInstance(model);
            modalInstance.hide();
            shadowSuccessAlert("New user Registered successfully");
            getPosts();
        })
        .catch((error) => {
            const message = error.response.data.message;
            showAlert(message, "danger");
        });
});

// for logged in user
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // alert('logged out successful')
    showAlert("logged out", `success`);
    // refresh
    setupUI();
});

const showAlert = (costMes, type) => {
    const alertPlaceholder = document.getElementById("success-alert");
    function alert(message, type) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = ` '<div class="alert alert-${type} alert-dismissible" role="alert">
        <div>${message}</div>
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        </button>
        </div>';`;

        alertPlaceholder.append(wrapper);
    }
    alert(costMes, type);
    // hide the start
    setTimeout(() => {
        const al = bootstrap.Alert.getOrCreateInstance("#success-alert");
        // al.close()
    }, 2000);
};
// non-logged in user
const setupUI = () => {
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logOut = document.getElementById("logout-btn");
    const addBtn = document.getElementById("add-btn");

    if (token == null) {
        //user is guest not logged in
        addBtn.style.visibility = "hidden";
        loginBtn.style.visibility = "visible";
        registerBtn.style.visibility = "visible";
        logOut.style.visibility = "hidden";
    } else {
        //user is guest  logged in
        addBtn.style.visibility = "visible";
        loginBtn.style.visibility = "hidden";
        registerBtn.style.visibility = "hidden";
        logOut.style.visibility = "visible";
        // username
        const user = getCurrentUser();
        document.getElementById("nav-username").innerHTML = user.username;
        // profile image
        document.getElementById("img-profile").src = user.profile_image;
    }
};
setupUI();

function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem("user");
    if (storageUser != null) {
        user = JSON.parse(storageUser);
    }
    return user;
}
function postClick(postId) {
    window.location = `Post.html?postId=${postId}`;
    // alert(postId)
}
// import url in the page
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
// get post page post.html
// console.log(id);
function getPost() {
    axios
        .get(`${baseURL}/posts/${id}`)
        .then((response) => {
            const post = response.data.data;
            console.log(post);
            const comments = post.comments;
            const author = post.author;
            let postTitle = "";
            if (post.title !== null) {
                postTitle = post.title;
            }
            document.getElementById("username").innerHTML = author.username;
            let commentsContent = "";
            for (comment of comments) {
                commentsContent += `
            <div class="p-3" style="background-color: #eee;">
            <div>
                <img src="${comment.author.profile_image}" class="rounded-circle image" alt="">
                <b>${comment.author.username}</b>
            </div>
            <div>
                ${comment.body}
            </div>
        </div>
            `;
            }
            const postContent = `
        <div class="card shadow-lg my-4">
        <div class="card-header">
            <img class="rounded-circle image" src="${author.profile_image}" alt="">
            <b>${author.username}</b>
        </div>
        <div class="card-body">
            <img class="w-100" src="${post.image}" alt="">
            <h6 class="mt-1"">${post.created_at} </h6>
            <h5 class="card-title">${postTitle}</h5>
            <p class="card-text">${post.body}</p>
            <hr>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-brush" viewBox="0 0 16 16">
                    <path
                        d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
                </svg>
                <span>${post.comments_count}</span>
            </div>
        </div>
        <div id="comments">
        ${commentsContent}
        </div>
        <div class="input-group mb-3 " id="add-comment-div">
        <input type="text" id="comment-input" placeholder="add your comment here" class="form-control">
        <button class="btn btn-outline-primary" type="button"onclick="createCommentClick()" >send</button>
    </div>
    </div>
        `;
            document.getElementById("post").innerHTML = postContent;

            console.log(post);
        })
        .catch((error) => {
            alert(error);
        });
}
getPost();
// create comment
function createCommentClick() {
    let commentBody = document.getElementById("comment-input").value;
    let token = localStorage.getItem("token");
    let params = {
        body: commentBody,
    };
    let url = `${baseURL}/posts/${id}/comments`;
    axios
        .post(url, params, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log(response);
            showAlert("the comment has been created success", "success");
            // refers
            getPost();
        })
        .catch((err) => {
            const errorMessage = err.response.data.message;
            showAlert(errorMessage, "danger");
        });
}
// profile
function getUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("userId");

    axios.get(`${baseURL}/users/${id}`).then((response) => {
        // console.log(response)
        const user = response.data.data;
        console.log(user);
        // email name username image
        document.getElementById("main-nfo-image").src = user.profile_image;
        document.getElementById("main-info-email").innerHTML = user.email;
        document.getElementById("main-info-name").innerHTML = user.name;
        document.getElementById("main-info-username").innerHTML = user.username;
        document.getElementById("username-post").innerHTML = user.username;
        // post count & comments count
        document.getElementById("post-count").innerHTML = user.posts_count;
        document.getElementById("comments-count").innerHTML = user.comments_count;
    });
}
getUser();
function getUserPost() {
    //6696
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("userId");

    axios
        .get(`${baseURL}/users/${id}/posts`)
        .then((response) => {
            // console.log(response)
            const posts = response.data.data;
            console.log(posts);
            document.getElementById("user-post").innerHTML = "";
            for (post of posts) {
                const author = post.author;
                let postTitle = "";
                // start  show or hide edit button the user login
                let user = getCurrentUser();
                let isMyPost = user != null && post.author.id == user.id;
                let editBtnContent = "";

                if (isMyPost) {
                    editBtnContent = `
                    <button class='ms-2 btn btn-danger float-end' onclick="deletePostBtnClicked('${encodeURIComponent(
                        JSON.stringify(post)
                    )}')">Delete</button>
                    <button class='btn btn-secondary float-end' onclick="editPostBtnClicked('${encodeURIComponent(
                        JSON.stringify(post)
                    )}')">Edit</button>

                    `;
                }
                if (post.title != null) {
                    postTitle = post.title;
                }
                let content = `
            <div class="card shadow-lg my-4">
            <div class="card-header">
                <img style="height: 40px; width: 40px;" class="rounded-circle " src="${author.profile_image}"alt=''>
                <b>${author.username}</b>
                ${editBtnContent}
            </div>
            <div class="card-body" onclick="postClick(${post.id})">
                <img class="w-100" src=${post.image} alt="">
                <h6 class="mt-1" style="color: rgb(193,193,193);">${post.created_at}</h6>
                <h5 class="card-title">${postTitle}</h5>
                <p class="card-text">${post.body}</p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-brush" viewBox="0 0 16 16">
                        <path
                            d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
                    </svg>
                    <span>${post.comments_count} Comments
                    </span>
                </div>
            </div>
        </div>
            `;
                document.getElementById("user-post").innerHTML += content;
            }
        })
        .catch((error) => {
            alert(error);
        });
}
getUserPost();
// user clicked name  and image
function userClicked(userId) {
    // change url page
    window.location = `profile.html?userId=${userId}`;
    // alert("he")
}
// get post login user
function profileClicked() {
    const user = getCurrentUser();
    window.location = `profile.html?userId=${user.id}`;
}
