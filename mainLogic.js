/* mainLogic.js is a javascript module for many important function in this system */

// this is the base url for Tarmeez academy api
const baseUrl = "https://tarmeezacademy.com/api/v1";

/* setup the user interface depending
 * on the login conditions.
 */
function setupUi() {
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("main-login-btn");
  const register = document.getElementById("main-register-btn");
  const logout = document.getElementById("main-logout");
  const profileUserName = document.getElementById("nav-username");
  const profileUserImage = document.getElementById("nav-user-image");

  // add button
  const addBtn = document.getElementById("add-btn");

  if (token == null) {
    if (addBtn != null) {
      addBtn.style.display = "none";
    }
    loginBtn.style.display = "block";
    register.style.display = "block";
    logout.style.display = "none";
    profileUserName.style.display = "none";
    profileUserImage.style.display = "none";
  } else {
    if (addBtn != null) {
      addBtn.style.display = "flex";
    }
    loginBtn.style.display = "none";
    register.style.display = "none";
    logout.style.display = "block";
    profileUserImage.style.display = "block";
    profileUserName.style.display = "block";

    const user = getCurrentUser();
    profileUserName.innerHTML = user.username;
    profileUserImage.setAttribute("src", user.profile_image);
  }
}

/*===== Auth functions===== */

// Register function
document.getElementById("register-btn").addEventListener("click", () => {
  const name = document.getElementById("register-name-feld").value;
  const userName = document.getElementById("register-username-feld").value;
  const password = document.getElementById("register-password-feld").value;
  const image = document.getElementById("register-image-feld").files[0];

  const params = new FormData();
  params.append("name", name);
  params.append("username", userName);
  params.append("password", password);
  params.append("image", image);

  // const bodyParams = {
  //   username: userName,
  //   password: password,
  //   name: name,
  // };

  const url = `${baseUrl}/register`;

  axios
    .post(url, params)
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");
      const instanceModal = bootstrap.Modal.getInstance(modal);
      instanceModal.hide();
      showAlert("registered successfully!", "success");
      setupUi();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
});

// Login function
document.getElementById("login-btn").addEventListener("click", () => {
  const usernameData = document.getElementById("username-feld").value;
  const passwordData = document.getElementById("password-feld").value;

  const bodyParams = {
    username: usernameData,
    password: passwordData,
  };

  const url = `${baseUrl}/login`;

  axios.post(url, bodyParams).then((response) => {
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");
    const instanceModal = bootstrap.Modal.getInstance(modal);
    instanceModal.hide();
    showAlert("Logged in successfully!", "success");
    setupUi();
  });
});

// logout function
document.getElementById("main-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged out successfully!", "success");
  setupUi();
});

/*=====// Auth functions //===== */

/* Alart function
 * this function is responsible for show succses alart or error alart
 * in many scenarios, like: login or logout or add post...etc
 */
function showAlert(message, color) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(message, color);

  // hide alert
  // const alart = bootstrap.Alert.getOrCreateInstance(
  //   "#liveAlertPlaceholder"
  // );
  // setTimeout(() => {
  //   alart.close();
  // }, 2000);
}

/* get current user is responsible for get user information
 * from local storage, return null if thair is no user.
 */
function getCurrentUser() {
  let user = null;
  let storageUser = JSON.parse(localStorage.getItem("user"));

  if (storageUser != null) {
    user = storageUser;
  }

  return user;
}
